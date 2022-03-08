/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import { isEmpty } from 'lodash';
import qs from 'query-string';
import crypto from 'crypto';

import {
  emitEvent,
  waitForDelay,
  isNetworkError,
  isImproperStatusCode,
  toTitleCase,
  isTimeout,
  request,
  random,
  userAgents
} from '../../../common/utils';
import { BaseTask } from '../../../common/classes';
import { Platforms, SiteKeyForPlatform } from '../../../common/constants';
import { FootsiteContext } from '../../../common/contexts';

import {
  DatadomeData,
  DatadomeCookie,
  GetSessionResponse,
  GetStockResponse,
  AddToCartResponse,
  AllowedSkus
} from '../types';
import {
  getSession,
  getStock,
  getOldStock,
  addToCart,
  submitCaptcha,
  verifyEmail,
  submitShipping,
  submitBilling,
  submitInformation,
  submitCheckout
} from '../functions';
import { cleanseHeaderData } from '../../utils';
import { Task } from '../../constants';
import { pickVariant } from '../../utils/pickVariant';

import {
  customerInfo,
  shippingInfo,
  billingInfo,
  customerInfoEU,
  shippingInfoEU,
  billingInfoEU
} from '../../utils/forms';

import { ProductStock } from '../types/stock';
import { Variant } from '../types/variant';

import { getPlatform } from '../../../../utils/getPlatform';
import { FootsiteProduct } from '../../../common/contexts/footsite';
import CAPTCHA_TYPES from '../../../../utils/captchaTypes';
import {
  getQueue,
  submitEmptyPow,
  submitEnqueue,
  submitPow,
  submitSpaQueue
} from '../functions/queue';
import { submitCaptchaChallenge } from '../functions/captcha';

const { States, Modes } = Task;

export class BaseFootsiteTask extends BaseTask {
  context: FootsiteContext;

  currency: string;

  formatter: string;

  product: FootsiteProduct;

  polling: boolean;

  waitingForRestock: boolean;

  proceedTo: string | null;

  cartId: string;

  cartToken: string;

  csrfToken: string;

  userAgent: string;

  bypassWaitForLaunch: boolean;

  encryptionKey: string;

  launchTime: number;

  blocks: number;

  cid: string;

  attempts: number;

  captchaCookie: string;

  data: DatadomeData;

  swapped: boolean;

  waitForCookieTimeout: number;

  sessionId: string;

  purgeCookie: boolean;

  productId: string;

  allowedSkus: AllowedSkus;

  apiGatewayVersion: string;

  apiKey: string;

  location: string;

  stockCollection: any;

  captchaChallenge: any;

  captchaChallengeSolved: any;

  solveCaptchaChallenge: any;

  powSolved: any;

  pow: any;

  gennedPow: any;

  queueInfo: any;

  powSessionInfo: any;

  captchaSessionInfo: any;

  useZgw: any;

  captchaType: string;

  constructor(context: FootsiteContext, platform = Platforms.Footsites) {
    super(context, States.GET_SESSION, platform);

    if (/www\.footlocker\.ca/i.test(context.task.store.url)) {
      this.currency = 'CAD';
      this.formatter = 'en-CA';
    } else if (/footlocker\.co\.uk/i.test(context.task.store.url)) {
      this.currency = 'GBP';
      this.formatter = 'en-GB';
    } else {
      this.currency = 'USD';
      this.formatter = 'en-US';
    }

    this.context = context;

    this.polling = false;
    this.waitingForRestock = false;
    this.proceedTo = null;
    this.cartId = '';
    this.cartToken = '';
    this.csrfToken = '';

    this.allowedSkus = {} as AllowedSkus;

    this.bypassWaitForLaunch = false;
    this.apiGatewayVersion = '';
    this.apiKey = '';
    this.location = '';

    this.encryptionKey = /footlocker\.co\.uk/i.test(this.context.task.store.url)
      ? '10001|B6D07BD544BD5759FA13F1972F229EDFD76D2E39EC209797FC6A6A6B9F3388DD70255D83369FC6A10A9E3DDC90968345D62D73793B480C59458BA5C7E0EFBADC81DAE4060079064C556B4324C9EEA8D26EBB9011BBD8F769A6E463F2D078621ABC1432393FAECE489A68D85A0176A58E7292CB36E124305EB098DFB89C24AD58A27F7A21329DA2FE401199D5952C630340535785323E56F2B72AB8F18EA05DBA7A811C7A83B4B661358B6CCC338498F6BA10C9A16408FD33A231CC00EEE5A9397D92ECF3D616D44A687062833B5BF91EED57E3129B98B559192D65B787AE5A230A86D4ACF23C485318095DC4C589D1E990809BB2B74F0EDD3225FD3A64D89DD1'
      : '10001|A237060180D24CDEF3E4E27D828BDB6A13E12C6959820770D7F2C1671DD0AEF4729670C20C6C5967C664D18955058B69549FBE8BF3609EF64832D7C033008A818700A9B0458641C5824F5FCBB9FF83D5A83EBDF079E73B81ACA9CA52FDBCAD7CD9D6A337A4511759FA21E34CD166B9BABD512DB7B2293C0FE48B97CAB3DE8F6F1A8E49C08D23A98E986B8A995A8F382220F06338622631435736FA064AEAC5BD223BAF42AF2B66F1FEA34EF3C297F09C10B364B994EA287A5602ACF153D0B4B09A604B987397684D19DBC5E6FE7E4FFE72390D28D6E21CA3391FA3CAADAD80A729FEF4823F6BE9711D4D51BF4DFCB6A3607686B34ACCE18329D415350FD0654D';

    this.cid = '';
    this.captchaCookie = '';
    this.blocks = 0;
    this.launchTime = 0;
    this.waitForCookieTimeout = 0;
    this.swapped = false;

    this.product = {} as FootsiteProduct;
    this.data = {} as DatadomeData;
    this.attempts = 0;

    this.productId = '';

    this.captchaType = CAPTCHA_TYPES.RECAPTCHA_V2;

    this.useZgw = {
      'https://www.footlocker.ca': false,
      'https://www.footlocker.com': true,
      'https://www.champssports.com': true,
      'https://www.footaction.com': true,
      'https://www.eastbay.com': true
    };

    const os = getPlatform();
    this.userAgent = random(userAgents[os]);

    this.stockCollection = false;

    // add this task to the list of requesters to incoming data
    const { id, footsManager } = this.context;
    footsManager.insert({
      id,
      inject: this.inject
    });

    this.sessionId = '';
    this.purgeCookie = false;
  }

