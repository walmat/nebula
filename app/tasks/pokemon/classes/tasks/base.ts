/* eslint-disable no-restricted-syntax */
import decode from 'jwt-decode';
import qs from 'query-string';
import { isEmpty } from 'lodash';
import isHtml from 'is-html';
import { load } from 'cheerio';
import uuid from 'uuid';

import {
  emitEvent,
  waitForDelay,
  isNetworkError,
  isImproperStatusCode,
  toTitleCase,
  isTimeout,
  request
} from '../../../common/utils';
import { BaseTask } from '../../../common/classes';
import { Platforms, SiteKeyForPlatform } from '../../../common/constants';
import { PokemonContext } from '../../../common/contexts';
import {
  getCookie,
  getSession,
  getProduct,
  getProducts,
  addToCart,
  submitEmail,
  submitInformation,
  clearCart,
  getKeyId,
  createEncryption,
  submitPayment,
  submitCheckout,
  submitCaptcha
} from '../functions';
import { getHeaders, getCardType, pickVariant, userAgents } from '../../utils';
import { email, information } from '../../utils/forms';
import { Task } from '../../constants';

import {
  Product,
  Products,
  Cart,
  Information,
  Key,
  Payment,
  Success,
  DatadomeData,
  DatadomeCookie
} from '../../types';

import { JsonWebTokenInfo } from '../../utils/encrypt';
import CAPTCHA_TYPES from '../../../../utils/captchaTypes';

const { States, Modes } = Task;

export class BasePokemonTask extends BaseTask {
  context: PokemonContext;

  active: 0 | 1;

  microform: string;

  currency: string;

  formatter: string;

  preloadUri: string;

  preloadSku: string;

  atcUri: string;

  cartUri: string;

  purchaseUri: string;

  keyId: string;

  paymentKey: string;

  paymentToken: string;

  product: any;

  authToken: string;

  proceedTo: string | null;

  swapped: boolean;

  data: DatadomeData;

  cid: string;

  attempts: number;

  preloaded: boolean;

  added: boolean;

  submitted: boolean;

  products: string[];

  waitForCookieTimeout: number;

  captchaCookie: string;

  retries: number;

  agent: any;

  purgeCookie: boolean;

  email: boolean;

  needsCookie: boolean;

  responsePage: string;

  jsType: string;

  ddv: string;

  constructor(context: PokemonContext, platform = Platforms.Pokemon) {
    super(context, States.GET_SESSION, platform);

    this.active = 0;

    this.microform = '0.11.3';

    this.currency = 'USD';
    this.formatter = 'en-US';

    this.context = context;

    this.preloadUri = '';

    this.preloadSku = '';

    this.cartUri = '';

    this.atcUri = '';

    this.purchaseUri = '';

    this.keyId = '';

    this.paymentKey = '';

    this.paymentToken = '';

    this.product = {};

    this.authToken = '';

    this.proceedTo = null;

    this.cid = '';

    this.preloaded = this.context.task.mode !== Modes.PRELOAD;

    this.added = false;

    this.needsCookie = true;

    this.submitted = false;

    this.swapped = false;

    this.attempts = 0;

    this.data = {} as DatadomeData;

    this.products = [];

    this.waitForCookieTimeout = 0;

    this.captchaCookie = '';

    this.retries = 0;

    this.purgeCookie = false;

    this.email = false;

    this.responsePage = 'origin';

    this.jsType = '';

    this.ddv = '4.1.67';

    this.setInitialCookies();
  }

  setInitialCookies = () => {
    const {
      task: {
        store: { name, url }
      },
      taskSession
    } = this.context;

    const correlationId = uuid();

    const cookies = [
      {
        name: 'correlationId',
        value: correlationId
      },
      {
        name: 'nmstat',
        value: uuid()
      },
      {
        name: 'complianceCookie',
        value: 'true'
      },
      {
        name: 'amp_logged_in_status',
        value: 'N'
      },
      {
        name: 'nmstat',
        value: uuid()
      },
      {
        name: 'amp_correlationID',
        value: correlationId
      },
      {
        name: 'amp_storefront',
        value: /ca/i.test(name) ? 'CA' : 'US'
      }
    ];

    return Promise.allSettled(
      cookies.map(cookie => taskSession.cookies.set({ url, ...cookie }))
    );
  };

