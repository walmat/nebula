/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
/* eslint-disable no-restricted-syntax */
import { load } from 'cheerio';
import { isEmpty } from 'lodash';
import { Cookie } from 'electron';

import { Bases } from '../../../common';
import { Platforms, SiteKeyForPlatform } from '../../../common/constants';
import {
  waitForDelay,
  emitEvent,
  insertDecimal,
  request,
  isImproperStatusCode,
  isTimeout,
  isNetworkError,
  toTitleCase,
  ellipsis
} from '../../../common/utils';

import { Task as TaskConstants } from '../../constants';
import {
  Forms,
  getHeaders,
  pickVariant,
  parseProtection,
  urlForStore
} from '../../utils';
import {
  getHomepage,
  getConfig,
  submitPassword,
  submitCart,
  getCart,
  getAccount,
  submitAccount,
  getChallenge,
  submitChallenge,
  submitCheckpoint,
  enterQueue,
  waitInNextQueue,
  waitInQueue,
  passedQueue,
  getCustomer,
  submitCustomer,
  getShipping,
  submitShipping,
  getPayment,
  getTotalPrice,
  submitDiscount,
  getSession,
  submitPayment,
  createGuest,
  approveGuest,
  getCallbackUrl,
  getOrder,
  getReview
} from '../functions';

import { ShopifyContext } from '../../../common/contexts';
import { AddToCartResponse, AddToCartMessage } from '../../types';
import { Property } from '../../utils/forms';
import CAPTCHA_TYPES from '../../../../utils/captchaTypes';

const {
  addToCart,
  submitCustomerForm,
  submitShippingForm,
  submitDiscountForm,
  submitPaymentForm,
  onboardGuest
} = Forms;

const { BaseTask } = Bases;
const { States, Modes } = TaskConstants;

type ShippingRate = {
  id: string;
  name: string;
  price: string;
};

type CookieObject = {
  name: string;
  value: string;
};

type Injected = {
  [url: string]: {
    [variant: string]: Property[];
  };
};

export class ShopifyTask extends BaseTask {
  context: ShopifyContext;

  shippingRate: ShippingRate;

  checkpointInterval: any;

  loginCaptcha: boolean;

  challenge: boolean;

  checkpoint: boolean;

  question: boolean;

  preloading: boolean;

  reviewing: boolean;

  proceedTo: string | null;

  form: string;

  protection: any;

  resubmitShipping: boolean;

  shippingProtection: any;

  session: string;

  hash: string;

  key: string;

  ctd: string;

  gateway: string;

  authToken: string;

  calculated: boolean;

  merging: boolean;

  preload: any;

  useCompany: boolean;

  useTerms: boolean;

  useRemember: boolean;

  discountAuthToken: string;

  appliedDiscount: boolean;

  submittedPassword: boolean;

  count: number;

  formatter: string;

  currency: string;

  polling: boolean;

  product: any; // TODO: Define this model

  injected: Injected;

  checkpointUrl: string;

  skipShipping: boolean;

  solvedCheckpoint: boolean;

  expressCheckoutToken: string;

  paypalReturnUrl: string;

  payerId: string;

  useNewQueue: boolean;

  queueEta: string;

  queueAvailability: string;

  nextQueueToken: string;

  accessToken: string;

  restocking: boolean;

  rewinded: boolean;

  constructor(
    context: ShopifyContext,
    initState: string,
    platform = Platforms.Shopify
  ) {
    super(context, initState, platform);

    this.context = context;

    this.shippingRate = {
      id: '',
      name: '',
      price: ''
    };

    const { rate } = this.context.task;
    if (rate?.id) {
      this.shippingRate = rate;
    }

    // checkout specific globals
    this.challenge = false;
    this.loginCaptcha = false;
    this.question = false;
    this.checkpoint = false;
    this.preloading = false;
    this.reviewing = false;
    this.calculated = false;
    this.merging = false;
    this.count = 0;
    this.solvedCheckpoint = false;
    this.resubmitShipping = false;

    this.checkpointUrl = '';
    this.checkpointInterval = null;

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

    this.useCompany = false;
    this.useTerms = false;
    this.useRemember = false;
    this.useNewQueue = false;
    this.queueEta = '';
    this.queueAvailability = '';
    this.nextQueueToken = '';
  }

  async restart() {
    const { taskSession } = this.context;

    this.shippingRate = {
      id: '',
      name: '',
      price: ''
    };

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

    return States.GET_HOMEPAGE;
  }

  inject = async (data: any) => {
    if (!isEmpty(data)) {
      Object.entries(data).map(([key, value]: [string, any]) => {
        if (key !== '_id') {
          (this as any)[key] = value;
        }

        if (key === 'properties') {
          const {
            task: {
              store: { url }
            }
          } = this.context;

          if (!this.injected[url]) {
            this.injected[url] = {};
          }

          if (value[url]) {
            this.injected[url] = value[url];
          }
        }

        return null;
      });
    }
  };

  harvest = async ({
    token,
    form,
    body,
    cookies
  }: {
    token?: string;
    form?: any;
    body?: string;
    cookies?: Cookie[];
  }) => {
    const {
      taskSession,
      task: {
        store: { url }
      }
    } = this.context;

    if (cookies?.length) {
      taskSession
        .clearStorageData({})
        .then(async () => {
          try {
            for (const cookie of cookies) {
              try {
                // eslint-disable-next-line no-await-in-loop
                await taskSession.cookies.set({
                  url,
                  ...cookie
                });
              } catch (e) {
                console.error(
                  '[TASK]: Failed to set cookie: ',
                  cookie.name,
                  cookie.value
                );
                // noop..
              }
            }
          } catch (e) {
            console.error('[TASK]: Failed to set cookies: ', e);
          }
        })
        .catch(async () => {
          try {
            for (const cookie of cookies) {
              try {
                // eslint-disable-next-line no-await-in-loop
                await taskSession.cookies.set({
                  url,
                  ...cookie
                });
              } catch (e) {
                console.error(
                  '[TASK]: Failed to set cookie: ',
                  cookie.name,
                  cookie.value
                );
                // noop..
              }
            }
          } catch (e) {
            console.error('[TASK]: Failed to set cookies: ', e);
          }
        })
        .finally(() => {
          if (form) {
            this.captchaFinished = true;
            this.form = form;
          }

          if (body) {
            this.extractAuthToken(
              'form input[name=authenticity_token]',
              load(body, { xmlMode: false, normalizeWhitespace: true })
            );
          }
        });
    }

    this.context.captchaToken = token as string;
  };

