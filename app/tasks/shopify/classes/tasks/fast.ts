/* eslint-disable no-restricted-syntax */
import { isEmpty } from 'lodash';
import { load } from 'cheerio';

import { ShopifyContext } from '../../../common/contexts';
import {
  emitEvent,
  waitForDelay,
  isImproperStatusCode,
  insertDecimal,
  ellipsis
} from '../../../common/utils';

import { Task as TaskConstants, gateways } from '../../constants';
import { Forms, urlForStore } from '../../utils';

import {
  getConfig,
  submitPassword,
  getChallenge,
  submitChallenge,
  submitAccount,
  initialize,
  submitCart,
  getSession,
  getPayment,
  getCart,
  getCustomer,
  submitReview,
  submitPayment,
  submitCustomerApi,
  getShippingApi,
  submitShippingApi,
  getOrder
} from '../functions';

import { ShopifyTask } from './base';
import { PatchCartResponse, AddToCartMessage } from '../../types';
import { ShippingRates } from '../../types/rates';
import { GetCartResponse } from '../../types/cart';
import CAPTCHA_TYPES from '../../../../utils/captchaTypes';

const {
  addToCart,
  submitCustomerApiForm,
  submitPaymentFormApi,
  submitReviewForm
} = Forms;

const { States, Modes } = TaskConstants;

export class FastTask extends ShopifyTask {
  count: number;

  proxy: any;

  usePrice: boolean;

  swapped: boolean;

  free: boolean;

  fallback: boolean;

  gateways: {
    [shopId: string]: string;
  };

  checked: boolean;

  created: boolean;

  genTime: number | null;

  constructor(context: ShopifyContext) {
    super(context, States.GET_CONFIG);

    this.count = 0;

    // cache this to return to after session
    this.proxy = this.context.proxy ? { ...this.context.proxy } : null;

    this.swapped = false;
    this.usePrice = true;
    this.free = false;
    this.fallback = false;

    this.gateways = gateways;

    this.checked = false;
    this.created = false;

    this.genTime = null;
  }

  restart = async () => {
    const { taskSession } = this.context;

    this.context.task.mode = Modes.FAST;

    this.count = 0;

    // cache this to return to after session
    this.proxy = this.context.proxy ? { ...this.context.proxy } : null;

    this.swapped = false;
    this.usePrice = true;
    this.free = false;
    this.fallback = false;

    this.gateways = gateways;

    this.checked = false;
    this.created = false;

    this.shippingRate = {
      id: '',
      name: '',
      price: ''
    };

    this.genTime = null;
    this.challenge = false;
    this.question = false;
    this.checkpoint = false;
    this.preloading = false;
    this.reviewing = false;
    this.calculated = false;
    this.merging = false;
    this.resubmitShipping = false;

    this.checkpointUrl = '';

    // internals
    this.form = '';
    this.protection = [];
    this.shippingProtection = [];
    this.session = '';
    this.hash = '';
    this.key = '';
    this.ctd = '';
    this.gateway = '';
    this.authToken = '';
    this.discountAuthToken = '';
    this.appliedDiscount = false;
    this.submittedPassword = false;
    this.formatter = 'en-US';
    this.currency = 'USD';

    this.skipShipping = false;

    this.expressCheckoutToken = '';
    this.paypalReturnUrl = '';
    this.payerId = '';
    this.accessToken = '';

    this.proceedTo = null;
    this.polling = false;

    this.restocking = false;
    this.rewinded = false;

    this.product = {};
    this.injected = {};

    this.useNewQueue = false;
    this.nextQueueToken = '';

    await taskSession.clearStorageData();

    return States.GET_CONFIG;
  };

  extractProductApi(body: PatchCartResponse) {
    const [
      { title: productTitle, variant_title: variantTitle, image_url: image }
    ] = body.checkout.line_items;

    const message: AddToCartMessage = {};

    if (productTitle) {
      this.product.name = productTitle;
      message.productName = productTitle;
    }

    if (variantTitle) {
      this.product.variant.title = variantTitle;
      message.chosenSize = variantTitle;
    }

    if (image) {
      const newImage = `${image}`.startsWith('http') ? image : `https:${image}`;

      this.product.image = newImage;
      message.productImage = newImage;
      message.productImageHi = newImage;
    }

    if (!isEmpty(message)) {
      const { id } = this.context;

      emitEvent(this.context, [id], message);
    }
  }