  inject = async (data: any) => {
    if (!isEmpty(data)) {
      Object.entries(data).map(([key, value]: [string, any]) => {
        if (key) {
          (this as any)[key] = value;
        }

        return null;
      });
    }
  };

  release = async (cookie: string) => {
    const { id, logger } = this.context;

    logger.log({
      id,
      level: 'info',
      message: `Received datadome cookie: ${cookie}`
    });

    this.captchaCookie = cookie;
  };

  async injectRequester(data: DatadomeData) {
    const {
      id,
      captchaManager,
      task: {
        store: { sitekey }
      },
      proxy
    } = this.context;

    this.context.setCaptchaToken('');

    emitEvent(this.context, [id], { message: 'Waiting for captcha' });

    captchaManager.insert({
      id,
      type: CAPTCHA_TYPES.RECAPTCHA_V2,
      harvest: this.harvest as any,
      host: data.host,
      platform: Platforms.Pokemon,
      userAgent: userAgents[this.active],
      sitekey: sitekey || SiteKeyForPlatform[Platforms.Pokemon],
      proxy: proxy ? proxy.ip : undefined
    });
  }

  extractDatadomeData(url: string): DatadomeData {
    const data = qs.parse(
      (url || '').replace('https://geo.captcha-delivery.com/captcha/', '')
    );

    return {
      ...data,
      // @ts-ignore
      hsh: data?.hash,
      host: 'geo.captcha-delivery.com'
    };
  }

  async removeDatadome(headers: any) {
    const {
      taskSession,
      task: {
        store: { url: storeUrl }
      }
    } = this.context;

    const setCookies = headers['set-cookie'];
    const dd = setCookies.find((c: string) => /datadome/i.test(c));
    const ddVal = dd.split('datadome=')[1].split(';')[0];
    const cooks = await taskSession.cookies.get({});
    for (const cookie of cooks) {
      if (/datadome/i.test(cookie.name)) {
        // eslint-disable-next-line no-await-in-loop
        await taskSession.cookies.remove(storeUrl, 'datadome');
      }
    }

    await taskSession.cookies.set({
      url: storeUrl,
      domain: '.pokemoncenter.com',
      name: 'datadome',
      value: ddVal
    });
  }

