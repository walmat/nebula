import { load } from 'cheerio';

import { ShopifyTask } from './base';

import { ShopifyContext } from '../../../common/contexts';
import { Task as TaskConstants } from '../../constants';
import {
  emitEvent,
  waitForDelay,
  isImproperStatusCode
} from '../../../common/utils';

import { Forms, urlForStore } from '../../utils';
import {
  initialize,
  submitCart,
  getPayment,
  getSession,
  submitPayment,
  submitCheckpoint,
  clearCart,
  getPreloadProduct
} from '../functions';
import { Product } from '../../types/product';
import CAPTCHA_TYPES from '../../../../utils/captchaTypes';

const { submitPaymentForm, addToCart } = Forms;
const { States, Modes } = TaskConstants;

const extractInStockProduct = (products: Product[]) => {
  let found = null;

  // eslint-disable-next-line no-restricted-syntax
  for (const product of products) {
    const { variants } = product;

    found = variants.find(v => v.available === true);
    if (found) {
      break;
    }
  }

  return found;
};

export class PfutileTask extends ShopifyTask {
  constructor(context: ShopifyContext) {
    super(context, States.GET_HOMEPAGE);
    this.preloading = true;
    this.solvedCheckpoint = false;
    this.count = 0;
    this.preload = {};

    const {
      checkpointManager,
      task: {
        store: { url }
      }
    } = this.context;

    checkpointManager.start(url);
  }

  async checkForCheckpoint() {
    const {
      checkpointManager,
      task: {
        store: { url }
      }
    } = this.context;

    if (checkpointManager.isLive(url)) {
      clearInterval(this.checkpointInterval);
      this.checkpointInterval = null;

      this.checkpointUrl = `${url}/checkpoint?return_to=${encodeURIComponent(
        `${url}/cart`
      )}`;

      await this.injectRequester({
        redirect: this.checkpointUrl,
        type: CAPTCHA_TYPES.RECAPTCHA_V2C
      });
    }
  }

  restart = async () => {
    const {
      checkpointManager,
      task: {
        store: { url }
      }
    } = this.context;

    await super.restart();
    this.context.task.mode = Modes.PFUTILE;
    this.preloading = true;
    this.solvedCheckpoint = false;
    this.count = 0;
    this.preload = {};

    if (!this.checkpointInterval) {
      checkpointManager.start(url);
      this.checkpointInterval = setInterval(this.checkForCheckpoint, 500);
    }

    return States.GET_HOMEPAGE;
  };

  async getConfig() {
    const nextState = await super.getConfig();

    this.context.task.mode = Modes.PFUTILE;
    this.preloading = true;
    this.preload = {};
    this.solvedCheckpoint = false;
    this.count = 0;

    if (nextState === States.DONE) {
      if (this.context.task.password) {
        return States.SUBMIT_PASSWORD;
      }

      if (this.context.task.account) {
        return States.GET_ACCOUNT;
      }

      return States.GET_PRODUCT;
    }

    return nextState;
  }

  async submitPassword() {
    const nextState = await super.submitPassword();

    if (nextState === States.DONE) {
      if (this.proceedTo) {
        const { proceedTo } = this;
        this.proceedTo = null;
        return proceedTo;
      }

      if (this.context.task.account) {
        return States.GET_ACCOUNT;
      }

      return States.GET_PRODUCT;
    }

    return nextState;
  }