  inject = async (data: any) => {
    if (!isEmpty(data)) {
      Object.entries(data).map(([key, value]: [string, any]) => {
        if (key === 'sitekey') {
          this.context.task.store.sitekey = value;
        }

        if (key === 'delays' && data[key].enabled) {
          this.context.task.retry = data[key].retry;
          this.context.task.monitor = data[key].monitor;
        }

        if (key !== '_id') {
          (this as any)[key] = value;
        }

        return null;
      });
    }
  };

  release = async (cookie?: string) => {
    const {
      id,
      logger,
      solverManager,
      task: {
        store: { url }
      }
    } = this.context;

    logger.log({
      id,
      level: 'info',
      message: `Received datadome cookie: ${cookie}`
    });

    // exit clause with swap
    if (!cookie) {
      const { data } = solverManager.get(url, id);

      await this.injectRequester(data);

      this.swapped = true;

      return;
    }

    this.captchaCookie = cookie;
  };

  async injectRequester(
    data: DatadomeData,
    altSitekey?: string,
    altChallengeType?: string
  ) {
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
      type: altChallengeType || this.captchaType || CAPTCHA_TYPES.RECAPTCHA_V2I,
      harvest: this.harvest as any,
      host: data.host,
      platform: Platforms.Footsites,
      userAgent: this.userAgent,
      sitekey: altSitekey || sitekey || SiteKeyForPlatform[Platforms.Footsites],
      proxy: proxy ? proxy.ip : undefined
    });
  }

  resetAllData = () => {
    this.cartId = '';
    this.cartToken = '';
    this.csrfToken = '';
  };

  async extractCsrfToken(body: GetSessionResponse) {
    const {
      id,
      task: { retry }
    } = this.context;

    const { data, success } = body;
    if (!success) {
      emitEvent(this.context, [id], {
        message: 'Invalid session, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SESSION;
    }

    const { csrfToken } = data;
    if (!csrfToken) {
      emitEvent(this.context, [id], {
        message: 'Invalid session, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SESSION;
    }

    this.csrfToken = csrfToken;
    return States.GET_STOCK;
  }

  async extractCartData({ code, guid, totalPrice }: AddToCartResponse) {
    const {
      id,
      task: { retry }
    } = this.context;

    if (!code || !guid) {
      emitEvent(this.context, [id], {
        message: 'Invalid cart, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.ADD_TO_CART;
    }

    this.cartToken = code;
    this.cartId = guid;
    this.context.product.price = totalPrice as any;

    return States.SUBMIT_INFORMATION;
  }

  async setDefaultCookies() {
    const {
      task: {
        store: { url }
      }
    } = this.context;

    const sets = [
      { name: 's_vs', value: '1' },
      { name: 's_lv_s', value: 'First%20Visit' },
      { name: 's_vnum', value: encodeURIComponent(`${Date.now()}&vn=1`) },
      { name: 's_invisit', value: 'true' },
      { name: 's_pr_tbe65', value: `${Date.now()}` },
      { name: 'at_check', value: 'true' },
      {
        name: 'DCT_Exp_HUNDRED',
        value: 'DCT'
      },
      {
        name: 'se',
        value: 'spell_on'
      },
      {
        name: 'rmStore',
        value: 'amid:false|dmid:false|dcomm:0'
      },
      {
        name: 'bluecoreNV',
        value: 'false'
      },
      {
        name: 'ccpa_consent',
        value: 'disabled'
      },
      {
        name: 'userStatus',
        value: 'guest'
      },
      {
        name: 'userVIP',
        value: 'unknown'
      }
    ];

    return Promise.all(
      sets.map(({ name, value }) => {
        return this.context.taskSession.cookies.set({ name, value, url });
      })
    );
  }

  generateQueueItPow = ({ input, zeroCount }: any) => {
    for (let postfix = 0; ; postfix += 1) {
      const hash = crypto
        .createHash('sha256')
        .update(input + postfix)
        .digest('hex');
      if (hash.startsWith('0'.repeat(zeroCount))) return { postfix, hash };
    }
  };

  async handleQueue(from: string) {
    const { id } = this.context;

    emitEvent(this.context, [id], { message: `Waiting in queue` });

    this.delayer = waitForDelay(7500, this.aborter.signal);
    await this.delayer;

    this.polling = true;

    return from;
  }

  async sendWebhook(success: boolean, body?: any) {
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
      product: { image, url: productUrl, name: productName },
      restartManager,
      checkoutManager,
      webhookManager,
      notificationManager,
      footsManager,
      solverManager,
      analyticsManager
    } = this.context;

    const { size } = this.product;

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

    if (body?.totalPrice?.formattedValue) {
      this.context.product.price = body?.totalPrice?.formattedValue;
    } else if (this.context.product.price.formattedListPrice) {
      this.context.product.price = this.context.product.price
        .formattedListPrice as any;
    } else {
      this.context.product.price = this.context.product.price
        ?.formattedValue as any; // @ts-ignore
    }

    if (!success) {
      emitEvent(this.context, [id], { message: 'Card declined' });

      analyticsManager.log({
        success: false,
        store: name,
        date: new Date().toUTCString(),
        order: 'N/A',
        product: toTitleCase(productName),
        price: `${this.context.product.price}`,
        card: profile.payment.card,
        email: profile.shipping.email,
        name: profile.shipping.name,
        proxy: usedProxy || 'None',
        size
      });

      if (!this.webhookSent) {
        this.webhookSent = true;

        webhookManager.log({
          mode: mode || Modes.RELEASE,
          proxy: proxy ? proxy.proxy : undefined,
          product: {
            name: toTitleCase(productName),
            price: `${this.context.product.price}`,
            image: `${image}`.startsWith('http') ? image : `https:${image}`,
            size,
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

      const shouldRestart = restartManager.restart();
      if (!shouldRestart) {
        footsManager.remove({ id });
        solverManager.remove({ id, url });

        return States.DONE;
      }

      this.resetAllData();
      this.context.setCaptchaToken('');
      await this.context.cookieJar.removeAllCookies();

      this.delayer = waitForDelay(1000, this.aborter.signal);
      await this.delayer;

      return States.GET_SESSION;
    }

    footsManager.remove({ id });
    solverManager.remove({ id, url });

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

    analyticsManager.log({
      success: true,
      store: name,
      date: new Date().toUTCString(),
      order: body?.order?.code || 'Unknown',
      product: toTitleCase(productName),
      price: `${this.context.product.price}`,
      card: profile.payment.card,
      email: profile.shipping.email,
      name: profile.shipping.name,
      proxy: usedProxy || 'None',
      size
    });

    webhookManager.log({
      success: true,
      mode: mode || Modes.RELEASE,
      proxy: proxy ? proxy.proxy : undefined,
      product: {
        name: toTitleCase(productName),
        price: `${this.context.product.price}`,
        image: `${image}`.startsWith('http') ? image : `https:${image}`,
        size,
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
    timeout = 7500
  }: {
    endpoint: string;
    options?: any;
    message?: string;
    from?: string;
    timeout?: number;
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
      followAllRedirects: true,
      followRedirect: true,
      timeout
    };

    const requestHeaders = {
      ...options.headers,
      'user-agent': this.userAgent
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
        return { data: {}, nextState: from };
      }

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

  async getSession() {
    const {
      id,
      logger,
      task: {
        retry,
        store: { url }
      }
    } = this.context;

    const message = this.polling ? 'Waiting in queue' : 'Creating session';
    const { nextState, data } = await getSession({
      handler: this.handler,
      storeUrl: url,
      message
    });

    const { statusCode, body } = data;

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

    this.polling = false;

    logger.log({
      id,
      level: 'info',
      message: `${States.GET_SESSION} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 503 && /503 Backend.max_conn reached/i.test(body)) {
        emitEvent(this.context, [id], {
          message: `Error creating session [MAX_CONN]`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_SESSION;
      }

      if (statusCode === 529) {
        return this.handleQueue(States.GET_SESSION);
      }

      if (statusCode === 403) {
        this.proceedTo = States.GET_SESSION;

        return this.handleDatadome(body);
      }

      emitEvent(this.context, [id], {
        message: `Error creating session [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SESSION;
    }

    return this.extractCsrfToken(body);
  }

  async getOldStock() {
    const {
      id,
      logger,
      task: {
        retry,
        monitor,
        sizes,
        useMocks,
        store: { url },
        product: { variant }
      },
      footsManager
    } = this.context;

    const message = this.polling
      ? 'Waiting in queue'
      : this.waitingForRestock
      ? 'Waiting for restock'
      : 'Retrieving stock';

    logger.log({
      id,
      level: 'info',
      message: `${States.GET_STOCK} url in use: ${url}`
    });

    let productInformation;
    try {
      productInformation = footsManager.getVariant(variant);
    } catch (err) {
      productInformation = null;
    }

    let response = {
      nextState: null,
      data: { statusCode: 200, body: productInformation, failureReason: null }
    };

    if (!productInformation || !this.stockCollection) {
      response = await getOldStock({
        handler: this.handler,
        message,
        productId: variant,
        storeUrl: url
      });
    }

    const { nextState, data } = response;

    const { statusCode } = data;

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_STOCK} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    this.waitingForRestock = false;
    this.polling = false;

    const { body } = data;

    logger.log({
      id,
      level: 'info',
      message: `${States.GET_STOCK} statusCode: ${statusCode}`
    });

    if (!useMocks) {
      if (isImproperStatusCode(statusCode)) {
        if (statusCode === 503 && /503 Backend.max_conn reached/i.test(body)) {
          emitEvent(this.context, [id], {
            message: `Error retrieving stock [MAX_CONN]`
          });

          this.delayer = waitForDelay(retry, this.aborter.signal);
          await this.delayer;

          return States.GET_STOCK;
        }

        if (statusCode === 529) {
          return this.handleQueue(States.GET_STOCK);
        }

        if (statusCode === 400) {
          emitEvent(this.context, [id], { message: 'Waiting for restock' });

          this.delayer = waitForDelay(monitor, this.aborter.signal);
          await this.delayer;

          this.waitingForRestock = true;

          return States.GET_STOCK;
        }

        if (statusCode === 403) {
          this.proceedTo = States.GET_STOCK;

          return this.handleDatadome(body);
        }

        emitEvent(this.context, [id], {
          message: `Error retrieving stock [${statusCode}]`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_STOCK;
      }
    }

    if (this.stockCollection && !productInformation) {
      footsManager.relayProductInformation(variant, body);
    }

    const { sellableUnits, name, variantAttributes } = body as GetStockResponse;

    this.context.product.name = name;
    this.context.product.url = `${url}/product/~/${variant}.html`;
    this.context.product.image = `https://images.footlocker.com/pi/${variant}/small/${variant}.jpeg`;

    let style = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const { code, sku, skuLaunchDate } of variantAttributes) {
      if (sku === variant) {
        style = code;
        if (skuLaunchDate) {
          this.launchTime = new Date(skuLaunchDate).getTime();
        }
        break;
      }
    }

    if (!style) {
      emitEvent(this.context, [id], {
        message: 'No style matched, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_STOCK;
    }

    const variants = sellableUnits.filter(({ attributes }) => {
      const _style = attributes.find(({ type }) => /style/i.test(type));
      if (style === _style?.id) {
        return true;
      }

      return false;
    });

    this.context.product.variants = variants.map(
      ({ code, attributes, price, stockLevelStatus }) => ({
        id: Number(code),
        sku: variant,
        size: attributes.find(s => s.type === 'size')?.value || 'N/A',
        price: {
          currencyIso: price.currencyIso,
          listPrice: price.originalPrice,
          salePrice: price.originalPrice,
          formattedValue: price.formattedValue,
          formattedListPrice: price.formattedValue,
          formattedSalePrice: price.formattedValue,
          priceRange: price.formattedValue,
          topSalesAmount: 0,
          taxClassificationCode: ''
        },
        available: stockLevelStatus !== 'outOfStock' || false
      })
    );

    const chosen = pickVariant({
      variants: this.context.product.variants,
      sizes
    });

    if (!chosen) {
      emitEvent(this.context, [id], {
        message: 'No sizes matched, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_STOCK;
    }

    const { id: pId, price, size, sku } = chosen;
    this.product = {
      ...this.context.product,
      id: pId,
      size,
      sku,
      price
    };

    const { image, name: productName } = this.product;

    emitEvent(this.context, [id], {
      productName,
      productImage: image,
      productImageHi: image,
      chosenSize: size
    });

    return States.ADD_TO_CART;
  }

  async getStock() {
    const {
      id,
      logger,
      task: {
        retry,
        monitor,
        sizes,
        useMocks,
        store: { url },
        product: { variant }
      },
      footsManager
    } = this.context;

    if (!this.useZgw[url]) {
      return this.getOldStock();
    }

    let body: ProductStock;

    const message = this.polling
      ? 'Waiting in queue'
      : this.waitingForRestock
      ? 'Waiting for restock'
      : 'Retrieving stock';

    logger.log({
      id,
      level: 'info',
      message: `${States.GET_STOCK} url in use: ${url}`
    });

    let productInformation;
    try {
      productInformation = footsManager.getVariant(variant);
    } catch (err) {
      productInformation = null;
    }

    let response = {
      nextState: null,
      data: { statusCode: 200, body: productInformation, failureReason: null }
    };

    if (!productInformation || !this.stockCollection) {
      response = await getStock({
        handler: this.handler,
        message,
        productId: variant,
        storeUrl: url
      });
    }

    const { nextState, data } = response;

    const { statusCode } = data;

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_STOCK} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    this.waitingForRestock = false;
    this.polling = false;

    // eslint-disable-next-line prefer-const
    ({ body } = data);

    logger.log({
      id,
      level: 'info',
      message: `${States.GET_STOCK} statusCode: ${statusCode}`
    });

    if (!useMocks) {
      if (isImproperStatusCode(statusCode)) {
        if (
          statusCode === 503 &&
          /503 Backend.max_conn reached/i.test(body as any)
        ) {
          emitEvent(this.context, [id], {
            message: `Error retrieving stock [MAX_CONN]`
          });

          this.delayer = waitForDelay(retry, this.aborter.signal);
          await this.delayer;

          return States.GET_STOCK;
        }

        if (statusCode === 529) {
          return this.handleQueue(States.GET_STOCK);
        }

        if (statusCode === 400 || statusCode === 404) {
          emitEvent(this.context, [id], { message: 'Waiting for restock' });

          this.delayer = waitForDelay(monitor, this.aborter.signal);
          await this.delayer;

          this.waitingForRestock = true;

          return States.GET_STOCK;
        }

        if (statusCode === 403) {
          this.proceedTo = States.GET_STOCK;

          return this.handleDatadome(body);
        }

        emitEvent(this.context, [id], {
          message: `Error retrieving stock [${statusCode}]`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_STOCK;
      }
    }

    if (this.stockCollection && !productInformation) {
      footsManager.relayProductInformation(variant, body);
    }

    const {
      model: { name },
      styleVariants
    } = body;

    this.context.product.name = name;
    this.context.product.url = `${url}/product/~/${variant}.html`;
    this.context.product.image = `https://images.footlocker.com/pi/${variant}/small/${variant}.jpeg`;

    const variants: Variant[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const {
      productWebKey,
      sku,
      size,
      price,
      inventory
    } of styleVariants) {
      if (sku === variant) {
        variants.push({
          id: productWebKey,
          sku,
          size,
          price: {
            ...price,
            formattedValue: price.formattedListPrice
          },
          available: inventory.inventoryAvailable || false
        });
      }
    }

    if (!variants.length) {
      emitEvent(this.context, [id], {
        message: 'No sizes for style, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_STOCK;
    }

    this.context.product.variants = variants;

    const chosen = pickVariant({
      variants,
      sizes
    });

    if (!chosen) {
      emitEvent(this.context, [id], {
        message: 'No sizes matched, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_STOCK;
    }

    const { id: pId, price, size, sku } = chosen;
    this.product = {
      ...this.context.product,
      id: pId,
      size,
      sku,
      price
    };

    const { image, name: productName } = this.product;

    emitEvent(this.context, [id], {
      productName,
      productImage: image,
      productImageHi: image,
      chosenSize: size
    });

    return States.ADD_TO_CART;
  }

  async addToCart() {
    const {
      id,
      logger,
      footsManager,
      taskSession,
      task: {
        retry,
        monitor,
        useMocks,
        store: { url }
      }
    } = this.context;

    const { id: productId } = this.product;

    const message = this.polling ? 'Waiting in queue' : 'Adding to cart';
    const { nextState, data } = await addToCart({
      handler: this.handler,
      purge: false,
      message,
      storeUrl: url,
      csrfToken: this.csrfToken,
      productId,
      json: {
        productId: `${productId}`,
        productQuantity: 1
      }
    });

    const { statusCode, headers, body } = data;

    footsManager.logTaskData({
      time: Date.now(),
      messages: cleanseHeaderData(headers)
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

    this.waitingForRestock = false;
    this.polling = false;

    logger.log({
      id,
      level: 'info',
      message: `${States.ADD_TO_CART} statusCode: ${statusCode}`
    });

    if (!useMocks) {
      if (statusCode === 302) {
        if (/queue\.it/.test(headers.location)) {
          this.location = headers.location;

          this.proceedTo = States.ADD_TO_CART;

          return States.ENTER_QUEUE;
        }
      }

      if (isImproperStatusCode(statusCode)) {
        if (statusCode === 503 && /503 Backend.max_conn reached/i.test(body)) {
          emitEvent(this.context, [id], {
            message: `Error adding to cart [MAX_CONN]`
          });

          this.delayer = waitForDelay(retry, this.aborter.signal);
          await this.delayer;

          return States.ADD_TO_CART;
        }

        if (statusCode === 529) {
          return this.handleQueue(States.ADD_TO_CART);
        }

        if (statusCode === 531 || statusCode === 550 || statusCode === 400) {
          this.blocks = 0;
          this.waitingForRestock = true;

          emitEvent(this.context, [id], { message: 'Out of stock' });

          this.delayer = waitForDelay(monitor, this.aborter.signal);
          await this.delayer;

          return States.ADD_TO_CART;
        }

        if (statusCode === 403) {
          if (this.blocks > 5) {
            this.blocks = 0;
            this.proceedTo = States.ADD_TO_CART;

            return this.handleDatadome(body);
          }

          await taskSession.cookies.remove(url, 'datadome');

          this.blocks += 1;

          return States.ADD_TO_CART;
        }

        emitEvent(this.context, [id], {
          message: `Error adding to cart [${statusCode}]`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.ADD_TO_CART;
      }
    }

    return this.extractCartData(body);
  }

  async enterQueue() {
    const {
      id,
      task: {
        retry,
        store: { url }
      },
      queueManager
    } = this.context;

    const sharing = queueManager.get(url);

    if (sharing) {
      await Promise.all(
        sharing.cookies.map(cookie =>
          this.context.taskSession.cookies.set({ url, ...cookie })
        )
      );

      return this.proceedTo;
    }

    const { data } = await getQueue({
      handler: this.handler,
      message: 'Getting queue',
      location: this.location,
      storeUrl: url
    });

    const { statusCode } = data;

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error getting queue [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.ENTER_QUEUE;
    }

    if (this.captchaChallenge && !this.captchaChallengeSolved) {
      this.solveCaptchaChallenge = true;

      await this.injectRequester(
        this.data,
        this.captchaChallenge.sitekey,
        this.captchaChallenge.type
      );

      return States.CAPTCHA;
    }

    if (this.pow && !this.powSolved) {
      return States.SUBMIT_POW;
    }

    return States.SUBMIT_ENQUEUE;
  }

  async submitCaptchaChallenge() {
    const {
      id,
      task: {
        retry,
        store: { url }
      },
      queueManager
    } = this.context;

    const sharing = queueManager.get(url);

    if (sharing) {
      await Promise.all(
        sharing.cookies.map(cookie =>
          this.context.taskSession.cookies.set({ url, ...cookie })
        )
      );

      return this.proceedTo;
    }

    this.queueInfo = qs.parse(new URL(this.location).search);

    const { data } = await submitCaptchaChallenge({
      handler: this.handler,
      location: this.location,
      json: {
        challengeType: this.captchaChallenge.challengeType,
        sessionId: this.context.captchaToken,
        customerId: this.queueInfo.c,
        eventId: this.queueInfo.e,
        version: this.captchaChallenge.version
      }
    });

    const { statusCode, body } = data;

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting challenge captcha [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_CAPTCHA_CHALLENGE;
    }

    this.captchaSessionInfo = body;

    if (this.pow && !this.powSolved) {
      return States.HANDLE_POW;
    }

    return States.SUBMIT_ENQUEUE;
  }

  async handlePow() {
    const {
      id,
      task: {
        retry,
        store: { url }
      },
      queueManager
    } = this.context;

    const sharing = queueManager.get(url);

    if (sharing) {
      await Promise.all(
        sharing.cookies.map(cookie =>
          this.context.taskSession.cookies.set({ url, ...cookie })
        )
      );

      return this.proceedTo;
    }

    emitEvent(this.context, [id], {
      message: `Submitting empty pow`
    });

    const { data } = await submitEmptyPow({
      handler: this.handler,
      endpoint: `https://footlocker.queue-it.net/challengeapi/pow/challenge/${this.queueInfo.u}`,
      json: {}
    });

    const { statusCode, body } = data;

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting empty pow [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.HANDLE_POW;
    }

    if (!body || !body.parameters) {
      return States.HANDLE_POW;
    }

    const { input, zeroCount } = body.parameters;

    this.gennedPow = this.generateQueueItPow({ input, zeroCount });

    return States.SUBMIT_POW;
  }

  async submitPow() {
    const {
      id,
      task: {
        retry,
        store: { url }
      },
      queueManager
    } = this.context;

    const sharing = queueManager.get(url);

    if (sharing) {
      await Promise.all(
        sharing.cookies.map(cookie =>
          this.context.taskSession.cookies.set({ url, ...cookie })
        )
      );

      return this.proceedTo;
    }

    const { data } = await submitPow({
      handler: this.handler,
      endpoint: `https://footlocker.queue-it.net/challengeapi/verify`,
      json: {
        challengeType: 'proofofwork',
        sessionId: this.gennedPow.hash,
        customerId: this.queueInfo.c,
        eventId: this.queueInfo.e,
        version: this.captchaChallenge.version
      }
    });

    const { statusCode, body } = data;

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting pow [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_POW;
    }

    this.powSessionInfo = body;

    return States.SUBMIT_ENQUEUE;
  }

  async submitEnqueue() {
    const {
      id,
      task: {
        retry,
        store: { url }
      },
      queueManager
    } = this.context;

    const sharing = queueManager.get(url);

    if (sharing) {
      await Promise.all(
        sharing.cookies.map(cookie =>
          this.context.taskSession.cookies.set({ url, ...cookie })
        )
      );

      return this.proceedTo;
    }

    const { data } = await submitEnqueue({
      handler: this.handler,
      endpoint: `https://footlocker.queue-it.net/spa-api/queue/${this.queueInfo.c}/${this.queueInfo.e}/enqueue?cid=en-US`,
      json: {
        challengeSessions: [this.captchaSessionInfo, this.powSessionInfo],
        layoutName: 'FL Layout v02',
        customUrlParams: '',
        targetUrl: this.product.url,
        Referrer: ''
      }
    });

    const { statusCode } = data;

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting enqueue [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_ENQUEUE;
    }

    return States.WAIT_FOR_QUEUE;
  }

  async waitForQueue() {
    const {
      id,
      task: {
        retry,
        store: { url }
      },
      queueManager
    } = this.context;

    const sharing = queueManager.get(url);

    if (sharing) {
      await Promise.all(
        sharing.cookies.map(cookie =>
          this.context.taskSession.cookies.set({ url, ...cookie })
        )
      );

      return this.proceedTo;
    }

    emitEvent(this.context, [id], {
      message: `Waiting in queue`
    });

    const { data } = await submitSpaQueue({
      handler: this.handler,
      endpoint: `https://footlocker.queue-it.net/spa-api/queue/${this.queueInfo.c}/${this.queueInfo.e}/93c2c61e-eb83-46a7-a947-c8b9f3573cc7/status?cid=en-US&l=FL%20Layout%20v02&seid=c957a958-fea3-0253-14c2-9ce324bbcead&sets=1629899341509`,
      json: {
        targetUrl: this.product.url,
        customUrlParams: '',
        layoutVersion: 164616744217,
        layoutName: 'FL Layout v02',
        isClientRedayToRedirect: null,
        isBeforeOrIdle: true
      }
    });

    const { statusCode } = data;

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error waiting in queue [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.WAIT_FOR_QUEUE;
    }

    // todo: find a way to compare
    if (statusCode === 302) {
      // todo: not sure what cookies to add here..

      // let cookies = await this.context.taskSession.cookies.get({})

      // let queueCookies = cookies.filter((cookie) => cookie.domain && /queue\.it/.test(cookie.domain))
      // queueManager.add(cookies)
      return this.proceedTo;
    }

    return States.WAIT_FOR_QUEUE;
  }

  async handleDatadome(body: any) {
    const {
      id,
      taskSession,
      proxy,
      task: {
        rotate,
        retry,
        store: { url: storeUrl }
      },
      solverManager
    } = this.context;

    if (/403 forbidden/i.test(body)) {
      emitEvent(this.context, [id], { message: 'Error forbidden [403]' });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      const next = this.proceedTo;
      this.proceedTo = null;
      return next;
    }

    if (/varnish/i.test(body)) {
      this.delayer = waitForDelay(500, this.aborter.signal);
      await this.delayer;

      const next = this.proceedTo;
      this.proceedTo = null;
      return next;
    }

    if (rotate) {
      await taskSession.cookies.remove(storeUrl, 'datadome');
      return States.SWAP;
    }

    let url;
    try {
      if (typeof body === 'string') {
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

    // check the backlog to see if we still have a valid cookie to be used
    if (!this.purgeCookie && solverManager.cookies[storeUrl]) {
      this.purgeCookie = true;

      await taskSession.cookies.remove(storeUrl, 'datadome');
      await taskSession.cookies.set({
        url: storeUrl,
        name: 'datadome',
        value: solverManager.cookies[storeUrl]
      });

      if (this.proceedTo) {
        const next = this.proceedTo;
        this.proceedTo = null;
        return next;
      }

      return States.ADD_TO_CART;
    }

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

      return States.SWAP;
    }

    let cid = '';
    const cookies = await taskSession.cookies.get({ url: storeUrl });
    const cookie = cookies.find(c => c.name === 'datadome');
    if (cookie) {
      cid = cookie.value;
    }

    const data = {
      ...ddd,
      cid,
      ccid: null,
      'x-forwarded-for': proxy ? proxy.ip : undefined,
      parent_url: '',
      referer: ddd?.referer || '/'
    };

    this.data = data;

    this.purgeCookie = false;
    solverManager.store(storeUrl, '');

    solverManager.insert({
      id,
      url: storeUrl,
      data,
      release: this.release,
      active: false
    });

    if (solverManager.count(storeUrl) > 0) {
      emitEvent(this.context, [id], { message: 'Waiting for cookie' });

      return States.WAIT_FOR_COOKIE;
    }

    solverManager.requesters[storeUrl][id].active = true;

    await this.injectRequester({
      ...data,
      t: 'fe'
    });

    return States.CAPTCHA;
  }

  async waitForCookie() {
    const {
      aborted,
      taskSession,
      task: {
        store: { url }
      }
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

    return States.ADD_TO_CART;
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

    if (this.solveCaptchaChallenge) {
      return States.SUBMIT_CAPTCHA_CHALLENGE;
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
      captchaToken,
      solverManager
    } = this.context;

    const { nextState, data } = await submitCaptcha({
      handler: this.handler,
      userAgent: this.userAgent,
      storeUrl: url,
      data: this.data,
      token: captchaToken
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
      if (statusCode === 403) {
        solverManager.remove({ id, url });

        if (this.proceedTo) {
          const next = this.proceedTo;
          this.proceedTo = null;
          return next;
        }

        return States.ADD_TO_CART;
      }

      this.attempts += 1;

      if (this.attempts > 5) {
        this.attempts = 0;

        solverManager.remove({ id, url });

        if (this.proceedTo) {
          const next = this.proceedTo;
          this.proceedTo = null;
          return next;
        }

        return States.ADD_TO_CART;
      }

      emitEvent(this.context, [id], {
        message: `Error submitting captcha [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_CAPTCHA;
    }

    solverManager.remove({ id, url });

    await this.extractDatadome(body);

    if (this.proceedTo) {
      const next = this.proceedTo;
      this.proceedTo = null;
      return next;
    }
  }

  extractDatadomeData(url: string): DatadomeData {
    const data = qs.parse(
      (url || '').replace('https://geo.captcha-delivery.com/captcha/', '')
    );

    return {
      ...data,
      // @ts-ignore
      hsh: data.hash,
      host: 'geo.captcha-delivery.com'
    };
  }

  async extractDatadome({ cookie }: DatadomeCookie) {
    const {
      taskSession,
      task: {
        store: { url }
      },
      solverManager
    } = this.context;

    const [, raw] = cookie.split('=');
    const [value] = raw.split(';');

    solverManager.store(url, value);
    solverManager.spread(url, value);

    await taskSession.cookies.remove(url, 'datadome');
    await taskSession.cookies.set({
      url,
      name: 'datadome',
      value
    });
  }

  async verifyEmail() {
    const {
      id,
      logger,
      task: {
        retry,
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

      return States.VERIFY_EMAIL;
    }

    const { shipping } = profile;

    const message = this.polling ? 'Waiting in queue' : 'Verifying email';
    const { nextState, data } = await verifyEmail({
      handler: this.handler,
      message,
      cartId: this.cartId,
      csrfToken: this.csrfToken,
      storeUrl: url,
      email: shipping.email
    });

    const { statusCode, body } = data;

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.VERIFY_EMAIL} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    this.polling = false;

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 503 && /503 Backend.max_conn reached/i.test(body)) {
        emitEvent(this.context, [id], {
          message: `Error verifying email [MAX_CONN]`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.VERIFY_EMAIL;
      }

      if (statusCode === 529) {
        return this.handleQueue(States.VERIFY_EMAIL);
      }

      // rate limit, let's just fallback to restock mode
      if (statusCode === 550) {
        return States.SUBMIT_INFORMATION;
      }

      if (statusCode === 403) {
        this.proceedTo = States.VERIFY_EMAIL;

        return this.handleDatadome(body);
      }

      emitEvent(this.context, [id], {
        message: `Error verifying email [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.VERIFY_EMAIL;
    }

    return States.SUBMIT_SHIPPING;
  }

  async submitShipping() {
    const {
      id,
      logger,
      task: {
        retry,
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

      return States.SUBMIT_SHIPPING;
    }

    const { shipping } = profile;

    const message = this.polling ? 'Waiting in queue' : 'Submitting shipping';
    const { nextState, data } = await submitShipping({
      handler: this.handler,
      message,
      cartId: this.cartId,
      csrfToken: this.csrfToken,
      storeUrl: url,
      json: /footlocker\.co\.uk/i.test(url)
        ? shippingInfoEU(shipping)
        : shippingInfo(shipping)
    });

    const { statusCode, body } = data;

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.SUBMIT_SHIPPING} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    this.polling = false;

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 503 && /503 Backend.max_conn reached/i.test(body)) {
        emitEvent(this.context, [id], {
          message: `Error submitting shipping [MAX_CONN]`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.SUBMIT_SHIPPING;
      }

      if (statusCode === 529) {
        return this.handleQueue(States.SUBMIT_SHIPPING);
      }

      if (statusCode === 403) {
        this.proceedTo = States.SUBMIT_SHIPPING;

        return this.handleDatadome(body);
      }

      emitEvent(this.context, [id], {
        message: `Error submitting shipping [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_SHIPPING;
    }

    return States.SUBMIT_BILLING;
  }

  async submitBilling() {
    const {
      id,
      logger,
      task: {
        retry,
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

      return States.SUBMIT_SHIPPING;
    }

    const { billing } = profile;

    const message = this.polling ? 'Waiting in queue' : 'Submitting billing';

    const { nextState, data } = await submitBilling({
      handler: this.handler,
      message,
      cartId: this.cartId,
      csrfToken: this.csrfToken,
      storeUrl: url,
      json: /footlocker\.co\.uk/i.test(url)
        ? billingInfoEU(billing)
        : billingInfo(billing)
    });

    const { statusCode, body } = data;

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.SUBMIT_BILLING} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    this.polling = false;

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 503 && /503 Backend.max_conn reached/i.test(body)) {
        emitEvent(this.context, [id], {
          message: `Error submitting billing [MAX_CONN]`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.SUBMIT_BILLING;
      }

      if (statusCode === 529) {
        return this.handleQueue(States.SUBMIT_BILLING);
      }

      if (statusCode === 403) {
        this.proceedTo = States.SUBMIT_BILLING;

        return this.handleDatadome(body);
      }

      emitEvent(this.context, [id], {
        message: `Error submitting billing [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_BILLING;
    }

    return States.SUBMIT_CHECKOUT;
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

    const profile = this.retrieveProfile();
    if (!profile) {
      emitEvent(this.context, [id], {
        message: `Profile not found`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_INFORMATION;
    }

    const { shipping, billing } = profile;

    const message = this.polling
      ? 'Waiting in queue'
      : 'Submitting information';
    const { nextState, data } = await submitInformation({
      handler: this.handler,
      message,
      cartId: this.cartId,
      csrfToken: this.csrfToken,
      storeUrl: url,
      json: /footlocker\.co\.uk/i.test(url)
        ? customerInfoEU(shipping, billing)
        : customerInfo(shipping, billing)
    });

    const { statusCode, body } = data;

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

    this.polling = false;

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 503 && /503 Backend.max_conn reached/i.test(body)) {
        emitEvent(this.context, [id], {
          message: `Error submitting information [MAX_CONN]`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.SUBMIT_INFORMATION;
      }

      if (statusCode === 529) {
        return this.handleQueue(States.SUBMIT_INFORMATION);
      }

      if (statusCode === 403) {
        this.proceedTo = States.SUBMIT_INFORMATION;

        return this.handleDatadome(body);
      }

      emitEvent(this.context, [id], {
        message: `Error submitting information [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_INFORMATION;
    }

    return States.SUBMIT_CHECKOUT;
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

    const profile = this.retrieveProfile();
    if (!profile) {
      emitEvent(this.context, [id], {
        message: `Profile not found`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_CHECKOUT;
    }

    const { payment } = profile;

    const message = this.polling ? 'Waiting in queue' : 'Submitting checkout';
    const { nextState, data } = await submitCheckout({
      handler: this.handler,
      message,
      csrfToken: this.csrfToken,
      encryptionKey: this.encryptionKey,
      storeUrl: url,
      payment,
      cartId: this.cartId
    });

    const { statusCode, body } = data;

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

    this.polling = false;

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 503 && /503 Backend.max_conn reached/i.test(body)) {
        emitEvent(this.context, [id], {
          message: `Error submitting checkout [MAX_CONN]`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.SUBMIT_CHECKOUT;
      }

      if (statusCode === 529) {
        return this.handleQueue(States.SUBMIT_CHECKOUT);
      }

      if (statusCode === 400) {
        return this.sendWebhook(false, body);
      }

      if (statusCode === 403) {
        this.proceedTo = States.SUBMIT_CHECKOUT;

        return this.handleDatadome(body);
      }

      emitEvent(this.context, [id], {
        message: `Error submitting checkout [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_CHECKOUT;
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
      [States.GET_SESSION]: this.getSession,
      [States.GET_STOCK]: this.getStock,
      [States.ADD_TO_CART]: this.addToCart,
      [States.ENTER_QUEUE]: this.enterQueue,
      [States.HANDLE_POW]: this.handlePow,
      [States.SUBMIT_POW]: this.submitPow,
      [States.SUBMIT_CAPTCHA_CHALLENGE]: this.submitCaptchaChallenge,
      [States.SUBMIT_ENQUEUE]: this.submitEnqueue,
      [States.WAIT_FOR_QUEUE]: this.waitForQueue,
      [States.WAIT_FOR_COOKIE]: this.waitForCookie,
      [States.CAPTCHA]: this.waitForCaptcha,
      [States.SUBMIT_CAPTCHA]: this.submitCaptcha,
      [States.VERIFY_EMAIL]: this.verifyEmail,
      [States.SUBMIT_SHIPPING]: this.submitShipping,
      [States.SUBMIT_BILLING]: this.submitBilling,
      [States.SUBMIT_INFORMATION]: this.submitInformation,
      [States.SUBMIT_CHECKOUT]: this.submitCheckout,
      [States.SWAP]: this.swap,
      [States.NOOP]: this.noop,
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
      id,
      task: {
        store: { url }
      },
      footsManager,
      solverManager,
      queueManager
    } = this.context;

    footsManager.remove({ id });
    solverManager.remove({ id, url });
    queueManager.remove({ id, url });
    super.abort();
  }
}