  async handleDatadome(body: any, headers: any) {
    const {
      id,
      proxy,
      task: {
        retry,
        store: { url: storeUrl }
      },
      taskSession
    } = this.context;

    if (/Generated by cloudfront/i.test(body)) {
      emitEvent(this.context, [id], { message: 'Cloudfront error' });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      const next = this.proceedTo;
      this.proceedTo = null;
      return next;
    }

    await this.removeDatadome(headers);

    if (this.retries > 2) {
      const cookies = await taskSession.cookies.get({});
      for (const cookie of cookies) {
        if (/datadome/i.test(cookie.name)) {
          // eslint-disable-next-line no-await-in-loop
          await taskSession.cookies.remove(storeUrl, 'datadome');
        }
      }

      this.needsCookie = true;
      this.retries = 0;
      return States.SWAP;
    }

    this.retries += 1;

    let url;
    try {
      if (typeof body === 'string') {
        if (isHtml(body)) {
          const $ = load(body, { normalizeWhitespace: true, xmlMode: false });

          let ret = {} as DatadomeData;

          $('script').each((_, el) => {
            const text = $(el).html();

            try {
              if (/var\sdd/i.test(text!)) {
                const match = /dd=(.*)/.exec(text!);

                const [, data] = match!;

                ret = JSON.parse(data.replace(/'/g, '"'));
              }
            } catch (e) {
              // noop...
            }
          });

          const { host, cid, hsh, s, t } = ret;
          url = `https://${host}/captcha/?initialCid=${cid}&hash=${hsh}&t=${t}&s=${s}&referer=https://www.pokemoncenter.com/`;
        }
        ({ url } = JSON.parse(body));
      } else {
        ({ url } = body);
      }
    } catch (err) {
      // noop..
    }

    if (!url) {
      const next = this.proceedTo;
      this.proceedTo = null;
      return next;
    }

    const ddd = this.extractDatadomeData(url);
    if (ddd.t === 'bv') {
      emitEvent(this.context, [id], { message: 'Proxy banned, swapping...' });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      const cookies = await taskSession.cookies.get({});
      for (const cookie of cookies) {
        if (/datadome/i.test(cookie.name)) {
          // eslint-disable-next-line no-await-in-loop
          await taskSession.cookies.remove(storeUrl, 'datadome');
        }
      }

      this.needsCookie = true;
      this.retries = 0;
      return States.SWAP;
    }

    let cid = '';
    const cookies = await taskSession.cookies.get({});
    const cookie = cookies.find(cookie => cookie.name === 'datadome');
    if (cookie) {
      cid = cookie.value;
    }

    const data = {
      ...ddd,
      cid,
      ccid: null,
      'x-forwarded-for': proxy ? proxy.ip : undefined,
      parent_url: `${storeUrl}/`,
      referer: ddd?.referer || '/'
    };

    this.data = data;

    this.purgeCookie = false;

    await this.injectRequester({ ...data });

    return States.CAPTCHA;
  }

  async waitForCookie() {
    const {
      aborted,
      task: {
        store: { url }
      },
      taskSession
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    if (this.swapped) {
      this.swapped = false;

      return States.CAPTCHA;
    }

    // if we are waiting longer than a minute for a cookie, go back to atc
    if (this.waitForCookieTimeout > 120) {
      this.waitForCookieTimeout = 0;

      return States.ADD_TO_CART;
    }

    if (!this.captchaCookie) {
      this.delayer = waitForDelay(500, this.aborter.signal);
      await this.delayer;

      this.waitForCookieTimeout += 1;

      return States.WAIT_FOR_COOKIE;
    }

    await taskSession.cookies.remove(url, 'datadome');
    await taskSession.cookies.set({
      url,
      domain: '.pokemoncenter.com',
      name: 'datadome',
      value: this.captchaCookie
    });

    this.captchaCookie = '';
    this.waitForCookieTimeout = 0;

    if (this.proceedTo) {
      const next = this.proceedTo;
      this.proceedTo = null;
      return next;
    }

    return States.GET_SESSION;
  }

  async waitForCaptcha() {
    const { aborted } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    if (!this.context.captchaToken) {
      this.delayer = waitForDelay(500, this.aborter.signal);
      await this.delayer;

      return States.CAPTCHA;
    }

    return States.SUBMIT_CAPTCHA;
  }

  async submitCaptcha() {
    const {
      id,
      logger,
      task: {
        retry,
        store: { url }
      },
      captchaToken
    } = this.context;

    const { nextState, data } = await submitCaptcha({
      handler: this.handler,
      url,
      data: this.data,
      userAgent: userAgents[this.active],
      captchaToken
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.SUBMIT_CAPTCHA} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.SUBMIT_CAPTCHA} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      this.attempts += 1;

      if (this.attempts > 5) {
        this.attempts = 0;

        return States.WAIT_FOR_COOKIE;
      }

      emitEvent(this.context, [id], {
        message: `Error submitting captcha [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_CAPTCHA;
    }

    await this.extractDatadome(body);

    if (this.proceedTo) {
      const next = this.proceedTo;
      this.proceedTo = null;
      return next;
    }
  }

  async extractDatadome({ cookie }: DatadomeCookie) {
    const {
      task: {
        store: { url }
      },
      taskSession
    } = this.context;

    const [, raw] = cookie.split('=');
    const [value] = raw.split(';');

    await taskSession.cookies.remove(url, 'datadome');
    await taskSession.cookies.set({
      url,
      domain: '.pokemoncenter.com',
      name: 'datadome',
      value
    });
  }

  async extractAuthToken(headers: any) {
    const {
      id,
      task: { retry }
    } = this.context;

    const cookies = headers['set-cookie'];
    if (!cookies) {
      emitEvent(this.context, [id], {
        message: 'Invalid auth token, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SESSION;
    }

    for (const cookie of cookies) {
      const match = /{"access_token":"(.*?)",/i.exec(cookie);
      if (match) {
        const [, authToken] = match;
        this.authToken = authToken;
        break;
      }
    }

    if (!this.authToken) {
      emitEvent(this.context, [id], {
        message: 'Invalid auth token, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SESSION;
    }

    if (!this.preloaded) {
      return States.GET_PRODUCTS;
    }

    return States.GET_PRODUCT;
  }

  async extractProduct({
    _items,
    _definition,
    _availability,
    images
  }: Product) {
    const {
      id,
      logger,
      task: {
        retry,
        monitor,
        sizes,
        store: { url },
        product: { variant }
      }
    } = this.context;

    try {
      const [{ _element }] = _items;
      const [{ thumbnail }] = images;
      const [item] = _definition;

      if (!_element) {
        emitEvent(this.context, [id], {
          message: 'Out of stock'
        });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_PRODUCT;
      }

      if (!this.preloaded) {
        const [{ state }] = _availability;

        if (state !== 'AVAILABLE') {
          const nextInLine = this.products.pop();
          if (!nextInLine) {
            this.preloaded = true;
            return States.GET_PRODUCT;
          }

          this.preloadSku = nextInLine;
          return States.GET_PRODUCT;
        }
      }

      const chosen = pickVariant({
        variants: _element,
        sizes,
        logger,
        id
      });

      if (!chosen) {
        emitEvent(this.context, [id], {
          message: 'No variation matched, retrying...'
        });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.GET_PRODUCT;
      }

      const { id: _id, uri, price, size } = chosen;

      this.product.id = _id;
      this.atcUri = uri;
      this.product.price = price;
      this.product.size = size;
      this.product.name = item['display-name'] || 'Unknown';
      this.product.image = thumbnail;
      this.context.product.url = `${url}/product/${variant}`;

      emitEvent(this.context, [id], {
        productImage: `${thumbnail}`.startsWith('http')
          ? thumbnail
          : `${url}/${thumbnail}`,
        productImageHi: `${thumbnail}`.startsWith('http')
          ? thumbnail
          : `${url}/${thumbnail}`,
        productName: this.product.name,
        chosenSize: size
      });
    } catch (e) {
      emitEvent(this.context, [id], {
        message: 'Error extracting product, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_PRODUCT;
    }

    return States.ADD_TO_CART;
  }

  async extractProducts({ response }: Products) {
    if (!response) {
      this.preloaded = true;
      return States.GET_PRODUCT;
    }

    const { docs } = response;

    this.products = docs.map(({ pid }) => pid);

    if (!docs) {
      this.preloaded = true;
      return States.GET_PRODUCT;
    }

    const [{ pid }] = docs;

    if (!pid) {
      this.preloaded = true;
      return States.GET_PRODUCT;
    }

    this.preloadSku = pid;
    return States.GET_PRODUCT;
  }

  async extractCartResponse({ messages, self }: Cart) {
    const {
      id,
      task: { mode, retry }
    } = this.context;

    if (messages.length !== 0) {
      emitEvent(this.context, [id], {
        message: 'Error adding to cart, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.ADD_TO_CART;
    }

    if (self?.uri) {
      this.cartUri = self.uri;
    }

    if (mode === Modes.PRELOAD && this.preloaded) {
      return States.CREATE_ENCRYPT;
    }

    this.added = true;

    return States.SUBMIT_INFORMATION;
  }

  async extractInformationResponse({ billing, shipping }: Information) {
    const {
      id,
      task: { retry }
    } = this.context;

    if (billing.messages.length !== 0 || shipping.messages.length !== 0) {
      emitEvent(this.context, [id], {
        message: 'Error submitting information, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_INFORMATION;
    }

    this.submitted = true;

    return States.GET_KEY_ID;
  }

  async extractKeyId({ keyId }: Key) {
    const {
      id,
      task: { mode, retry }
    } = this.context;

    if (!keyId) {
      emitEvent(this.context, [id], {
        message: 'Invalid jwt key, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_KEY_ID;
    }

    this.keyId = keyId;

    if (mode === Modes.PRELOAD && !this.preloaded) {
      return States.CLEAR_CART;
    }

    return States.CREATE_ENCRYPT;
  }

  async extractPaymentKey(body: string) {
    const {
      id,
      task: { retry }
    } = this.context;

    if (!body) {
      emitEvent(this.context, [id], {
        message: 'Invalid payment key, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_KEY_ID;
    }

    this.paymentKey = body;

    const { jti }: JsonWebTokenInfo = decode(body);
    this.paymentToken = jti;

    return States.SUBMIT_PAYMENT;
  }

  async extractPurchaseForm({ self }: Payment) {
    const {
      id,
      task: { retry }
    } = this.context;

    const { uri } = self;
    if (!uri) {
      emitEvent(this.context, [id], {
        message: 'Invalid payment form, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_PAYMENT;
    }

    this.purchaseUri = `${uri.replace('paymentmethods', 'purchases')}/form`;

    return States.SUBMIT_CHECKOUT;
  }

  async sendWebhook(success: boolean, body = {} as Success) {
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
      product: { url: productUrl },
      taskSession,
      checkoutManager,
      webhookManager,
      notificationManager,
      analyticsManager
    } = this.context;

    const { image, name: productName, size, price } = this.product;

    const usedProxy = proxy ? proxy.proxy : 'None';

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

    if (!success) {
      analyticsManager.log({
        success: false,
        store: name,
        date: new Date().toUTCString(),
        order: 'N/A',
        product: toTitleCase(productName),
        price: `${price}`,
        card: profile.payment.card,
        email: profile.shipping.email,
        name: profile.shipping.name,
        proxy: usedProxy || 'None',
        size: size ? `${size}` : 'N/A'
      });

      if (!this.webhookSent) {
        this.webhookSent = true;

        webhookManager.log({
          mode: mode || Modes.NORMAL,
          proxy: proxy ? proxy.proxy : undefined,
          product: {
            name: toTitleCase(productName),
            price: `${this.product.price}`,
            image: `${image}`.startsWith('http') ? image : `${url}/${image}`,
            size: size ? `${size}` : 'N/A',
            url: productUrl
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

      emitEvent(this.context, [id], { message: 'Payment failed, retrying...' });

      this.context.setCaptchaToken('');
      await taskSession.clearStorageData({});

      this.delayer = waitForDelay(monitor, this.aborter.signal);
      await this.delayer;

      return States.CREATE_ENCRYPT;
    }

    const order = body['purchase-number'];

    if (body?.['monetary-total']) {
      this.product.price = body?.['monetary-total'][0].display;
    }

    analyticsManager.log({
      success: true,
      store: name,
      date: new Date().toUTCString(),
      order: order || 'Unknown',
      product: toTitleCase(productName),
      price: `${this.product.price}`,
      card: profile.payment.card,
      email: profile.shipping.email,
      name: profile.shipping.name,
      proxy: usedProxy || 'None',
      size: size ? `${size}` : 'N/A'
    });

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
      mode: mode || Modes.NORMAL,
      proxy: proxy ? proxy.proxy : undefined,
      product: {
        name: toTitleCase(productName),
        price: `${this.product.price}`,
        image: `${image}`.startsWith('http') ? image : `${url}/${image}`,
        size: size ? `${size}` : 'N/A',
        url: productUrl
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

    return States.DONE;
  }

  handler = async ({
    endpoint,
    options = {},
    message = '',
    from = this.prevState,
    timeout = 12500,
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
      proxy,
      task: {
        store: { url, name }
      },
      taskSession
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
          ...getHeaders(name),
          ...options.headers
        }
      : {
          ...options.headers
        };

    requestHeaders['user-agent'] = userAgents[this.active];

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
        level: 'silly',
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

      if (isTimeout(error)) {
        emitEvent(this.context, [id], {
          message: `Error ${message.toLowerCase()} [TIMEOUT]`
        });

        return { data: {}, nextState: from };
      }

      if (isNetworkError(error)) {
        emitEvent(this.context, [id], {
          message: `Error ${message.toLowerCase()} [NETWORK]`
        });

        return { data: {}, nextState: from };
      }

      emitEvent(this.context, [id], {
        message: `Error ${message.toLowerCase()} [UNKNOWN]`
      });

      return { data: {}, nextState: from };
    }
  };

  async getCookie() {
    const {
      id,
      logger,
      task: { retry }
    } = this.context;

    const { nextState, data } = await getCookie({
      handler: this.handler,
      userAgent: userAgents[this.active],
      ddv: this.ddv,
      cid: 'null',
      jsType: 'ch',
      responsePage: this.responsePage
    });

    const { statusCode, body, headers } = data;

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_COOKIE} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_COOKIE} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error retrieving cookie [${statusCode}]`
      });

      if (statusCode === 403) {
        this.proceedTo = States.GET_COOKIE;

        return this.handleDatadome(body, headers);
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_COOKIE;
    }

    this.retries = 0;

    await this.extractDatadome(body);
    this.needsCookie = false;

    if (this.proceedTo) {
      const next = this.proceedTo;
      this.proceedTo = null;
      return next;
    }

    return States.GET_SESSION;
  }

  async getSession() {
    const {
      id,
      logger,
      task: { retry }
    } = this.context;

    if (this.needsCookie) {
      this.proceedTo = States.GET_SESSION;
      return States.GET_COOKIE;
    }

    const { nextState, data } = await getSession({ handler: this.handler });

    const { statusCode, body, headers } = data;

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_SESSION} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_SESSION} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting homepage [${statusCode}]`
      });

      if (statusCode === 403) {
        this.proceedTo = States.GET_SESSION;

        if (this.responsePage === 'origin') {
          this.responsePage = 'blocked-page';

          await this.removeDatadome(headers);

          return States.GET_COOKIE;
        }

        return this.handleDatadome(body, headers);
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SESSION;
    }

    this.retries = 0;

    return this.extractAuthToken(headers);
  }

  async getProducts() {
    const {
      id,
      logger,
      task: { retry }
    } = this.context;

    if (this.needsCookie) {
      this.proceedTo = States.GET_PRODUCTS;
      return States.GET_COOKIE;
    }

    const { nextState, data } = await getProducts({
      handler: this.handler
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_PRODUCTS} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body, headers } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_PRODUCTS} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting products [${statusCode}]`
      });