  async waitForCheckpoint() {
    const {
      id,
      aborted,
      checkpointManager,
      task: {
        store: { url }
      }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    emitEvent(this.context, [id], { message: 'Waiting for checkpoint' });

    if (checkpointManager.isLive(url)) {
      this.checkpointUrl = `${url}/checkpoint?return_to=${encodeURIComponent(
        `${url}/cart`
      )}`;

      await this.injectRequester({
        type: CAPTCHA_TYPES.RECAPTCHA_V2C,
        redirect: this.checkpointUrl
      });

      return States.CAPTCHA;
    }

    this.delayer = waitForDelay(500, this.aborter.signal);
    await this.delayer;

    return States.WAIT_FOR_CHECKPOINT;
  }

  async getProduct() {
    const {
      id,
      task: { retry }
    } = this.context;

    const { nextState, data = {} } = await getPreloadProduct({
      handler: this.handler
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;
    if (statusCode === 401) {
      // switch to safe mode since we can't complete the preload path
      this.context.task.mode = Modes.SAFE;
      emitEvent(this.context, [id], {
        message: 'Password page',
        mode: Modes.SAFE
      });

      this.preloading = false;
      return States.WAIT_FOR_PRODUCT;
    }

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error preloading product [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_PRODUCT;
    }

    const { body } = data;
    if (!body?.products) {
      emitEvent(this.context, [id], {
        message: 'Error preloading product [UNKNOWN]'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_PRODUCT;
    }

    let products: Product[];
    // eslint-disable-next-line prefer-const
    ({ products } = body);

    if (!products?.length) {
      // switch to safe mode since we can't complete the preload
      this.context.task.mode = Modes.SAFE;
      emitEvent(this.context, [id], {
        message: 'No products loaded',
        mode: Modes.SAFE
      });

      this.preloading = false;
      return States.WAIT_FOR_PRODUCT;
    }

    const variant = extractInStockProduct(products);
    this.preload.variant = variant;
    return States.PRESUBMIT_CART;
  }

  async presubmitCart() {
    const {
      id,
      aborted,
      task: {
        retry,
        monitor,
        store: { url }
      }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    const {
      variant: { id: variant }
    } = this.preload;

    const { nextState, data } = await submitCart({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      storeUrl: url,
      productUrl: `${url}/`,
      form: addToCart({
        variant,
        quantity: 1,
        properties: [],
        injected: []
      })
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;
    if (statusCode === 404 && id !== 'RATE_FETCHER') {
      emitEvent(this.context, [id], { message: 'Variant not live' });

      this.delayer = waitForDelay(monitor, this.aborter.signal);
      await this.delayer;

      return States.PRESUBMIT_CART;
    }

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error adding to cart [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.PRESUBMIT_CART;
    }

    const { body } = data;
    if (!this.preloading) {
      await this.extractProduct(body);
    }

    if (this.hash) {
      if (!this.preloading) {
        this.merging = true;
        return States.GET_PAYMENT;
      }
      return States.GET_CUSTOMER;
    }

    if (/palaceskateboards/i.test(url)) {
      return States.GET_CART;
    }

    return States.INIT_CHECKOUT;
  }

  async submitCart() {
    const {
      aborted,
      task: {
        store: { url }
      }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    const nextState = await super.submitCart();
    if (nextState === States.DONE) {
      if (this.hash) {
        if (!this.preloading) {
          this.merging = true;
          return States.GET_PAYMENT;
        }
        return States.GET_CUSTOMER;
      }

      if (/palaceskateboards/i.test(url)) {
        return States.GET_CART;
      }

      return States.INIT_CHECKOUT;
    }

    return nextState;
  }

  async getCart() {
    const {
      aborted,
      task: {
        store: { url }
      }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    const nextState = await super.getCart();

    if (
      /palaceskateboards/i.test(url) &&
      nextState === States.INIT_CHECKOUT &&
      this.hash
    ) {
      return States.GET_CUSTOMER;
    }

    return nextState;
  }

  async clearCart() {
    const {
      id,
      task: { retry }
    } = this.context;

    const { nextState, data } = await clearCart({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;
    if (statusCode !== 200) {
      emitEvent(this.context, [id], {
        message: `Error clearing cart [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.CLEAR_CART;
    }

    this.preloading = false;
    return States.WAIT_FOR_PRODUCT;
  }

  async initialize() {
    const {
      id,
      task: {
        retry,
        store: { url: storeUrl }
      }
    } = this.context;

    const { nextState, data, redirect } = await initialize({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      storeUrl,
      productUrl: `${storeUrl}/`,
      form: this.form
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error initializing checkout [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.INIT_CHECKOUT;
    }

    if (redirect) {
      this.extractCheckoutHash(redirect);

      if (/checkpoint/i.test(redirect)) {
        await this.injectRequester({
          type: CAPTCHA_TYPES.RECAPTCHA_V2C,
          redirect
        });

        this.checkpointUrl = redirect;
        return States.CAPTCHA;
      }

      if (/throttle/i.test(redirect)) {
        this.proceedTo = !this.preloading
          ? States.GET_CUSTOMER
          : States.WAIT_FOR_CHECKPOINT;

        return this.enterQueue(States.INIT_CHECKOUT);
      }

      if (/account\/login/i.test(redirect)) {
        if (this.context.task.account) {
          this.proceedTo = States.INIT_CHECKOUT;
          return States.GET_ACCOUNT;
        }

        emitEvent(this.context, [id], {
          message: 'Account required'
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.INIT_CHECKOUT;
      }
    }

    if (this.solvedCheckpoint) {
      return States.GET_CUSTOMER;
    }

    return States.WAIT_FOR_CHECKPOINT;
  }

  async submitCheckpoint() {
    const {
      id,
      task: {
        retry,
        store: { url }
      }
    } = this.context;

    const { nextState, data = {}, redirect } = await submitCheckpoint({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      url,
      form: {
        ...(this.form as any)
      }
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;

    // caused by invalid auth token most likely, let's try to get it again
    if (statusCode === 403) {
      emitEvent(this.context, [id], {
        message: `Invalid authorization [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      await this.injectRequester({
        type: CAPTCHA_TYPES.RECAPTCHA_V2C,
        redirect: this.checkpointUrl
      });

      return States.CAPTCHA;
    }

    // probably was pulled midway of solving, so let's proceed
    if (statusCode === 404) {
      this.form = '';
      this.context.setCaptchaToken('');
      if (this.hash) {
        return States.GET_CUSTOMER;
      }

      return States.INIT_CHECKOUT;
    }

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting checkpoint [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_CHECKPOINT;
    }

    this.solvedCheckpoint = true;

    if (redirect) {
      this.extractCheckoutHash(redirect);

      if (/throttle/i.test(redirect)) {
        this.form = '';
        this.context.setCaptchaToken('');
        return this.enterQueue(States.GET_CUSTOMER);
      }

      if (/checkpoint/i.test(redirect)) {
        this.form = '';
        this.context.setCaptchaToken('');

        emitEvent(this.context, [id], {
          message: `Invalid authorization [${statusCode}]`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        await this.injectRequester({
          type: CAPTCHA_TYPES.RECAPTCHA_V2C,
          redirect: this.checkpointUrl
        });

        return States.CAPTCHA;
      }

      if (!this.hash) {
        this.form = '';
        this.context.setCaptchaToken('');
        this.proceedTo = States.GET_CUSTOMER;

        return States.INIT_CHECKOUT;
      }

      if (this.proceedTo) {
        const next = this.proceedTo;
        this.proceedTo = null;
        return next;
      }

      return States.GET_CUSTOMER;
    }

    this.form = '';
    this.context.setCaptchaToken('');

    emitEvent(this.context, [id], {
      message: `Invalid authorization [${statusCode}]`
    });

    this.delayer = waitForDelay(retry, this.aborter.signal);
    await this.delayer;

    await this.injectRequester({
      type: CAPTCHA_TYPES.RECAPTCHA_V2C,
      redirect: this.checkpointUrl
    });

    return States.CAPTCHA;
  }

  async getPayment() {
    const {
      id,
      shopId,
      task: {
        mode,
        retry,
        monitor,
        discount,
        store: { url }
      }
    } = this.context;

    const { nextState, data, redirect } = await getPayment({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      shopId,
      url,
      polling: this.polling
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    // reset flag for calculating taxes
    this.polling = false;

    const { statusCode } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting payment [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_PAYMENT;
    }

    if (this.merging) {
      if (!this.resubmitShipping) {
        this.resubmitShipping = true;
        return States.SUBMIT_SHIPPING;
      }

      return States.GET_PRICE;
    }

    if (redirect) {
      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.GET_PAYMENT;
        return this.enterQueue(States.GET_PAYMENT);
      }

      if (/stock_problems/i.test(redirect)) {
        emitEvent(this.context, [id], { message: 'Out of stock' });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_PAYMENT;
      }
    }

    const { body } = data;

    if (/Calculating taxes/i.test(body)) {
      this.polling = true;
      return States.GET_PAYMENT;
    }

    const $ = load(body, { xmlMode: false, normalizeWhitespace: true });
    if (discount && !this.appliedDiscount && mode !== Modes.FAST) {
      this.extractDiscountAuthToken($);
      return States.SUBMIT_DISCOUNT;
    }

    await Promise.allSettled([
      this.extractProtection($),
      this.extractAuthToken(
        'form.edit_checkout input[name=authenticity_token]',
        $
      ),
      this.extractGateway($),
      this.extractPrice($)
    ]);

    if (this.preloading) {
      return States.CLEAR_CART;
    }

    const stepState = this.extractStepToNextStep(States.GET_PAYMENT, body);

    if (stepState) {
      return stepState;
    }

    emitEvent(this.context, [id], {
      message: 'Error visiting payment [UNKNOWN]'
    });

    this.delayer = waitForDelay(retry, this.aborter.signal);
    await this.delayer;

    return States.GET_PAYMENT;
  }

  async getSession() {
    const {
      id,
      task: {
        retry,
        store: { url }
      }
    } = this.context;

    const profile = this.retrieveProfile();
    if (!profile) {
      emitEvent(this.context, [id], {
        message: 'Profile not found'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SESSION;
    }

    const { holder, exp, card, cvv } = profile.payment;

    const { nextState, data } = await getSession({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      message: '',
      json: {
        credit_card: {
          number: `${card}`.replace(/\d{4}(?=.)/g, '$& '),
          name: holder,
          month: Number(exp.slice(0, 2)),
          year: Number(`20${parseInt(exp.slice(3, 5), 10)}`),
          verification_value: cvv
        },
        payment_session_scope: urlForStore(url)
      }
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error creating session [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SESSION;
    }

    const { body } = data;
    if (!body) {
      emitEvent(this.context, [id], {
        message: 'Error creating session [UNKNOWN]'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SESSION;
    }

    const { id: session } = body;

    if (session) {
      this.session = session;
      return States.SUBMIT_PAYMENT;
    }

    emitEvent(this.context, [id], {
      message: 'Error creating session [UNKNOWN]'
    });

    return States.GET_SESSION;
  }

  async submitPayment() {
    const {
      id,
      task: {
        retry,
        mode,
        monitor,
        store: { url }
      },
      shopId
    } = this.context;

    const profile = this.retrieveProfile();
    if (!profile) {
      emitEvent(this.context, [id], {
        message: 'Profile not found'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_PAYMENT;
    }

    const { billing, matches } = profile;

    const { price } = this.product;

    const { nextState, data = {}, redirect } = await submitPayment({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      shopId,
      url,
      follow: false,
      form: submitPaymentForm({
        matches,
        billing,
        authToken: this.authToken,
        protection: this.protection,
        gateway: this.gateway,
        price,
        s: this.session
      })
    });

    // Reset session
    this.session = '';

    if (nextState) {
      emitEvent(this.context, [id], {
        message: `Error submitting order`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SESSION;
    }

    const { statusCode, body } = data;
    if ((statusCode === 429 || statusCode === 430) && body) {
      this.count += 1;

      if (this.count >= 5) {
        emitEvent(this.context, [id], { message: `Checkout expired` });

        this.delayer = waitForDelay(1000, this.aborter.signal);
        await this.delayer;

        return this.restart();
      }
    }

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting order [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      if (mode === Modes.SAFE || mode === Modes.PRELOAD) {
        return States.GET_PAYMENT;
      }

      return States.GET_SESSION;
    }

    if (redirect) {
      if (/processing/i.test(redirect)) {
        return States.GET_ORDER;
      }

      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.GET_SESSION;
        return this.enterQueue(States.SUBMIT_PAYMENT);
      }

      if (/checkpoint/i.test(redirect)) {
        await this.injectRequester({
          type: CAPTCHA_TYPES.RECAPTCHA_V2C,
          redirect
        });

        this.proceedTo = States.SUBMIT_PAYMENT;
        this.checkpointUrl = redirect;
        return States.CAPTCHA;
      }

      if (/stock_problems/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Out of stock'
        });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_SESSION;
      }

      if (/checkoutnow/i.test(redirect)) {
        return this.extractExpressToken(redirect);
      }
    }

    const stepState = this.extractStepToNextStep(States.SUBMIT_PAYMENT, body);

    if (stepState) {
      return stepState;
    }

    emitEvent(this.context, [id], {
      message: 'Error submitting payment [UNKNOWN]'
    });

    return States.GET_SESSION;
  }

  async getOrder() {
    const nextState = await super.getOrder();

    if (nextState === States.GET_HOMEPAGE) {
      await this.restart();

      return nextState;
    }

    return nextState;
  }

  async handleStepLogic(currentState: string) {
    const { id, logger } = this.context;

    if (
      this.anticrack &&
      (currentState === States.SUBMIT_PAYMENT ||
        currentState === States.SUBMIT_REVIEW)
    ) {
      // eslint-disable-next-line no-param-reassign
      currentState = States.NOOP;
    }

    const stepMap = {
      [States.GET_HOMEPAGE]: this.getHomepage,
      [States.GET_CONFIG]: this.getConfig,
      [States.GET_PRODUCT]: this.getProduct,
      [States.PRESUBMIT_CART]: this.presubmitCart,
      [States.WAIT_FOR_CHECKPOINT]: this.waitForCheckpoint,
      [States.SUBMIT_PASSWORD]: this.submitPassword,
      [States.GET_ACCOUNT]: this.getAccount,
      [States.SUBMIT_ACCOUNT]: this.submitAccount,
      [States.GET_CHALLENGE]: this.getChallenge,
      [States.SUBMIT_CHALLENGE]: this.submitChallenge,
      [States.INIT_CHECKOUT]: this.initialize,
      [States.GET_QUEUE]: this.getQueue,
      [States.GET_NEXT_QUEUE]: this.getNextQueue,
      [States.WAIT_FOR_PRODUCT]: this.waitForProduct,
      [States.SUBMIT_CART]: this.submitCart,
      [States.CLEAR_CART]: this.clearCart,
      [States.GET_CART]: this.getCart,
      [States.SUBMIT_CHECKPOINT]: this.submitCheckpoint,
      [States.GET_CUSTOMER]: this.getCustomer,
      [States.CAPTCHA]: this.waitForCaptcha,
      [States.SUBMIT_CUSTOMER]: this.submitCustomer,
      [States.GET_SHIPPING]: this.getShipping,
      [States.SUBMIT_SHIPPING]: this.submitShipping,
      [States.GET_PAYMENT]: this.getPayment,
      [States.GET_PRICE]: this.getTotalPrice,
      [States.SUBMIT_DISCOUNT]: this.submitDiscount,
      [States.GET_SESSION]: this.getSession,
      [States.SUBMIT_PAYMENT]: this.submitPayment,
      [States.CREATE_GUEST]: this.createGuest,
      [States.APPROVE_GUEST]: this.approveGuest,
      [States.GET_CALLBACK]: this.getCallbackUrl,
      [States.GET_ORDER]: this.getOrder,
      [States.NOOP]: this.noop,
      [States.SWAP]: this.swap,
      [States.DONE]: () => States.DONE,
      [States.ERROR]: () => States.DONE,
      [States.ABORT]: () => States.DONE
    };

    // filter out rep states...
    if (
      currentState !== States.CAPTCHA &&
      currentState !== States.WAIT_FOR_PRODUCT
    ) {
      logger.log({
        id,
        level: 'info',
        message: `Handling task state: ${currentState}`
      });
    }

    const defaultHandler = () => {
      const handler: any = stepMap[this.prevState];

      if (!handler) {
        throw new Error('Reached unknown state!');
      }

      return handler.call(this);
    };

    const handler: any = stepMap[currentState] || defaultHandler;
    return handler.call(this);
  }

  abort() {
    const {
      checkpointManager,
      task: {
        store: { url }
      }
    } = this.context;

    if (this.checkpointInterval) {
      clearInterval(this.checkpointInterval);
      this.checkpointInterval = null;
    }

    checkpointManager.stop(url);

    super.abort();
  }
}
