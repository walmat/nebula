import { ShopifyTask } from './base';

import { ShopifyContext } from '../../../common/contexts';
import { Task as TaskConstants } from '../../constants';
import {
  emitEvent,
  waitForDelay,
  isImproperStatusCode
} from '../../../common/utils';
import { initialize, clearCart, getPreloadProduct } from '../functions';
import CAPTCHA_TYPES from '../../../../utils/captchaTypes';

const { States, Modes } = TaskConstants;

export class PreloadTask extends ShopifyTask {
  constructor(context: ShopifyContext) {
    super(context, States.GET_HOMEPAGE);
    this.preloading = true;

    const {
      checkpointManager,
      task: {
        store: { url }
      }
    } = this.context;

    checkpointManager.start(url);

    this.checkpointInterval = setInterval(this.checkForCheckpoint, 500);
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
        type: CAPTCHA_TYPES.RECAPTCHA_V2C,
        redirect: this.checkpointUrl
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
    this.context.task.mode = Modes.PRELOAD;
    this.preloading = true;

    if (!this.checkpointInterval) {
      checkpointManager.start(url);
      this.checkpointInterval = setInterval(this.checkForCheckpoint, 500);
    }

    return States.GET_HOMEPAGE;
  };

  async getConfig() {
    const nextState = await super.getConfig();

    this.context.task.mode = Modes.PRELOAD;
    this.preloading = true;
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

      return States.WAIT_FOR_PRODUCT;
    }

    return nextState;
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

    const { products } = body;
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

    // grab the first product found
    const [product] = products;

    // grab the first variant on that product
    [this.product.variant] = product.variants;
    return States.SUBMIT_CART;
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
    if (isImproperStatusCode(statusCode)) {
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
        monitor,
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
          : States.CLEAR_CART;

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

      if (/stock_problems/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Out of stock'
        });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_CUSTOMER;
      }
    }

    if (this.preloading) {
      return States.CLEAR_CART;
    }

    return States.GET_CUSTOMER;
  }

  async getQueue() {
    const nextState = await super.getQueue();

    if (nextState === States.GET_CUSTOMER && this.preloading) {
      return States.CLEAR_CART;
    }

    return nextState;
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