      if (statusCode === 403) {
        this.proceedTo = States.GET_PRODUCTS;

        if (this.responsePage === 'origin') {
          this.responsePage = 'blocked-page';

          await this.removeDatadome(headers);

          return States.GET_COOKIE;
        }

        return this.handleDatadome(body, headers);
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_PRODUCTS;
    }

    this.retries = 0;

    return this.extractProducts(body);
  }

  async getProduct() {
    const {
      id,
      logger,
      task: {
        retry,
        store: { url },
        product: { variant }
      }
    } = this.context;

    if (this.needsCookie) {
      this.proceedTo = States.GET_PRODUCT;
      return States.GET_COOKIE;
    }

    const { nextState, data } = await getProduct({
      handler: this.handler,
      url,
      sku: !this.preloaded ? this.preloadSku : variant
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_PRODUCT} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body, headers } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_PRODUCT} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting product [${statusCode}]`
      });

      if (statusCode === 403) {
        this.proceedTo = States.GET_PRODUCT;

        if (this.responsePage === 'origin') {
          this.responsePage = 'blocked-page';

          await this.removeDatadome(headers);

          return States.GET_COOKIE;
        }

        return this.handleDatadome(body, headers);
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_PRODUCT;
    }

    this.retries = 0;

    return this.extractProduct(body);
  }

  async addToCart() {
    const {
      id,
      logger,
      task: { retry, monitor, quantity }
    } = this.context;

    if (this.needsCookie) {
      this.proceedTo = States.ADD_TO_CART;
      return States.GET_COOKIE;
    }

    const { nextState, data } = await addToCart({
      handler: this.handler,
      quantity,
      atcUri: this.atcUri
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.ADD_TO_CART} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body, headers } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.ADD_TO_CART} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 400) {
        emitEvent(this.context, [id], {
          message: 'Out of stock'
        });

        this.delayer = waitForDelay(monitor, this.aborter.signal);
        await this.delayer;

        return States.ADD_TO_CART;
      }

      if (statusCode === 403) {
        this.proceedTo = States.ADD_TO_CART;

        if (this.responsePage === 'origin') {
          this.responsePage = 'blocked-page';

          await this.removeDatadome(headers);

          return States.GET_COOKIE;
        }

        return this.handleDatadome(body, headers);
      }

      emitEvent(this.context, [id], {
        message: `Error adding to cart [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.ADD_TO_CART;
    }

    this.retries = 0;

    return this.extractCartResponse(body);
  }

  async submitInformation() {
    const {
      id,
      logger,
      task: {
        retry,
        store: { url }
      }
    } = this.context;

    if (this.needsCookie) {
      this.proceedTo = States.SUBMIT_INFORMATION;
      return States.GET_COOKIE;
    }

    const profile = this.retrieveProfile();
    if (!profile) {
      emitEvent(this.context, [id], {
        message: `Profile not found`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_INFORMATION;
    }

    const { matches, shipping, billing } = profile;

    if (!this.email) {
      await submitEmail({
        handler: this.handler,
        storeUrl: url,
        json: email(billing)
      });
    }

    this.email = true;

    const { nextState, data } = await submitInformation({
      handler: this.handler,
      storeUrl: url,
      json: information(matches, shipping, billing)
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.SUBMIT_INFORMATION} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body, headers } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.SUBMIT_INFORMATION} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting information [${statusCode}]`
      });

      if (statusCode === 403) {
        this.proceedTo = States.SUBMIT_INFORMATION;

        if (this.responsePage === 'origin') {
          this.responsePage = 'blocked-page';

          await this.removeDatadome(headers);

          return States.GET_COOKIE;
        }

        return this.handleDatadome(body, headers);
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_INFORMATION;
    }

    this.retries = 0;

    return this.extractInformationResponse(body);
  }

  async clearCart() {
    const {
      id,
      logger,
      task: { retry }
    } = this.context;

    if (this.needsCookie) {
      this.proceedTo = States.CLEAR_CART;
      return States.GET_COOKIE;
    }

    const { nextState, data } = await clearCart({
      handler: this.handler,
      cartUri: this.cartUri
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.CLEAR_CART} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body, headers } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.CLEAR_CART} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 403) {
        this.proceedTo = States.CLEAR_CART;

        if (this.responsePage === 'origin') {
          this.responsePage = 'blocked-page';

          await this.removeDatadome(headers);

          return States.GET_COOKIE;
        }

        return this.handleDatadome(body, headers);
      }

      emitEvent(this.context, [id], {
        message: `Error clearing cart [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.CLEAR_CART;
    }

    if (statusCode === 204) {
      this.retries = 0;
      this.preloaded = true;
      return States.GET_PRODUCT;
    }

    emitEvent(this.context, [id], {
      message: `Error clearing cart [${statusCode}]`
    });

    this.delayer = waitForDelay(retry, this.aborter.signal);
    await this.delayer;

    return States.CLEAR_CART;
  }

  async getKeyId() {
    const {
      id,
      logger,
      task: {
        retry,
        store: { name, url }
      }
    } = this.context;

    if (this.needsCookie) {
      this.proceedTo = States.GET_KEY_ID;
      return States.GET_COOKIE;
    }

    const { nextState, data } = await getKeyId({
      handler: this.handler,
      storeName: name,
      storeUrl: url
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_KEY_ID} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body, headers } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_KEY_ID} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error generating token [${statusCode}]`
      });

      if (statusCode === 403) {
        this.proceedTo = States.GET_KEY_ID;

        if (this.responsePage === 'origin') {
          this.responsePage = 'blocked-page';

          await this.removeDatadome(headers);

          return States.GET_COOKIE;
        }

        return this.handleDatadome(body, headers);
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_KEY_ID;
    }

    this.retries = 0;

    return this.extractKeyId(body);
  }

  async createEncryption() {
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

      return States.CREATE_ENCRYPT;
    }

    const { payment } = profile;

    const { nextState, data } = await createEncryption({
      handler: this.handler,
      keyId: this.keyId,
      microform: this.microform,
      payment
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.CREATE_ENCRYPT} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.CREATE_ENCRYPT} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 429) {
        return this.sendWebhook(false);
      }

      emitEvent(this.context, [id], {
        message: `Error encrypting session [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.CREATE_ENCRYPT;
    }

    this.retries = 0;

    return this.extractPaymentKey(body);
  }

  async submitPayment() {
    const {
      id,
      logger,
      task: {
        retry,
        store: { url }
      }
    } = this.context;

    if (this.needsCookie) {
      this.proceedTo = States.SUBMIT_PAYMENT;
      return States.GET_COOKIE;
    }

    const profile = this.retrieveProfile();
    if (!profile) {
      emitEvent(this.context, [id], {
        message: `Profile not found`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_PAYMENT;
    }

    const { payment } = profile;
    const { exp, type } = payment;

    const [month, year] = exp.split('/');

    const { nextState, data } = await submitPayment({
      handler: this.handler,
      storeUrl: url,
      json: {
        paymentDisplay: `${getCardType(type)} ${month}/20${year}`,
        paymentKey: this.keyId,
        paymentToken: this.paymentToken
      }
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.SUBMIT_PAYMENT} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body, headers } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.SUBMIT_PAYMENT} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting payment [${statusCode}]`
      });

      if (statusCode === 403) {
        this.proceedTo = States.SUBMIT_PAYMENT;

        if (this.responsePage === 'origin') {
          this.responsePage = 'blocked-page';

          await this.removeDatadome(headers);

          return States.GET_COOKIE;
        }

        return this.handleDatadome(body, headers);
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_PAYMENT;
    }

    this.retries = 0;

    return this.extractPurchaseForm(body);
  }

  async submitCheckout() {
    const {
      id,
      logger,
      task: {
        retry,
        store: { url }
      }
    } = this.context;

    if (this.needsCookie) {
      this.proceedTo = States.SUBMIT_CHECKOUT;
      return States.GET_COOKIE;
    }

    const { nextState, data } = await submitCheckout({
      handler: this.handler,
      storeUrl: url,
      purchaseUri: this.purchaseUri
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.SUBMIT_CHECKOUT} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body, headers } = data;
    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 403) {
        this.proceedTo = States.SUBMIT_CHECKOUT;

        if (this.responsePage === 'origin') {
          this.responsePage = 'blocked-page';

          await this.removeDatadome(headers);

          return States.GET_COOKIE;
        }

        return this.handleDatadome(body, headers);
      }

      return this.sendWebhook(false);
    }

    return this.sendWebhook(true, body);
  }

  async handleStepLogic(currentState: string) {
    const { id, logger } = this.context;

    if (this.anticrack && currentState === States.SUBMIT_CHECKOUT) {
      // eslint-disable-next-line no-param-reassign
      currentState = States.NOOP;
    }

    const stepMap = {
      [States.GET_COOKIE]: this.getCookie,
      [States.WAIT_FOR_COOKIE]: this.waitForCookie,
      [States.CAPTCHA]: this.waitForCaptcha,
      [States.SUBMIT_CAPTCHA]: this.submitCaptcha,
      [States.GET_SESSION]: this.getSession,
      [States.GET_PRODUCT]: this.getProduct,
      [States.GET_PRODUCTS]: this.getProducts,
      [States.ADD_TO_CART]: this.addToCart,
      [States.SUBMIT_INFORMATION]: this.submitInformation,
      [States.CLEAR_CART]: this.clearCart,
      [States.GET_KEY_ID]: this.getKeyId,
      [States.CREATE_ENCRYPT]: this.createEncryption,
      [States.SUBMIT_PAYMENT]: this.submitPayment,
      [States.SUBMIT_CHECKOUT]: this.submitCheckout,
      [States.WAIT_FOR_COOKIE]: this.waitForCookie,
      [States.NOOP]: this.noop,
      [States.SWAP]: this.swap,
      [States.DONE]: () => States.DONE,
      [States.ERROR]: () => States.DONE,
      [States.ABORT]: () => States.DONE
    };

    // filter out captcha state...
    if (
      currentState !== States.CAPTCHA &&
      currentState !== States.WAIT_FOR_COOKIE
    ) {
      logger.log({
        id,
        level: 'silly',
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