  async stuffSession() {
    const {
      taskSession,
      task: {
        mode,
        store: { url }
      }
    } = this.context;

    if (/kith/i.test(url)) {
      taskSession.cookies.set({
        url,
        name: 'KL_FORMS_MODAL',
        value: `{%22disabledForms%22:{%22KyEV5m%22:{%22lastCloseTime%22:${Math.floor(
          Date.now() / 1000
        )}%2C%22successActionTypes%22:[]}}%2C%22viewedForms%22:{%22KyEV5m%22:1428897}}`
      });
    }

    if (mode === Modes.FAST || mode === Modes.RESTOCK) {
      return;
    }

    const profile = this.retrieveProfile();
    if (!profile) {
      return;
    }

    const { label } = profile.shipping.country;

    const toInject: CookieObject[] = [];
    const cookies = await taskSession.cookies.get({});

    try {
      const y = cookies.find((cookie: Cookie) => cookie.name === '_shopify_y');
      if (y) {
        const { value } = y;
        toInject.push({ name: '_y', value });
      }
    } catch (e) {
      // fail silently...
    }

    try {
      const s = cookies.find((cookie: Cookie) => cookie.name === '_shopify_s');
      if (s) {
        const { value } = s;
        toInject.push({ name: '_s', value });
      }
    } catch (e) {
      // fail silently...
    }

    toInject.push(
      {
        name: '_shopify_fs',
        value: `${encodeURIComponent(new Date(Date.now() - 15000).toJSON())}`
      },
      { name: 'sig-shopify', value: 'true' },
      { name: 'shopify_pay_redirect', value: 'pending' },
      { name: 'hide_shopify_pay_for_checkout', value: `${this.hash}` },
      { name: '_landing_page', value: '/' },
      { name: 'acceptedCookies', value: 'yes' },
      { name: 'tracked_start_checkout', value: `${this.hash}` },
      { name: '_shopify_sa_p', value: '' },
      { name: '_shopify_country', value: `${label}` },
      { name: '_orig_referrer', value: `${encodeURIComponent(url)}` },
      {
        name: '_shopify_sa_t',
        value: `${encodeURIComponent(new Date(Date.now() - 15000).toJSON())}`
      }
    );

    return Promise.allSettled(
      toInject.map(({ name, value }: { name: string; value: string }) =>
        taskSession.cookies.set({ url, name, value })
      )
    );
  }

  async injectRequester({
    redirect = 'https://checkout.shopify.com',
    type = CAPTCHA_TYPES.RECAPTCHA_V2
  }) {
    const {
      id,
      captchaManager,
      task: {
        mode,
        store: { url, sitekey, sParam }
      },
      proxy,
      taskSession
    } = this.context;

    this.context.setCaptchaToken('');

    const cookies = await taskSession.cookies.get({ url });

    captchaManager.insert({
      id,
      type,
      sharing: type === CAPTCHA_TYPES.RECAPTCHA_V3,
      sitekey: sitekey || SiteKeyForPlatform[Platforms.Shopify],
      platform: Platforms.Shopify,
      harvest: this.harvest,
      host: redirect,
      proxy:
        mode !== Modes.FAST && mode !== Modes.RESTOCK && proxy
          ? proxy.ip
          : undefined,
      cookies,
      s: sParam
    });
  }

  async sendWebhook(body: string, success: boolean) {
    const {
      id,
      proxy,
      task: {
        oneCheckout,
        store: { url, name },
        monitor,
        retry,
        mode,
        quantity
      },
      shopId,
      webhookManager,
      checkoutManager,
      notificationManager
    } = this.context;

    await this.extractAllData(body);

    let profileName;
    let cardType;
    const profile = this.retrieveProfile();
    if (!profile) {
      profileName = 'Unknown';
      cardType = 'Unknown';
    } else {
      profileName = profile.name;
      cardType = profile.payment.type;
    }

    const { image, price, url: productUrl, name: productName } = this.product;

    let size = 'N/A';
    if (this.product.variant?.title) {
      size = this.product.variant.title;
    }

    const finalPrice =
      `${price}`.indexOf('.') > -1 ? price : insertDecimal(`${price}`);

    if (!success) {
      let message = 'Checkout failed';
      if (/Card was decline/i.test(body)) {
        message = 'Card declined';
      }

      emitEvent(this.context, [id], { message });

      if (!this.webhookSent) {
        this.webhookSent = true;

        webhookManager.log({
          url: `${url}/${shopId}/checkouts/${this.hash}?key=${this.key}`,
          mode: mode || Modes.SAFE,
          proxy: proxy ? proxy.proxy : undefined,
          product: {
            name: productName ? toTitleCase(productName) : 'Unknown',
            price: Intl.NumberFormat(this.formatter, {
              style: 'currency',
              currency: this.currency
            }).format(Number(finalPrice)),
            image: `${image}`.startsWith('http') ? image : `https:${image}`,
            size: size || 'N/A',
            url: productUrl || url
          },
          store: {
            name,
            url
          },
          delays: {
            monitor,
            retry
          },
          profile: {
            name: profileName,
            type: cardType
          },
          quantity
        });
      }

      return;
    }

    emitEvent(this.context, [id], { message: 'Check email!' });

    notificationManager.insert({
      id,
      message: `Task ${id}: Check email!`,
      variant: 'success',
      type: 'DONE'
    });

    if (oneCheckout) {
      checkoutManager.check({ context: this.context });
    }

    webhookManager.log({
      success: true,
      url: `${url}/${shopId}/checkouts/${this.hash}?key=${this.key}`,
      mode: mode || Modes.SAFE,
      proxy: proxy ? proxy.proxy : undefined,
      product: {
        name: productName ? toTitleCase(productName) : 'Unknown',
        price: Intl.NumberFormat(this.formatter, {
          style: 'currency',
          currency: this.currency
        }).format(Number(finalPrice)),
        image: `${image}`.startsWith('http') ? image : `https:${image}`,
        size: size || 'N/A',
        url: productUrl || url
      },
      store: {
        name,
        url
      },
      delays: {
        monitor,
        retry
      },
      profile: {
        name: profileName,
        type: cardType
      },
      quantity
    });
  }

  async enterQueue(from: string) {
    const {
      id,
      task: {
        store: { url }
      },
      taskSession
    } = this.context;

    emitEvent(this.context, [id], {
      message: 'Entering queue'
    });

    try {
      const cookies = await taskSession.cookies.get({});

      const isNewQueue = cookies.find(
        ({ name }) => name === '_checkout_queue_token'
      );

      if (isNewQueue) {
        this.nextQueueToken = decodeURIComponent(isNewQueue.value);
        this.useNewQueue = true;
      }

      const ctd = cookies.find((cookie: Cookie) => /_ctd/i.test(cookie.name));
      if (ctd) {
        this.ctd = ctd.value;
      }

      const { redirect } = await enterQueue({
        handler: this.handler,
        context: this.context,
        current: this.current,
        aborter: this.aborter,
        delayer: this.delayer,
        ctd: this.ctd || '',
        url,
        from
      });

      if (redirect) {
        this.extractCheckoutHash(redirect);

        if (/processing/i.test(redirect)) {
          return States.GET_ORDER;
        }

        if (!this.hash) {
          return States.INIT_CHECKOUT;
        }

        if (this.proceedTo) {
          const { proceedTo } = this;
          this.proceedTo = null;
          return proceedTo;
        }

        return States.GET_CUSTOMER;
      }
    } catch (e) {
      // fail silently...
    }

    return States.GET_QUEUE;
  }