  async getConfig() {
    const {
      id,
      task: {
        retry,
        password,
        account,
        store: { url }
      }
    } = this.context;

    const { nextState, data = {} } = await getConfig({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer
    });

    if (nextState) {
      if (nextState === States.SWAP) {
        return nextState;
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;
    if (statusCode === 404) {
      emitEvent(this.context, [id], { message: 'Invalid Shopify store' });

      return States.ERROR;
    }

    if (statusCode === 429 || statusCode === 430) {
      return States.SWAP;
    }

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting homepage [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_CONFIG;
    }

    const { paymentInstruments } = data?.body;

    const {
      accessToken,
      checkoutConfig: { shopId }
    } = paymentInstruments;

    if (!accessToken) {
      emitEvent(this.context, [id], { message: 'Invalid Shopify store' });

      return States.ERROR;
    }

    this.context.setShopId(shopId);
    this.context.setAccessToken(accessToken);

    if (password) {
      return States.SUBMIT_PASSWORD;
    }

    if (account) {
      return States.GET_ACCOUNT;
    }

    if (/palaceskateboards/i.test(url)) {
      return States.WAIT_FOR_PRODUCT;
    }

    return States.INIT_CHECKOUT;
  }

  async submitPassword() {
    const {
      id,
      task: { retry, password }
    } = this.context;

    const { nextState, data } = await submitPassword({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      form: `form_type=storefront_password&utf8=%E2%9C%93&password=${password}`
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;

    // if we get redirected, password was successful
    if (statusCode === 302) {
      this.context.monitorSession = this.context.taskSession;
      this.submittedPassword = true;

      if (this.proceedTo) {
        const next = this.proceedTo;
        this.proceedTo = null;
        return next;
      }

      if (this.context.task.account) {
        return States.GET_ACCOUNT;
      }

      if (/eflash-us|palaceskateboards/i.test(this.context.task.store.url)) {
        return States.WAIT_FOR_PRODUCT;
      }

      return States.INIT_CHECKOUT;
    }

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting password [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_PASSWORD;
    }

    emitEvent(this.context, [id], { message: 'Invalid password' });

    this.delayer = waitForDelay(retry, this.aborter.signal);
    await this.delayer;

    return States.SUBMIT_PASSWORD;
  }

  async submitAccount() {
    const {
      id,
      task: {
        retry,
        password,
        store: { url }
      }
    } = this.context;

    const { nextState, data, redirect } = await submitAccount({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      storeUrl: url
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error logging in [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_ACCOUNT;
    }

    if (redirect) {
      if (/challenge/i.test(redirect)) {
        this.challenge = true;
        return States.GET_CHALLENGE;
      }

      if (/password/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Password page'
        });

        if (password) {
          this.proceedTo = States.GET_ACCOUNT;
          return States.SUBMIT_PASSWORD;
        }

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_ACCOUNT;
      }

      if (/login/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Invalid credentials'
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_ACCOUNT;
      }

      if (/account/i.test(redirect)) {
        this.context.setCaptchaToken('');

        if (!this.hash) {
          return States.INIT_CHECKOUT;
        }

        return States.WAIT_FOR_PRODUCT;
      }
    }

    return States.SUBMIT_ACCOUNT;
  }

  async getChallenge() {
    const {
      id,
      task: {
        retry,
        store: { url }
      }
    } = this.context;

    const { nextState, data } = await getChallenge({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      url
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting challenge [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_CHALLENGE;
    }

    const { body } = data;

    await Promise.allSettled([
      this.extractAuthToken(
        'form input[name=authenticity_token]',
        load(body, { xmlMode: false, normalizeWhitespace: true })
      ),
      this.extractRecaptcha(body),
      this.injectRequester({})
    ]);

    return States.CAPTCHA;
  }

  async submitChallenge() {
    const {
      id,
      task: {
        retry,
        password,
        store: { url }
      },
      captchaToken
    } = this.context;

    const { nextState, data, redirect } = await submitChallenge({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      authToken: this.authToken,
      captchaToken,
      url
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting challenge [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_CHALLENGE;
    }

    if (redirect) {
      if (/challenge/i.test(redirect)) {
        this.challenge = true;
        return States.GET_CHALLENGE;
      }

      if (/password/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Password page'
        });

        if (password) {
          this.proceedTo = States.SUBMIT_CHALLENGE;
          return States.SUBMIT_PASSWORD;
        }

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.SUBMIT_CHALLENGE;
      }

      if (/login/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Invalid credentials'
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_ACCOUNT;
      }

      if (/account/i.test(redirect)) {
        this.context.setCaptchaToken('');

        if (this.proceedTo) {
          const { proceedTo } = this;
          this.proceedTo = null;
          return proceedTo;
        }

        return States.INIT_CHECKOUT;
      }
    }

    emitEvent(this.context, [id], {
      message: 'Error submitting challenge [UNKNOWN]'
    });

    return States.GET_CHALLENGE;
  }

  async initialize() {
    const {
      id,
      task: {
        retry,
        password,
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
        emitEvent(this.context, [id], {
          message: 'Checkpoint up, retrying...'
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.INIT_CHECKOUT;
      }

      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.SUBMIT_CUSTOMER;
        return this.enterQueue(States.INIT_CHECKOUT);
      }

      if (/password/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Password page'
        });

        if (password) {
          this.proceedTo = States.INIT_CHECKOUT;
          return States.SUBMIT_PASSWORD;
        }

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.INIT_CHECKOUT;
      }

      if (this.hash) {
        this.form = '';
        return States.WAIT_FOR_PRODUCT;
      }
    }

    emitEvent(this.context, [id], {
      message: 'Error initializing checkout [UNKNOWN]'
    });

    return States.INIT_CHECKOUT;
  }

  // NOTE: Out of event loop
  async retrieveCartInfo() {
    const {
      task: {
        store: { url: storeUrl }
      }
    } = this.context;

    const { data = {} } = await getCart({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      endpoint: '/cart.js',
      message: '',
      options: {
        json: true
      }
    });

    try {
      const { body } = data;
      const { items } = body as GetCartResponse;

      if (!items?.length) {
        return;
      }

      const [{ url, handle, title }] = items;

      if (url) {
        this.product.url = url.startsWith('http') ? url : `${storeUrl}${url}`;
      } else if (handle) {
        this.product.url = `${storeUrl}/products/${handle}`;
      } else {
        this.product.url = storeUrl;
      }

      if (title) {
        this.product.name = title;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async patchCheckout() {
    const {
      id,
      accessToken,
      task: {
        retry,
        discount,
        store: { url }
      }
    } = this.context;

    if (this.rewinded) {
      return super.submitCustomer();
    }

    if (!this.hash) {
      this.proceedTo = States.PATCH_CHECKOUT;
      return States.INIT_CHECKOUT;
    }

    const profile = this.retrieveProfile();
    if (!profile) {
      emitEvent(this.context, [id], {
        message: 'Profile not found'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.PATCH_CHECKOUT;
    }

    const {
      properties,
      variant: { id: variant }
    } = this.product;

    const { shipping, billing } = profile;

    const extraProperties = /kawsone/i.test(url)
      ? {
          _hkey: '789gfd78934hfk74jml849320'
        }
      : {};

    const { nextState, data } = await submitCustomerApi({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      accessToken,
      json: submitCustomerApiForm({
        shipping,
        billing,
        discount,
        lineItems:
          !this.restocking && !this.fallback
            ? [
                {
                  variant_id: variant,
                  quantity: 1,
                  properties: {
                    ...(properties || []).reduce(
                      (a: any, { name, value }: any) => {
                        const key = name
                          .replace('properties', '')
                          .replace('[', '')
                          .replace(']', '');

                        return {
                          ...a,
                          [key]: value
                        };
                      },
                      {}
                    ),
                    ...extraProperties
                  }
                }
              ]
            : []
      })
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;
    if (statusCode === 422) {
      const bodyString = JSON.stringify(body);

      if (/line_items/i.test(bodyString) && /invalid/i.test(bodyString)) {
        this.fallback = true;
        return States.PATCH_CHECKOUT;
      }

      if (/domain/i.test(bodyString)) {
        emitEvent(this.context, [id], {
          message: 'Invalid email domain'
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.PATCH_CHECKOUT;
      }

      if (/not_enough_in_stock/i.test(bodyString)) {
        this.restocking = true;

        if (/eflash-us/i.test(url)) {
          return States.SUBMIT_CART;
        }

        return States.PATCH_CHECKOUT;
      }

      if (/zip/i.test(bodyString)) {
        emitEvent(this.context, [id], {
          message: 'Invalid profile zipcode'
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.PATCH_CHECKOUT;
      }

      emitEvent(this.context, [id], {
        message: 'Error preloading checkout [422]'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.PATCH_CHECKOUT;
    }

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error preloading checkout [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.PATCH_CHECKOUT;
    }

    if (!body || !body?.checkout) {
      emitEvent(this.context, [id], {
        message: 'Error preloading checkout [UNKNOWN]'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.PATCH_CHECKOUT;
    }

    const {
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      line_items: lineItems
    } = body.checkout;

    if (!shippingAddress || !billingAddress) {
      emitEvent(this.context, [id], {
        message: 'Error preloading checkout [UNKNOWN]'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.PATCH_CHECKOUT;
    }

    if (!lineItems?.length) {
      return States.SUBMIT_CART;
    }

    this.retrieveCartInfo();

    try {
      this.extractProductApi(body);
    } catch (e) {
      // noop.
    }

    if (/eflash-us|palaceskateboards/i.test(url)) {
      if (this.shippingRate.id) {
        return States.SUBMIT_SHIPPING;
      }

      return States.GET_SHIPPING;
    }

    if (this.restocking || this.fallback) {
      return States.SUBMIT_CART;
    }

    return States.GET_CUSTOMER;
  }

  async submitCart() {
    const {
      id,
      task: {
        retry,
        monitor,
        quantity,
        store: { url }
      }
    } = this.context;

    const {
      properties,
      variant: { id: variant }
    } = this.product;

    if (!this.injected[url]) {
      this.injected[url] = {};
    }

    const injected = this.injected[url] || {};

    let form = addToCart({
      variant,
      quantity: quantity > 0 ? quantity : 1,
      properties,
      injected
    });
    if (/mattel/i.test(url)) {
      form = `items%5B0%5D%5Bquantity%5D=${
        quantity > 0 ? quantity : 1
      }&items%5B0%5D%5Bid%5D=${variant}&items%5B0%5D%5Bproperties%5D%5Bvariant_inventorystatus%5D=Available`;
    }

    const { nextState, data } = await submitCart({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      productUrl: `${url}/`,
      storeUrl: url,
      form
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

      return States.SUBMIT_CART;
    }

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error adding to cart [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_CART;
    }

    const { body } = data;
    if (!this.preloading) {
      await this.extractProduct(body);
    }

    if (/palaceskateboards/i.test(url)) {
      return States.GET_CART;
    }

    return States.GET_CUSTOMER;
  }

  async getCustomer() {
    const {
      id,
      task: {
        password,
        retry,
        paypal,
        store: { url }
      },
      shopId
    } = this.context;

    const { nextState, data = {}, redirect } = await getCustomer({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      shopId,
      url
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 404) {
        return States.INIT_CHECKOUT;
      }

      emitEvent(this.context, [id], {
        message: `Error visiting customer [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_CUSTOMER;
    }

    if (redirect) {
      if (/checkpoint/i.test(redirect)) {
        await this.injectRequester({
          type: CAPTCHA_TYPES.RECAPTCHA_V2C,
          redirect
        });

        this.checkpointUrl = redirect;
        return States.CAPTCHA;
      }

      if (/cart/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Cart empty, retrying...'
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.SUBMIT_CART;
      }

      if (/password/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Password page'
        });

        if (password) {
          this.proceedTo = States.GET_CUSTOMER;
          return States.SUBMIT_PASSWORD;
        }

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_CUSTOMER;
      }

      if (/account\/login/i.test(redirect)) {
        this.proceedTo = States.GET_CUSTOMER;

        if (this.context.task.account) {
          return States.GET_ACCOUNT;
        }

        emitEvent(this.context, [id], {
          message: 'Account needed'
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_CUSTOMER;
      }

      if (/stock_problems/i.test(redirect)) {
        this.restocking = true;

        this.context.task.mode = Modes.RESTOCK;
        emitEvent(this.context, [id], {
          mode: Modes.RESTOCK,
          backupMode: Modes.FAST
        });
      }
    }

    const $ = load(body, { xmlMode: false, normalizeWhitespace: true });
    this.extractAuthToken('form input[name=authenticity_token]', $);

    if (/eflash-us/i.test(url) && this.restocking) {
      return super.submitCustomer();
    }

    if (this.shippingRate.id) {
      if (this.restocking) {
        return States.SUBMIT_SHIPPING;
      }

      if (paypal) {
        return States.GET_PAYMENT;
      }

      return States.GET_SESSION;
    }

    return States.GET_SHIPPING;
  }

  async getShipping() {
    const {
      id,
      accessToken,
      task: { retry, paypal, maxPrice }
    } = this.context;

    const { nextState, data } = await getShippingApi({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      accessToken,
      polling: this.polling
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    // reset polling flag no matter what
    this.polling = false;

    const { statusCode } = data;

    // NOTE: Possibly a free order, let's proceed to payment session
    if (statusCode === 412) {
      return States.GET_SESSION;
    }

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting shipping [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SHIPPING;
    }

    const { body } = data;
    if (!body) {
      this.polling = true;
      emitEvent(this.context, [id], { message: 'Polling rates' });

      this.delayer = waitForDelay(1000, this.aborter.signal);
      await this.delayer;

      return States.GET_SHIPPING;
    }

    const { shipping_rates: shippingRates } = body as ShippingRates;
    if (!shippingRates || !shippingRates?.length) {
      if (statusCode === 200 && !this.shippingRate.id) {
        emitEvent(this.context, [id], { message: 'No rates available' });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_SHIPPING;
      }

      if (this.shippingRate.id) {
        if (this.restocking) {
          return States.SUBMIT_SHIPPING;
        }

        if (paypal) {
          return States.GET_PAYMENT;
        }

        return States.GET_SESSION;
      }

      this.polling = true;
      emitEvent(this.context, [id], { message: 'Polling rates' });

      this.delayer = waitForDelay(500, this.aborter.signal);
      await this.delayer;

      return States.GET_SHIPPING;
    }

    for (const { id, price, title: name, checkout } of shippingRates) {
      const newRate = {
        name,
        price,
        id
      };

      if (
        !this.shippingRate.price ||
        parseFloat(price) < parseFloat(this.shippingRate.price)
      ) {
        this.shippingRate = newRate;
        this.product.price = checkout.total_price.replace(/\./g, '');
      }
    }

    // double check maxPrice here now that we have shipping rates...
    if (maxPrice && this.product.price) {
      const total =
        Number(this.shippingRate.price) +
        insertDecimal(`${this.product.price}`);

      if (total > Number(maxPrice)) {
        emitEvent(this.context, [id], {
          message: 'Exceeded max price'
        });

        return States.ERROR;
      }
    }

    if (this.restocking) {
      return States.SUBMIT_SHIPPING;
    }

    if (paypal) {
      return States.GET_PAYMENT;
    }

    return States.GET_SESSION;
  }

  async submitShipping() {
    const {
      id,
      accessToken,
      task: { retry, paypal }
    } = this.context;

    const { nextState, data } = await submitShippingApi({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      accessToken,
      json: {
        checkout: {
          shipping_line: {
            handle: this.shippingRate.id
          }
        }
      }
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting shipping [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_SHIPPING;
    }

    if (body?.checkout) {
      // eslint-disable-next-line camelcase
      this.product.price = `${body?.checkout?.payment_due.replace('.', '')}`;
    }

    if (paypal) {
      return States.GET_PAYMENT;
    }

    return States.GET_SESSION;
  }

  async getSession() {
    const {
      id,
      logger,
      taskSession,
      task: {
        mode,
        retry,
        restockMode,
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

    const { nextState, error, data } = await getSession({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      message: this.created ? '' : 'Creating session',
      timeout: 7500,
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
      if (error) {
        emitEvent(this.context, [id], {
          message: `Error creating session [TIMEOUT]`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        this.swapped = true;

        return States.SWAP;
      }

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
      this.genTime = Date.now();

      // reset gen time after 10 minutes
      setTimeout(() => {
        this.genTime = null;
      }, 10000 * 1000);

      logger.log({
        id,
        level: 'silly',
        message: `Swapped to create session: ${this.swapped}`
      });

      if (this.swapped) {
        logger.log({
          id,
          level: 'silly',
          message: `Reverting back to previous proxy: ${
            this.proxy?.ip || 'null'
          }`
        });

        if (this.proxy) {
          const [ip, port] = this.proxy.ip.split(':');

          await taskSession.setProxy({
            proxyRules: `${ip}:${port}`,
            proxyBypassRules: ''
          });
        } else {
          await taskSession.setProxy({ proxyRules: '', proxyBypassRules: '' });
        }
      }

      if (this.rewinded && this.context.captchaToken) {
        return States.SUBMIT_REVIEW;
      }

      if (this.checked && mode === Modes.RESTOCK && restockMode) {
        return States.GET_PAYMENT;
      }

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
        monitor,
        store: { url }
      },
      captchaToken,
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

    const { nextState, data, redirect } = await submitPayment({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      follow: true,
      shopId,
      url,
      form: submitPaymentFormApi({
        matches,
        billing,
        rate: !this.restocking ? this.shippingRate.id : '',
        authToken: this.authToken || 'null',
        gateway: this.gateway || this.gateways[shopId] || '',
        price: this.product.price,
        s: this.session
      })
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;
    if (
      (statusCode === 429 || statusCode === 430) &&
      body &&
      !/too many requests/i.test(body)
    ) {
      this.count += 1;

      if (this.count >= 5) {
        emitEvent(this.context, [id], { message: `Checkout expired` });

        this.delayer = waitForDelay(1000, this.aborter.signal);
        await this.delayer;

        return this.restart();
      }
    }

    this.count = 0;

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting order [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SESSION;
    }

    const $ = load(body, { xmlMode: false, normalizeWhitespace: true });
    this.extractPrice($);
    this.extractAuthToken('form input[name=authenticity_token]', $);

    if (redirect) {
      if (/checkpoint/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Checkpoint up, retrying...'
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.SUBMIT_PAYMENT;
      }

      if (/stock_problems/i.test(redirect)) {
        this.created = true;

        if (!this.checked) {
          this.checked = true;
          return States.SUBMIT_PAYMENT;
        }

        emitEvent(this.context, [id], { message: 'Out of stock' });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_SESSION;
      }

      if (/account\/login/i.test(redirect)) {
        this.proceedTo = States.SUBMIT_PAYMENT;

        if (this.context.task.account) {
          return States.GET_ACCOUNT;
        }

        emitEvent(this.context, [id], {
          message: 'Account needed'
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.SUBMIT_PAYMENT;
      }

      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.GET_SESSION;
        return this.enterQueue(States.SUBMIT_PAYMENT);
      }

      if (/previous_step=payment_method/i.test(redirect)) {
        this.created = true;

        if (!this.checked) {
          this.checked = true;
          return States.SUBMIT_PAYMENT;
        }

        emitEvent(this.context, [id], { message: 'Out of stock' });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_SESSION;
      }

      if (/checkoutnow/i.test(redirect)) {
        return this.extractExpressToken(redirect);
      }

      if (/processing/i.test(redirect)) {
        return States.GET_ORDER;
      }
    }

    if (/Calculating taxes/i.test(body)) {
      emitEvent(this.context, [id], { message: 'Calculating taxes' });

      this.polling = true;
      return States.GET_REVIEW;
    }

    if (/No payment is required/i.test(body)) {
      this.free = true;
      return States.SUBMIT_REVIEW;
    }

    if (body?.includes('class="g-recaptcha"') && !captchaToken) {
      this.extractRecaptcha(body);
      this.extractAuthToken('form input[name=authenticity_token]', $);

      this.rewinded = true;
      this.proceedTo = !this.restocking
        ? States.GET_SESSION
        : States.SUBMIT_CUSTOMER;

      await this.injectRequester({});

      return States.CAPTCHA;
    }

    if (this.checked) {
      return States.GET_SESSION;
    }

    const stepState = this.extractStepToNextStep(States.SUBMIT_PAYMENT, body);

    if (stepState) {
      return stepState;
    }

    emitEvent(this.context, [id], {
      message: 'Error submitting order [UNKNOWN]'
    });

    return States.GET_SESSION;
  }

  async getPayment() {
    const {
      id,
      shopId,
      task: {
        retry,
        monitor,
        paypal,
        store: { url }
      }
    } = this.context;

    if (!this.genTime && !paypal) {
      return States.GET_SESSION;
    }

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

    if (redirect) {
      if (/checkpoint/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Checkpoint up, retrying...'
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_PAYMENT;
      }

      if (/stock_problems/i.test(redirect)) {
        emitEvent(this.context, [id], { message: 'Out of stock' });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_PAYMENT;
      }

      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.GET_PAYMENT;
        return this.enterQueue(States.GET_PAYMENT);
      }
    }

    const { body } = data;

    if (/Calculating taxes/i.test(body)) {
      this.polling = true;
      return States.GET_PAYMENT;
    }

    const $ = load(body, { xmlMode: false, normalizeWhitespace: true });
    await Promise.allSettled([
      this.extractProtection($),
      this.extractAuthToken(
        'form.edit_checkout input[name=authenticity_token]',
        $
      ),
      this.extractGateway($),
      this.extractPrice($)
    ]);

    return States.SUBMIT_PAYMENT;
  }

  async submitReview() {
    const {
      id,
      captchaToken,
      shopId,
      task: { monitor, retry }
    } = this.context;

    const { nextState, data, redirect } = await submitReview({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      shopId,
      form: submitReviewForm({
        captchaToken,
        free: this.free,
        price: this.product.price ? this.product.price : '',
        authToken: this.authToken || 'null'
      })
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    // reset taxes flag no matter what
    this.polling = false;

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
        message: `Error completing order [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_REVIEW;
    }

    this.count = 0;
    this.context.setCaptchaToken('');

    if (redirect) {
      if (/stock_problems/i.test(redirect)) {
        emitEvent(this.context, [id], { message: 'Out of stock' });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.SUBMIT_REVIEW;
      }

      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.SUBMIT_REVIEW;
        return this.enterQueue(States.SUBMIT_REVIEW);
      }

      if (/processing/i.test(redirect)) {
        return States.GET_ORDER;
      }
    }

    if (/Calculating taxes/i.test(body)) {
      emitEvent(this.context, [id], { message: 'Calculating taxes' });

      this.polling = true;
      return States.SUBMIT_REVIEW;
    }

    if (body.includes('class="g-recaptcha"') && !captchaToken) {
      this.extractRecaptcha(body);

      this.rewinded = true;
      this.proceedTo = !this.restocking
        ? States.SUBMIT_REVIEW
        : States.SUBMIT_CUSTOMER;

      await this.injectRequester({});

      return States.CAPTCHA;
    }

    const stepState = this.extractStepToNextStep(States.SUBMIT_REVIEW, body);

    if (stepState) {
      return stepState;
    }

    emitEvent(this.context, [id], {
      message: 'Error completing order [UNKNOWN]'
    });

    return States.SUBMIT_REVIEW;
  }

  async getOrder() {
    const {
      id,
      task: {
        mode,
        retry,
        store: { url }
      },
      shopId,
      restartManager,
      checkpointManager
    } = this.context;

    const message = `Checking order${ellipsis[this.tries]}`;

    this.tries += 1;
    if (this.tries > 2) {
      this.tries = 0;
    }

    const { nextState, data = {}, redirect } = await getOrder({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      shopId,
      url,
      polling: this.polling,
      message
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    // reset polling status
    this.polling = false;

    const { statusCode, body } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error checking order [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_ORDER;
    }

    if (/out of stock/i.test(body)) {
      this.sendWebhook(body, false);

      const shouldRestart = restartManager.restart();
      if (!shouldRestart) {
        checkpointManager.stop(url);

        return States.DONE;
      }

      if (mode === Modes.FAST || mode === Modes.RESTOCK) {
        return States.GET_CONFIG;
      }

      return States.GET_HOMEPAGE;
    }

    if (redirect) {
      if (/validate=true|checkoutnow/i.test(redirect)) {
        this.sendWebhook(body, false);

        const shouldRestart = restartManager.restart();
        if (!shouldRestart) {
          checkpointManager.stop(url);

          return States.DONE;
        }

        await this.restart();

        return States.GET_CONFIG;
      }

      if (/thank_you/i.test(redirect)) {
        this.sendWebhook(body, true);

        checkpointManager.stop(url);

        return States.DONE;
      }
    }

    this.polling = true;

    this.delayer = waitForDelay(1000, this.aborter.signal);
    await this.delayer;

    return States.GET_ORDER;
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
      [States.SUBMIT_PASSWORD]: this.submitPassword,
      [States.GET_ACCOUNT]: this.getAccount,
      [States.SUBMIT_ACCOUNT]: this.submitAccount,
      [States.GET_CHALLENGE]: this.getChallenge,
      [States.SUBMIT_CHALLENGE]: this.submitChallenge,
      [States.INIT_CHECKOUT]: this.initialize,
      [States.GET_QUEUE]: this.getQueue,
      [States.GET_NEXT_QUEUE]: this.getNextQueue,
      [States.WAIT_FOR_PRODUCT]: this.waitForProduct,
      [States.PATCH_CHECKOUT]: this.patchCheckout,
      [States.SUBMIT_CART]: this.submitCart,
      [States.GET_CART]: this.getCart,
      [States.SUBMIT_CHECKPOINT]: this.submitCheckpoint,
      [States.GET_CUSTOMER]: this.getCustomer,
      [States.CAPTCHA]: this.waitForCaptcha,
      [States.SUBMIT_CUSTOMER]: this.submitCustomer,
      [States.GET_SHIPPING]: this.getShipping,
      [States.SUBMIT_SHIPPING]: this.submitShipping,
      [States.GET_PAYMENT]: this.getPayment,
      [States.GET_SESSION]: this.getSession,
      [States.SUBMIT_PAYMENT]: this.submitPayment,
      [States.CREATE_GUEST]: this.createGuest,
      [States.APPROVE_GUEST]: this.approveGuest,
      [States.GET_CALLBACK]: this.getCallbackUrl,
      [States.GET_REVIEW]: this.getReview,
      [States.SUBMIT_REVIEW]: this.submitReview,
      [States.GET_ORDER]: this.getOrder,
      [States.NOOP]: this.noop,
      [States.SWAP]: this.swap,
      [States.DONE]: () => States.DONE,
      [States.ERROR]: () => States.DONE,
      [States.ABORT]: () => States.DONE
    };

    // filter out rep states...
    if (
      this.state !== States.CAPTCHA &&
      this.state !== States.WAIT_FOR_PRODUCT
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
}