  extractRecaptcha(body: string) {
    const { id, logger } = this.context;

    if (!body) {
      return;
    }

    const match = body.match(
      /.*<noscript>.*<iframe\s.*src=.*\?k=(.*)"><\/iframe>/
    );
    if (match && match.length) {
      [, this.context.task.store.sitekey] = match;
      logger.log({
        id,
        level: 'debug',
        message: `Parsed recaptcha sitekey: ${this.context.task.store.sitekey}`
      });
    }

    try {
      const sParam = body.split("s: '")[1].split("'")[0];
      if (sParam) {
        this.context.task.store.sParam = sParam;
      }

      logger.log({
        id,
        level: 'debug',
        message: `Parsed extra recaptcha parameters: ${this.context.task.store.sParam}`
      });
    } catch (e) {
      // fail silently...
    }
  }

  extractDiscountAuthToken($: any) {
    const { id, logger } = this.context;

    try {
      const list = $('[data-reduction-form]')
        .find('form > input[name="authenticity_token"]')
        .toArray()
        .map((el: any) => {
          try {
            return $(el).val();
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean);

      const lastToken = list[list.length - 1];

      logger.log({
        id,
        level: 'debug',
        message: `Parsed auth token: ${lastToken}`
      });

      this.discountAuthToken = lastToken;
    } catch (err) {
      // noop..
    }
  }

  extractAuthToken(selector: string, $: any) {
    const { id, logger } = this.context;

    try {
      const authTokenElement = $(selector);

      if (authTokenElement) {
        this.authToken = $(authTokenElement).attr('value') || '';
      }

      logger.log({
        id,
        level: 'debug',
        message: `Parsed auth token: ${this.authToken}`
      });
    } catch (e) {
      // fail silently...
    }
  }

  extractCheckoutHash(redirect: string) {
    if (
      /checkouts/i.test(redirect) &&
      !/checkpoint/i.test(redirect) &&
      !this.hash
    ) {
      const match = /.*?checkouts\/([0-9a-z]*)/i.exec(redirect);

      if (!match) {
        return;
      }

      [, this.hash] = match;
    }
  }

  extractFormThings($: any) {
    const { id, logger } = this.context;

    try {
      this.useCompany = $(
        'input[name="checkout[shipping_address][company]"]'
      ).length;

      logger.log({
        id,
        level: 'info',
        message: `Using company?: ${this.useCompany}`
      });
    } catch (e) {
      // fail silently...
    }

    try {
      this.useRemember = $('input[name*="remember_me"]').length;

      logger.log({
        id,
        level: 'info',
        message: `Using remember?: ${this.useRemember}`
      });
    } catch (e) {
      // fail silently...
    }

    try {
      this.useTerms = $('input[name*="Terms"]').length;

      logger.log({
        id,
        level: 'info',
        message: `Using terms?: ${this.useTerms}`
      });
    } catch (e) {
      // fail silently...
    }
  }

  extractProtection($: any, shipping = false) {
    const { id, logger } = this.context;

    try {
      this.protection = parseProtection($);

      if (shipping) {
        this.shippingProtection = this.protection;
      }

      logger.log({
        id,
        level: 'info',
        message: `Parsed ${this.protection?.length || 0} bot protection hashes`
      });
    } catch (e) {
      // fail silently...
    }
  }

  extractShippingMethod($: any) {
    const { id, logger } = this.context;

    try {
      const firstOptionElement = $('div.content-box__row .radio-wrapper');

      if (firstOptionElement) {
        this.shippingRate.id =
          $(firstOptionElement).attr('data-shipping-method') || '';
      }

      logger.log({
        id,
        level: 'debug',
        message: `Extracted shipping rate: ${this.shippingRate.id}`
      });
    } catch (e) {
      // fail silently...
    }
  }

  extractCurrency(body: string) {
    const { id, logger } = this.context;

    const currency = body.match(/Shopify\.Checkout\.currency\s*=\s*"(.*)"/);
    if (currency && currency.length) {
      [, this.currency] = currency;
    }

    logger.log({
      id,
      level: 'debug',
      message: `Extracted currency: ${this.currency}`
    });
  }

  extractPrice($: any) {
    const { id, logger } = this.context;

    try {
      let priceElement = $('span.total-recap__final-price');
      if (priceElement) {
        this.product.price =
          $(priceElement).attr('data-checkout-payment-due-target') || '';
      }

      if (!this.product.price) {
        priceElement = $('span.payment-due__price');

        if (priceElement) {
          this.product.price =
            $(priceElement).attr('data-checkout-payment-due-target') || '';
        }
      }

      const { price } = this.product;

      logger.log({
        id,
        level: 'debug',
        message: `Extracted price: ${insertDecimal(`${price}`)}`
      });
    } catch (e) {
      // fail silently...
    }
  }

  extractProductName($: any) {
    try {
      const productElement = $('span.product__description__name');
      if (productElement) {
        this.product.name = $(productElement).text();
      }

      const variantElement = $('span.product__description__variant');
      if (productElement) {
        this.product.variant.title = $(variantElement).text();
      }
    } catch (e) {
      // fail silently...
    }
  }

  extractGateway($: any) {
    const {
      id,
      logger,
      task: { paypal }
    } = this.context;

    try {
      if (paypal) {
        const gatewayElement = $('[data-gateway-name*="paypal"] input');
        if (gatewayElement) {
          this.gateway = $(gatewayElement).attr('value') || '';
        }
      } else {
        const gatewayElement = $('[data-gateway-name*="card"] input');
        if (gatewayElement) {
          this.gateway = $(gatewayElement).attr('value') || '';
        }
      }
      logger.log({
        id,
        level: 'debug',
        message: `Extracted gateway: ${this.gateway}`
      });
    } catch (e) {
      // fail silently...
    }
  }

  extractExpressToken(redirect: string) {
    const { id } = this.context;

    const match = /=(?=EC)(.*)(?=[&|?])/i.exec(redirect);
    if (!match) {
      emitEvent(this.context, [id], { message: 'Invalid express token' });

      return States.ERROR;
    }

    const [, token] = match;
    if (!token) {
      emitEvent(this.context, [id], { message: 'Invalid express token' });

      return States.ERROR;
    }

    this.expressCheckoutToken = token;

    return States.CREATE_GUEST;
  }

  async extractPayerId({ data }: any) {
    const { id } = this.context;

    if (!data) {
      emitEvent(this.context, [id], { message: 'Invalid payer id' });

      return States.ERROR;
    }

    const { onboardAccount } = data;
    if (!onboardAccount) {
      emitEvent(this.context, [id], { message: 'Invalid payer id' });

      return States.ERROR;
    }

    const { buyer } = onboardAccount;
    if (!buyer) {
      emitEvent(this.context, [id], { message: 'Invalid payer id' });

      return States.ERROR;
    }

    const { userId, auth } = buyer;
    if (!userId) {
      emitEvent(this.context, [id], { message: 'Invalid payer id' });

      return States.ERROR;
    }

    this.payerId = userId;

    const { accessToken } = auth;
    this.accessToken = accessToken;

    return States.APPROVE_GUEST;
  }

  async extractReturnUrl({ data }: any) {
    const { id } = this.context;

    if (!data) {
      emitEvent(this.context, [id], { message: 'Invalid return url' });

      return States.ERROR;
    }

    const { approveGuestSignUpPayment } = data;
    if (!approveGuestSignUpPayment) {
      emitEvent(this.context, [id], { message: 'Invalid return url' });

      return States.ERROR;
    }

    const { cart } = approveGuestSignUpPayment;
    if (!cart) {
      emitEvent(this.context, [id], { message: 'Invalid return url' });

      return States.ERROR;
    }

    const { returnUrl } = cart;
    if (!returnUrl) {
      emitEvent(this.context, [id], { message: 'Invalid return url' });

      return States.ERROR;
    }

    const { href } = returnUrl;
    if (!href) {
      emitEvent(this.context, [id], { message: 'Invalid return url' });

      return States.ERROR;
    }

    this.paypalReturnUrl = href;
    return States.GET_CALLBACK;
  }

  extractKey($: any) {
    const { id, logger } = this.context;

    try {
      const keyElement = $('meta[name="shopify-checkout-authorization-token"]');
      if (keyElement) {
        this.key = $(keyElement).attr('content') || '';
      }

      logger.log({
        id,
        level: 'debug',
        message: `Extracted checkout key: ${this.key}`
      });
    } catch (e) {
      // fail silently...
    }
  }

  extractProduct(body: AddToCartResponse) {
    const {
      product_title: productTitle,
      variant_title: variantTitle,
      image,
      handle,
      requires_shipping: skipShipping
    } = body;
    this.skipShipping = !skipShipping;

    const { url } = this.context.task.store;

    const message: AddToCartMessage = {};

    if (productTitle) {
      this.product.name = productTitle;
      message.productName = productTitle;
    }

    if (variantTitle) {
      this.product.variant.title = variantTitle;
      message.chosenSize = variantTitle;
    }

    if (handle) {
      this.product.url = `${url}/products/${handle}`;
    }

    if (image) {
      const newImage = `${image}`.startsWith('http') ? image : `https:${image}`;

      this.product.image = newImage;
      message.productImage = newImage;
      message.productImageHi = newImage;
    }

    if (!isEmpty(message)) {
      const { id } = this.context;

      emitEvent(this.context, [id], { ...message });
    }

    return this.stuffSession();
  }

  extractAllData(body: string) {
    const $ = load(body, { xmlMode: false, normalizeWhitespace: true });

    try {
      return Promise.allSettled([
        this.extractPrice($),
        this.extractProductName($),
        this.extractCurrency(body),
        this.extractKey($)
      ]);
    } catch (e) {
      const { id, logger } = this.context;

      logger.log({
        id,
        level: 'info',
        message: `Extracting all data error: ${e}`
      });
      // fail silently..
      return null;
    }
  }

  extractCartForm(body: string) {
    const $ = load(body, { normalizeWhitespace: true, xmlMode: false });

    const form = $(
      'form[action*="/cart"] input, select, textarea, button'
    ).attr('required', 'true');

    if (form) {
      $(form).each((_, el) => {
        const name = $(el).attr('name') || '';
        const value = $(el).attr('value') || '';

        if (name) {
          this.form += `${name}=${value}&`;
        }
      });
    }

    if (this.form.endsWith('&')) {
      this.form.slice(0, -1);
    }
  }

  extractStepToNextStep(state: string, body: string) {
    const {
      id,
      logger,
      task: { mode, paypal }
    } = this.context;

    const match = body.match(/Shopify\.Checkout\.step\s*=\s*"(.*)"/);
    if (match && match.length) {
      const [, step] = match;

      logger.log({
        id,
        level: 'info',
        message: `Proceeding to ${step} from ${state}`
      });

      if (/contact/i.test(step)) {
        if (state === States.GET_CUSTOMER) {
          if (mode === Modes.FAST || mode === Modes.RESTOCK) {
            if (this.shippingRate.id) {
              if (mode === Modes.RESTOCK) {
                return States.SUBMIT_SHIPPING;
              }
              return States.GET_SESSION;
            }

            return States.GET_SHIPPING;
          }

          return States.SUBMIT_CUSTOMER;
        }
        return States.GET_CUSTOMER;
      }

      if (/shipping/i.test(step)) {
        if (this.shippingRate.id) {
          if (mode === Modes.FAST) {
            return States.SUBMIT_PAYMENT;
          }

          if (mode === Modes.RESTOCK) {
            return States.SUBMIT_SHIPPING;
          }
        }

        if (state === States.GET_SHIPPING) {
          return States.SUBMIT_SHIPPING;
        }

        return States.GET_SHIPPING;
      }

      if (/payment/i.test(step)) {
        if (state === States.GET_PAYMENT) {
          if (paypal) {
            return States.SUBMIT_PAYMENT;
          }

          return States.GET_SESSION;
        }

        if (mode === Modes.RESTOCK) {
          return States.SUBMIT_PAYMENT;
        }

        return States.GET_PAYMENT;
      }

      if (/review/i.test(step)) {
        return States.SUBMIT_REVIEW;
      }
    }

    return null;
  }

  handler = async ({
    endpoint,
    options = {},
    message = '',
    from = this.prevState,
    timeout = 7500,
    includeHeaders = true
  }: {
    endpoint: string;
    options?: any;
    message?: string;
    from?: string;
    timeout?: number;
    includeHeaders?: boolean;
  }) => {
    const {
      id,
      aborted,
      logger,
      taskSession,
      proxy,
      task: {
        store: { url }
      }
    } = this.context;

    if (aborted) {
      return { nextState: States.ABORT };
    }

    if (message) {
      emitEvent(this.context, [id], { message });
    }

    const baseOptions = {
      proxy: proxy ? proxy.proxy : undefined,
      followAllRedirects: false,
      followRedirect: false,
      timeout
    };

    const requestHeaders = includeHeaders
      ? {
          ...getHeaders({ url }),
          ...options.headers
        }
      : {
          ...options.headers
        };

    const toRequest =
      // eslint-disable-next-line no-nested-ternary
      endpoint.indexOf('http') > -1
        ? endpoint
        : endpoint.startsWith('/')
        ? `${url}${endpoint}`
        : `${url}/${endpoint}`;

    const opts = {
      ...baseOptions,
      ...options,
      url: toRequest,
      headers: requestHeaders
    };

    try {
      const res = await request(taskSession, opts);

      let redirect;
      if (opts.followRedirect) {
        redirect = res?.request?.uri?.href;
      } else {
        redirect = res?.headers?.location;
      }

      logger.log({
        id,
        level: 'debug',
        message: `${from} REDIRECT: ${redirect}`
      });

      if (!redirect) {
        return { data: res };
      }

      return { data: res, redirect };
    } catch (error) {
      logger.log({
        id,
        level: 'error',
        message: `${from} error: ${(error as any)?.message || 'Unknown'}`
      });

      if (!message) {
        return { data: {}, error: true, nextState: from };
      }

      if (isTimeout(error)) {
        emitEvent(this.context, [id], {
          message: `Error ${message.toLowerCase()} [TIMEOUT]`
        });

        return { data: {}, error: true, nextState: from };
      }

      if (isNetworkError(error)) {
        emitEvent(this.context, [id], {
          message: `Error ${message.toLowerCase()} [NETWORK]`
        });

        return { data: {}, error: true, nextState: from };
      }

      emitEvent(this.context, [id], {
        message: `Error ${message.toLowerCase()} [UNKNOWN]`
      });

      return { data: {}, error: true, nextState: from };
    }
  };

  async getHomepage() {
    const {
      id,
      task: { retry }
    } = this.context;

    const { nextState, data = {} } = await getHomepage({
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
        message: `Error visiting homepage [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_HOMEPAGE;
    }

    return States.GET_CONFIG;
  }

  async getConfig() {
    const {
      id,
      task: { retry }
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

    // next state determined by sub classes
    return States.DONE;
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

      return States.DONE;
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

  async getAccount() {
    const {
      id,
      task: {
        retry,
        password,
        store: { url }
      }
    } = this.context;

    const { nextState, data, redirect } = await getAccount({
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

    const { statusCode, body } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting account [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_ACCOUNT;
    }

    if (/window\.Shopify\.recaptchaV3/i.test(body)) {
      this.context.task.store.sitekey =
        '6LcCR2cUAAAAANS1Gpq_mDIJ2pQuJphsSQaUEuc9';
      this.loginCaptcha = true;

      await this.injectRequester({ type: CAPTCHA_TYPES.RECAPTCHA_V3 });
      return States.CAPTCHA;
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
    }

    return States.SUBMIT_ACCOUNT;
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
          this.proceedTo = States.SUBMIT_ACCOUNT;
          return States.SUBMIT_PASSWORD;
        }

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.SUBMIT_ACCOUNT;
      }

      if (/login/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Invalid credentials'
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.SUBMIT_ACCOUNT;
      }

      if (/account/i.test(redirect)) {
        if (this.proceedTo) {
          const { proceedTo } = this;
          this.proceedTo = null;
          return proceedTo;
        }

        if (this.preloading) {
          return States.GET_PRODUCT;
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

        return States.SUBMIT_ACCOUNT;
      }

      if (/account/i.test(redirect)) {
        this.context.setCaptchaToken('');
        return States.WAIT_FOR_PRODUCT;
      }
    }

    emitEvent(this.context, [id], {
      message: 'Error submitting challenge [UNKNOWN]'
    });

    return States.GET_CHALLENGE;
  }

  async waitForProduct() {
    const {
      aborted,
      task: { mode }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    if (this.context.task.password && !this.submittedPassword) {
      this.proceedTo = States.WAIT_FOR_PRODUCT;

      return States.SUBMIT_PASSWORD;
    }

    if (this.context.product.variants) {
      const variant = await pickVariant({ context: this.context });

      if (!variant) {
        this.delayer = waitForDelay(150, this.aborter.signal);
        await this.delayer;

        return States.WAIT_FOR_PRODUCT;
      }

      this.product = {
        ...this.context.product,
        variant
      };

      if (mode === Modes.FAST || mode === Modes.RESTOCK) {
        return States.PATCH_CHECKOUT;
      }

      return States.SUBMIT_CART;
    }

    this.delayer = waitForDelay(150, this.aborter.signal);
    await this.delayer;

    return States.WAIT_FOR_PRODUCT;
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

    // nextState decided by subclasses
    return States.DONE;
  }

  async getCart() {
    const {
      id,
      task: { retry }
    } = this.context;

    this.form = '';

    const { nextState, data = {} } = await getCart({
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

    const { statusCode, body } = data;

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting cart [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_CART;
    }

    this.extractCartForm(body);

    return States.INIT_CHECKOUT;
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
      this.form = '';
      this.context.setCaptchaToken('');
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

    if (redirect) {
      this.extractCheckoutHash(redirect);

      if (/throttle/i.test(redirect)) {
        this.form = '';
        this.context.setCaptchaToken('');

        return this.enterQueue(States.SUBMIT_CHECKPOINT);
      }

      if (/checkpoint/i.test(redirect)) {
        this.form = '';
        this.context.setCaptchaToken('');

        emitEvent(this.context, [id], {
          message: 'Invalid captcha token'
        });

        await this.injectRequester({
          type: CAPTCHA_TYPES.RECAPTCHA_V2C,
          redirect: this.checkpointUrl
        });

        return States.CAPTCHA;
      }

      if (/checkouts/i.test(redirect)) {
        this.form = '';
        this.context.setCaptchaToken('');

        if (this.proceedTo && !this.preloading) {
          const next = this.proceedTo;
          this.proceedTo = null;
          return next;
        }

        if (this.preloading) {
          return States.CLEAR_CART;
        }

        return States.GET_CUSTOMER;
      }

      if (/cart/i.test(redirect)) {
        this.form = '';
        this.context.setCaptchaToken('');

        if (this.preloading && this.hash) {
          return States.CLEAR_CART;
        }

        if (this.hash) {
          return States.GET_CUSTOMER;
        }

        return States.INIT_CHECKOUT;
      }

      if (/checkout/i.test(redirect)) {
        this.form = '';
        this.context.setCaptchaToken('');

        if (this.preloading && this.hash) {
          return States.CLEAR_CART;
        }

        if (this.hash) {
          return States.GET_CUSTOMER;
        }

        return States.INIT_CHECKOUT;
      }
    }

    emitEvent(this.context, [id], {
      message: 'Error submitting checkpoint [UNKNOWN]'
    });

    return States.SUBMIT_CHECKPOINT;
  }

  async getQueue() {
    const {
      task: {
        store: { url }
      }
    } = this.context;

    if (this.useNewQueue) {
      return States.GET_NEXT_QUEUE;
    }

    const { data = {} } = await waitInQueue({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      ctd: this.ctd,
      url
    });

    const { statusCode, headers = {} } = data;
    if (statusCode !== 200) {
      const retryAfter = headers['retry-after'] * 1000 || 5000;

      this.delayer = waitForDelay(retryAfter, this.aborter.signal);
      await this.delayer;

      return States.GET_QUEUE;
    }

    const { redirect } = await passedQueue({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      ctd: this.ctd
    });

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

      if (/processing/i.test(redirect)) {
        return States.GET_ORDER;
      }
    }

    if (this.proceedTo) {
      const { proceedTo } = this;
      this.proceedTo = null;
      return proceedTo;
    }

    return States.GET_CUSTOMER;
  }

  async getNextQueue() {
    const {
      id,
      task: {
        store: { url }
      },
      taskSession
    } = this.context;

    const { data = {} } = await waitInNextQueue({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      storeUrl: url,
      eta: this.queueEta,
      available: this.queueAvailability,
      token: this.nextQueueToken
    });

    const { body } = data;
    if (body?.data?.poll) {
      const {
        __typename,
        token,
        queueEtaSeconds,
        productVariantAvailability
      } = body?.data?.poll;

      if (/continue/i.test(__typename)) {
        this.nextQueueToken = token;

        await taskSession.cookies.set({
          url,
          name: '_checkout_queue_token',
          value: `${encodeURIComponent(this.nextQueueToken)}`
        });

        if (queueEtaSeconds !== 0) {
          this.queueEta = `${queueEtaSeconds}`;
        }

        if (productVariantAvailability?.length) {
          const [prod] = productVariantAvailability;

          if (prod) {
            const { available } = prod;

            this.queueAvailability = !available ? 'OOS' : '';
          }
        }

        let message = 'Waiting in queue';

        if (this.queueEta) {
          message = `Waiting in queue [${this.queueEta}s]`;
        }

        if (this.queueAvailability !== '') {
          message = `Waiting in queue [${this.queueAvailability}]`;
        }

        emitEvent(this.context, [id], { message });

        this.delayer = waitForDelay(10000, this.aborter.signal);
        await this.delayer;

        return States.GET_NEXT_QUEUE;
      }

      // Passed queue, let's set token and proceed
      if (/complete/i.test(__typename)) {
        await taskSession.cookies.set({
          url,
          name: '_checkout_queue_token',
          value: decodeURIComponent(token)
        });

        if (this.hash) {
          if (this.proceedTo) {
            const { proceedTo } = this;
            this.proceedTo = null;
            return proceedTo;
          }

          return States.GET_CUSTOMER;
        }

        return States.INIT_CHECKOUT;
      }
    }

    this.delayer = waitForDelay(5000, this.aborter.signal);
    await this.delayer;

    return States.GET_QUEUE;
  }

  async waitForCaptcha() {
    let message = 'Checkout captcha';
    if (this.checkpoint) {
      message = 'Checkpoint captcha';
    }

    if (this.challenge) {
      message = 'Challenge captcha';
    }

    if (this.loginCaptcha) {
      message = 'Login captcha';
    }

    const nextState = await super.waitForCaptcha(message);
    if (nextState !== States.DONE) {
      return nextState;
    }

    if (this.loginCaptcha) {
      this.loginCaptcha = false;
      return States.SUBMIT_ACCOUNT;
    }

    if (this.challenge) {
      this.challenge = false;
      return States.SUBMIT_CHALLENGE;
    }

    if (this.checkpoint) {
      this.checkpoint = false;
      return States.SUBMIT_CHECKPOINT;
    }

    if (this.proceedTo) {
      const { proceedTo } = this;
      this.proceedTo = null;
      return proceedTo;
    }

    return this.prevState;
  }

  async getCustomer() {
    const {
      id,
      task: {
        password,
        monitor,
        retry,
        mode,
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

    const { statusCode } = data;

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

      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.GET_CUSTOMER;

        return this.enterQueue(States.GET_CUSTOMER);
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
        if (mode === Modes.FAST || mode === Modes.RESTOCK) {
          this.restocking = true;

          this.context.task.mode = Modes.RESTOCK;
          emitEvent(this.context, [id], {
            mode: Modes.RESTOCK,
            backupMode: Modes.FAST
          });

          return States.DONE;
        }

        emitEvent(this.context, [id], { message: 'Out of stock' });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_CUSTOMER;
      }
    }

    const { body } = data;

    if (
      /Calculating taxes/i.test(body) &&
      mode !== Modes.FAST &&
      mode !== Modes.RESTOCK
    ) {
      emitEvent(this.context, [id], { message: 'Polling payment' });

      this.polling = true;
      return States.GET_PAYMENT;
    }

    const $ = load(body, { xmlMode: false, normalizeWhitespace: true });
    await Promise.allSettled([
      this.extractPrice($),
      this.extractFormThings($),
      this.extractProtection($),
      this.extractAuthToken(
        'form.edit_checkout input[name=authenticity_token]',
        $
      )
    ]);

    const stepState = this.extractStepToNextStep(States.GET_CUSTOMER, body);

    if (stepState) {
      return stepState;
    }

    return States.INIT_CHECKOUT;
  }

  async submitCustomer() {
    const {
      id,
      captchaToken,
      shopId,
      task: {
        retry,
        mode,
        monitor,
        store: { url }
      }
    } = this.context;

    const profile = this.retrieveProfile();
    if (!profile) {
      emitEvent(this.context, [id], {
        message: `Profile not found`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_CUSTOMER;
    }

    const { nextState, data = {}, redirect } = await submitCustomer({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      shopId,
      form: submitCustomerForm({
        useCompany: this.useCompany,
        useTerms: this.useTerms,
        useRemember: this.useRemember,
        profile,
        authToken: this.authToken,
        protection: this.protection,
        captchaToken
      }),
      url
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      if (mode === Modes.SAFE || mode === Modes.PRELOAD) {
        return States.GET_CUSTOMER;
      }

      return nextState;
    }

    const { statusCode, body } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting information [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      if (mode === Modes.SAFE || mode === Modes.PRELOAD) {
        return States.GET_CUSTOMER;
      }

      return States.SUBMIT_CUSTOMER;
    }

    this.context.setCaptchaToken('');

    if (redirect) {
      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.SUBMIT_CUSTOMER;
        return this.enterQueue(States.SUBMIT_CUSTOMER);
      }

      if (/stock_problems/i.test(redirect)) {
        if (mode === Modes.FAST) {
          if (this.rewinded) {
            return States.SUBMIT_REVIEW;
          }

          if (this.shippingRate.id) {
            return States.SUBMIT_SHIPPING;
          }

          return States.GET_SHIPPING;
        }

        if (mode === Modes.RESTOCK) {
          return States.GET_SESSION;
        }

        emitEvent(this.context, [id], {
          message: 'Out of stock'
        });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        if (this.skipShipping) {
          return States.GET_PAYMENT;
        }

        return States.GET_SHIPPING;
      }

      if (/previous_step=contact_information/i.test(redirect)) {
        if (this.skipShipping) {
          return States.GET_PAYMENT;
        }

        return States.GET_SHIPPING;
      }
    }

    if (/Enter a new shipping address and try again./i.test(body)) {
      emitEvent(this.context, [id], {
        message: `Invalid shipping address`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_CUSTOMER;
    }

    const stepState = this.extractStepToNextStep(States.SUBMIT_CUSTOMER, body);
    if (stepState) {
      return stepState;
    }

    emitEvent(this.context, [id], {
      message: 'Error submitting customer [UNKNOWN]'
    });

    return States.GET_CUSTOMER;
  }

  async getShipping() {
    const {
      id,
      shopId,
      task: {
        retry,
        monitor,
        password,
        store: { url }
      }
    } = this.context;

    const { nextState, data = {}, redirect } = await getShipping({
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

    // reset poll flag no matter what
    this.polling = false;

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;
    if (statusCode === 202) {
      this.polling = true;

      emitEvent(this.context, [id], { message: 'Polling rates' });

      this.delayer = waitForDelay(1000, this.aborter.signal);
      await this.delayer;

      return States.GET_SHIPPING;
    }

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting shipping [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SHIPPING;
    }

    if (redirect) {
      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.GET_SHIPPING;
        return this.enterQueue(States.GET_SHIPPING);
      }

      if (/stock_problems/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Out of stock'
        });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_SHIPPING;
      }

      if (/password/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Password page'
        });

        if (password) {
          this.proceedTo = States.GET_SHIPPING;
          return States.SUBMIT_PASSWORD;
        }

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_SHIPPING;
      }
    }

    const { body } = data;

    if (/order can’t be shipped to your location/i.test(body)) {
      emitEvent(this.context, [id], {
        message: `Unsupported country`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SHIPPING;
    }

    if (/no shipping methods/i.test(body)) {
      emitEvent(this.context, [id], {
        message: 'No rates available'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SHIPPING;
    }

    if (/Getting available shipping/i.test(body)) {
      this.polling = true;

      // using a pre-harvested shipping rate
      if (this.shippingRate.id) {
        const $ = load(body, { xmlMode: false, normalizeWhitespace: true });

        await Promise.allSettled([
          this.extractProtection($, true),
          this.extractAuthToken(
            'form.edit_checkout input[name=authenticity_token]',
            $
          )
        ]);

        return States.SUBMIT_SHIPPING;
      }

      this.delayer = waitForDelay(1000, this.aborter.signal);
      await this.delayer;

      return States.GET_SHIPPING;
    }

    const $ = load(body, { xmlMode: false, normalizeWhitespace: true });
    await Promise.allSettled([
      this.extractProtection($, true),
      this.extractAuthToken(
        'form.edit_checkout input[name=authenticity_token]',
        $
      ),
      this.extractShippingMethod($)
    ]);

    // retry if we failed to pull the rate
    if (!this.shippingRate.id) {
      return States.GET_SHIPPING;
    }

    return States.SUBMIT_SHIPPING;
  }

  async submitShipping() {
    const {
      id,
      task: {
        mode,
        retry,
        monitor,
        store: { url }
      },
      shopId
    } = this.context;

    const { nextState, data, redirect } = await submitShipping({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      follow: this.resubmitShipping,
      shopId,
      url,
      form: submitShippingForm({
        useTerms: this.useTerms,
        rate: this.shippingRate.id,
        authToken: this.authToken,
        protection: this.shippingProtection
      })
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      if (mode === Modes.SAFE || mode === Modes.PRELOAD) {
        return States.GET_SHIPPING;
      }

      return nextState;
    }

    const { statusCode, body } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting shipping [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      if (mode === Modes.SAFE || mode === Modes.PRELOAD) {
        return States.GET_SHIPPING;
      }

      return States.SUBMIT_SHIPPING;
    }

    if (this.resubmitShipping) {
      return States.GET_PRICE;
    }

    if (redirect) {
      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.SUBMIT_SHIPPING;
        return this.enterQueue(States.SUBMIT_SHIPPING);
      }

      if (/stock_problems/i.test(redirect)) {
        if (mode === Modes.FAST || mode === Modes.RESTOCK) {
          return States.GET_SESSION;
        }

        emitEvent(this.context, [id], { message: 'Out of stock' });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_PAYMENT;
      }

      if (/previous_step=shipping_method/i.test(redirect)) {
        return States.GET_PAYMENT;
      }
    }

    const stepState = this.extractStepToNextStep(States.SUBMIT_SHIPPING, body);

    if (stepState) {
      return stepState;
    }

    emitEvent(this.context, [id], {
      message: 'Error submitting shipping [UNKNOWN]'
    });

    return States.GET_SHIPPING;
  }

  async getPayment() {
    const {
      id,
      shopId,
      task: {
        mode,
        retry,
        monitor,
        maxPrice,
        discount,
        store: { url }
      }
    } = this.context;

    if (this.preloading) {
      return States.CLEAR_CART;
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
      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.GET_PAYMENT;
        return this.enterQueue(States.GET_PAYMENT);
      }

      if (/stock_problems/i.test(redirect)) {
        if (this.restocking) {
          return States.GET_PRICE;
        }

        emitEvent(this.context, [id], { message: 'Out of stock' });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_PAYMENT;
      }

      if (/checkpoint/i.test(redirect)) {
        await this.injectRequester({
          type: CAPTCHA_TYPES.RECAPTCHA_V2C,
          redirect
        });

        this.checkpointUrl = redirect;
        return States.CAPTCHA;
      }
    }

    if (this.restocking) {
      return States.GET_PRICE;
    }

    const { body } = data;

    if (/Calculating taxes/i.test(body)) {
      this.polling = true;
      return States.GET_PAYMENT;
    }

    const $ = load(body, { xmlMode: false, normalizeWhitespace: true });
    if (
      discount &&
      !this.appliedDiscount &&
      mode !== Modes.FAST &&
      mode !== Modes.RESTOCK &&
      mode !== Modes.PFUTILE
    ) {
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

    const { price } = this.product;
    if (maxPrice && price && insertDecimal(`${price}`) > Number(maxPrice)) {
      emitEvent(this.context, [id], {
        message: 'Exceeded max price'
      });

      return States.ERROR;
    }

    if (
      (mode === Modes.FAST || mode === Modes.RESTOCK) &&
      !this.shippingRate.id
    ) {
      return States.GET_SHIPPING;
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

  async submitDiscount() {
    const {
      id,
      task: {
        mode,
        retry,
        monitor,
        discount,
        store: { url }
      },
      shopId
    } = this.context;

    const { nextState, data, redirect } = await submitDiscount({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      shopId,
      url,
      form: submitDiscountForm({
        authToken: this.discountAuthToken,
        discount
      })
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting discount [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_DISCOUNT;
    }

    if (redirect) {
      this.appliedDiscount = true;

      if (/stock_problems/i.test(redirect)) {
        if (mode === Modes.FAST || mode === Modes.RESTOCK) {
          return States.GET_SESSION;
        }

        emitEvent(this.context, [id], { message: 'Out of stock' });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_PAYMENT;
      }

      if (/step=payment_method/i.test(redirect)) {
        return States.GET_PAYMENT;
      }
    }

    emitEvent(this.context, [id], {
      message: 'Invalid discount code'
    });

    this.delayer = waitForDelay(retry, this.aborter.signal);
    await this.delayer;

    return States.SUBMIT_DISCOUNT;
  }

  async getTotalPrice() {
    const {
      id,
      taskSession,
      accessToken,
      task: {
        retry,
        store: { url }
      }
    } = this.context;

    const cookies = await taskSession.cookies.get({});
    await taskSession.clearStorageData();

    const { nextState, data } = await getTotalPrice({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      accessToken
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    // re-add the cookies
    for (const cookie of cookies) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await taskSession.cookies.set({ url, ...cookie });
      } catch (e) {
        // noop
      }
    }

    const { statusCode } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error calculating taxes [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_PAYMENT;
    }

    const { body } = data;

    if (!this.calculated) {
      this.calculated = true;
      return States.GET_PAYMENT;
    }

    const { total_price: totalPrice } = body.checkout;
    this.product.price = totalPrice.replace(/\./g, '');

    this.merging = false;

    return States.GET_SESSION;
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
        useCompany: this.useCompany,
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
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      if (mode === Modes.SAFE || mode === Modes.PRELOAD) {
        return States.GET_PAYMENT;
      }

      return nextState;
    }

    const { statusCode, body } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting payment [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      if (mode === Modes.SAFE || mode === Modes.PRELOAD) {
        return States.GET_PAYMENT;
      }

      return States.SUBMIT_PAYMENT;
    }

    if (redirect) {
      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.SUBMIT_PAYMENT;
        return this.enterQueue(States.SUBMIT_PAYMENT);
      }

      if (/processing/i.test(redirect)) {
        return States.GET_ORDER;
      }

      if (/stock_problems/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Out of stock'
        });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_PAYMENT;
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

    return States.GET_PAYMENT;
  }

  async createGuest() {
    const {
      id,
      logger,
      task: { retry }
    } = this.context;

    const profile = this.retrieveProfile();
    if (!profile) {
      emitEvent(this.context, [id], {
        message: `Profile not found`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.CREATE_GUEST;
    }

    const { nextState, data } = await createGuest({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      expressCheckoutToken: this.expressCheckoutToken,
      json: {
        operationName: 'OnboardGuestMutation',
        variables: onboardGuest(profile, this.expressCheckoutToken),
        query:
          'mutation OnboardGuestMutation($bank: BankAccountInput, $billingAddress: AddressInput, $card: CardInput, $country: CountryCodes, $currencyConversionType: CheckoutCurrencyConversionType, $dateOfBirth: DateOfBirth, $email: String, $firstName: String!, $lastName: String!, $phone: PhoneInput, $shareAddressWithDonatee: Boolean, $shippingAddress: AddressInput, $supportedThreeDsExperiences: [ThreeDSPaymentExperience], $token: String!) {\n  onboardAccount: onboardGuest(bank: $bank, billingAddress: $billingAddress, card: $card, country: $country, currencyConversionType: $currencyConversionType, dateOfBirth: $dateOfBirth, email: $email, firstName: $firstName, lastName: $lastName, phone: $phone, shareAddressWithDonatee: $shareAddressWithDonatee, shippingAddress: $shippingAddress, token: $token) {\n    buyer {\n      auth {\n        accessToken\n        __typename\n      }\n      userId\n      __typename\n    }\n    flags {\n      is3DSecureRequired\n      __typename\n    }\n    paymentContingencies {\n      threeDomainSecure(experiences: $supportedThreeDsExperiences) {\n        status\n        redirectUrl {\n          href\n          __typename\n        }\n        method\n        parameter\n        experience\n        requestParams {\n          key\n          value\n          __typename\n        }\n        __typename\n      }\n      threeDSContingencyData {\n        name\n        causeName\n        resolution {\n          type\n          resolutionName\n          paymentCard {\n            id\n            type\n            number\n            bankIdentificationNumber\n            __typename\n          }\n          contingencyContext {\n            deviceDataCollectionUrl {\n              href\n              __typename\n            }\n            jwtSpecification {\n              jwtDuration\n              jwtIssuer\n              jwtOrgUnitId\n              type\n              __typename\n            }\n            reason\n            referenceId\n            source\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n'
      }
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.CREATE_GUEST} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;

    const bodyString = JSON.stringify(body);
    if (
      /card_generic_error|CREATE_CARD_ACCOUNT_CANDIDATE_VALIDATION_ERROR/i.test(
        bodyString
      )
    ) {
      emitEvent(this.context, [id], {
        message: `Error creating guest [GENERIC]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.CREATE_GUEST;
    }

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error creating guest [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.CREATE_GUEST;
    }

    return this.extractPayerId(body);
  }

  async approveGuest() {
    const {
      id,
      logger,
      task: { retry }
    } = this.context;

    const { nextState, data } = await approveGuest({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      expressCheckoutToken: this.expressCheckoutToken,
      accessToken: this.accessToken,
      json: {
        operationName: 'ApproveOnboardPaymentMutation',
        variables: {
          token: this.expressCheckoutToken
        },
        query:
          'mutation ApproveOnboardPaymentMutation($token: String!) {\n  approveGuestSignUpPayment(token: $token) {\n    buyer {\n      userId\n      __typename\n    }\n    cart {\n      paymentId\n      returnUrl {\n        href\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n'
      }
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.APPROVE_GUEST} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error approving guest [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.APPROVE_GUEST;
    }

    return this.extractReturnUrl(body);
  }

  async getCallbackUrl() {
    const {
      id,
      task: {
        retry,
        monitor,
        store: { url }
      }
    } = this.context;

    const { nextState, data, redirect } = await getCallbackUrl({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      storeUrl: url,
      returnUrl: this.paypalReturnUrl
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 500) {
        emitEvent(this.context, [id], {
          message: 'Payment error'
        });

        return States.ERROR;
      }

      emitEvent(this.context, [id], {
        message: `Error visiting callback [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_CALLBACK;
    }

    if (redirect) {
      if (/processing/i.test(redirect)) {
        return States.GET_ORDER;
      }

      if (/stock_problems/i.test(redirect)) {
        emitEvent(this.context, [id], {
          message: 'Out of stock'
        });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_PAYMENT;
      }

      if (/checkoutnow/i.test(redirect)) {
        return this.extractExpressToken(redirect);
      }
    }

    emitEvent(this.context, [id], {
      message: 'Error visiting callback [UNKNOWN]'
    });

    return States.GET_CALLBACK;
  }

  async getReview() {
    const {
      id,
      shopId,
      task: { mode, retry, monitor }
    } = this.context;

    const { nextState, data, redirect } = await getReview({
      handler: this.handler,
      context: this.context,
      current: this.current,
      aborter: this.aborter,
      delayer: this.delayer,
      hash: this.hash,
      shopId
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;
    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting review [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_REVIEW;
    }

    if (redirect) {
      if (/stock_problems/i.test(redirect)) {
        if (mode === Modes.FAST && mode === Modes.RESTOCK) {
          return States.GET_SESSION;
        }

        emitEvent(this.context, [id], { message: 'Out of stock' });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_REVIEW;
      }

      if (/throttle/i.test(redirect)) {
        this.proceedTo = States.GET_REVIEW;
        return this.enterQueue(States.GET_REVIEW);
      }
    }

    if (/Calculating taxes/i.test(body)) {
      this.polling = true;
      return States.GET_REVIEW;
    }

    const $ = load(body, { xmlMode: false, normalizeWhitespace: true });
    await Promise.allSettled([
      this.extractAuthToken(
        'form.edit_checkout input[name=authenticity_token]',
        $
      ),
      this.extractPrice($)
    ]);

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

        if (mode === Modes.FAST || mode === Modes.RESTOCK) {
          return States.GET_CONFIG;
        }

        return States.GET_HOMEPAGE;
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
}
