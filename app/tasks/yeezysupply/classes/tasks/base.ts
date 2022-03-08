/* eslint-disable no-bitwise */
import { Crypto } from '@peculiar/webcrypto';
import { isEmpty } from 'lodash';
import { load } from 'cheerio';
import UAParser from 'ua-parser-js';

import { YeezySupplyContext } from '../../../common/contexts';
import {
  emitEvent,
  waitForDelay,
  request,
  isNetworkError,
  isImproperStatusCode,
  toTitleCase,
  isTimeout,
  random,
  getRandomIntInclusive
} from '../../../common/utils';
import { BaseTask } from '../../../common/classes';
import { Platforms } from '../../../common/constants';
import {
  getHomepage,
  getSession,
  getBoomerang,
  getAkamai,
  getBloom,
  getPixel,
  getCart,
  submitPixel,
  getProductInfo,
  getProductPage,
  getWrAsset,
  getAvailability,
  getConfig,
  getProduct,
  getShared,
  getSplash,
  addToCart,
  submitSensor,
  submitInformation,
  submitCheckout,
  completeCheckout
} from '../functions';
import { userAgents } from '../../utils';
import { Task } from '../../constants';
import { pickVariant } from '../../utils/pickVariant';

import { customerInfo } from '../../utils/forms';

import { getProductInfo as mockGetProductInfo } from '../../mocks/getProductInfo';
import { getAvailability as mockGetAvailability } from '../../mocks/getAvailability';
import {
  // submitCheckout as mockSubmitCheckout,
  three3dsResponse as mock3dsResponse
} from '../../mocks/submitCheckout';
import {
  AddToCartResponse,
  ProductInfoResponse,
  SubmitCheckoutResponse,
  ErrorSubmitCheckoutResponse
} from '../types';

import { getPlatform } from '../../../../utils/getPlatform';
import CAPTCHA_TYPES from '../../../../utils/captchaTypes';

const { States, Reasons, Modes } = Task;

export class YeezySupplyTask extends BaseTask {
  context: YeezySupplyContext;

  auth: string | null;

  basket: string;

  sitekey: string;

  splashUrl: string;

  configUrl: string;

  wrUrl: string;

  recaptchaAction: string;

  recaptchaCookie: string;

  recaptchaExpiration: number;

  splashCookie: string;

  splashFlag: string;

  shippingRate: any;

  encryptionKey: string;

  v3Enabled: boolean;

  pollRate: number;

  splashStatuses: number[];

  homepageLength: number;

  pixelLength: number;

  saleStarted: boolean;

  preview: boolean;

  returnState: null | string;

  proceedTo: null | string;

  interval: null | number;

  currency: string;

  formatter: string;

  retries: number;

  errors: number;

  limit: number;

  timestamp: number;

  referer: string;

  genOnce: boolean;

  hash: string;

  akamaiUrl: string;

  pxTag: string;

  pxId: string;

  payload: string;

  sensor: string;

  sensorUserAgent: string;

  posts: number;

  maxPosts: number;

  userAgent: string;

  splashBypass: boolean;

  firewall: boolean;

  submitted: boolean;

  abck: string;

  subFolder: string;

  bcn: string;

  akamaiCookies: string[];

  scriptName: string;

  form: any;

  termUrl: string;

  validate3DS: boolean;

  data: any;

  sessionStart: string;

  sessionId: string;

  beaconUrl: string;

  soastaApiKey: string;

  boomerangUrl: string;

  boomerangApiUrl: string;

  boomerangVersion: string;

  secUAHeader: string;

  forbidden: boolean;

  useTaskSession: boolean;

  useRegexToGen: boolean;

  success: boolean;

  basketBlock: boolean;

  firstBasket: boolean;

  constructor(context: YeezySupplyContext, platform = Platforms.YeezySupply) {
    super(context, States.GET_HOMEPAGE, platform);

    this.context = context;

    this.auth = null;
    this.basket = '';

    const os = getPlatform();
    this.userAgent = random(userAgents[os]);
    this.returnState = null;
    this.proceedTo = null;
    this.preview = false;
    this.submitted = false;
    this.firewall = false;
    this.useRegexToGen = false;
    this.posts = 0;

    // NOTE: injected variables
    this.validate3DS = false;
    this.sitekey = '6Lf34M8ZAAAAANgE72rhfideXH21Lab333mdd2d-';
    this.splashUrl = 'https://www.yeezysupply.com/__queue/yzysply';
    this.configUrl =
      'https://www.yeezysupply.com/hpl/content/yeezy-supply/config/US/waitingRoomConfig.json';
    this.wrUrl =
      'https://www.yeezysupply.com/wrgen_orig_assets/a17f6e5b63c8650a8916.js';
    this.recaptchaAction = 'yzysply_wr_pageview';
    this.recaptchaCookie = 'xhwUqgFqfW88H50';
    this.recaptchaExpiration = 120;
    this.splashCookie = 'PH0ENIX=false';
    this.splashFlag = 'wrgen_orig_assets';
    this.shippingRate = {
      id: '2ndDay-1',
      shipmentId: 'me'
    };
    this.encryptionKey =
      '10001|C4F415A1A41A283417FAB7EF8580E077284BCC2B06F8A6C1785E31F5ABFD38A3E80760E0CA6437A8DC95BA4720A83203B99175889FA06FC6BABD4BF10EEEF0D73EF86DD336EBE68642AC15913B2FC24337BDEF52D2F5350224BD59F97C1B944BD03F0C3B4CA2E093A18507C349D68BE8BA54B458DB63D01377048F3E53C757F82B163A99A6A89AD0B969C0F745BB82DA7108B1D6FD74303711065B61009BC8011C27D1D1B5B9FC5378368F24DE03B582FE3490604F5803E805AEEA8B9EF86C54F27D9BD3FC4138B9DC30AF43A58CFF7C6ECEF68029C234BBC0816193DF9BD708D10AAFF6B10E38F0721CF422867C8CC5C554A357A8F51BA18153FB8A83CCBED1';
    this.v3Enabled = true;
    this.splashBypass = false;
    this.splashStatuses = [200];
    this.homepageLength = 300000;
    this.pixelLength = 30000;
    this.saleStarted = true;
    this.limit = 50;
    this.maxPosts = 5;
    this.akamaiUrl = '/staticweb/e97e8f8724fti185702c1d719b8369c09';
    this.scriptName = 'bazadebezolkohpepadr';
    this.subFolder = 'staticweb';
    this.bcn = '%2F%2F36f1f23d.akstat.io%2F';
    this.akamaiCookies = [
      '_abck',
      'ak_bmsc',
      'bm_sv',
      'bm_sz',
      'bm_mi',
      'AKA_A2'
    ];

    this.sessionStart = '';
    this.sessionId = '';
    this.beaconUrl = '//173e2546.akstat.io/';
    this.soastaApiKey = '86N82-PSXN4-P5KN7-4G7XL-KJS5A';
    this.boomerangUrl = 'https://c.go-mpulse.net/boomerang';
    this.boomerangApiUrl = 'https://c.go-mpulse.net/api/config.json?key=';
    this.boomerangVersion = '1.667.0';

    // NOTE: internals
    this.pollRate = 3000;
    this.currency = 'USD';
    this.formatter = 'en-US';
    this.retries = 0;
    this.errors = 0;
    this.timestamp = 0;

    this.basketBlock = false;
    this.abck = '';
    this.pxTag = '';
    this.hash = '';
    this.pxId = '';
    this.payload = '';
    this.sensor = '';
    this.sensorUserAgent = '';
    this.genOnce = true;
    this.referer = 'https://www.yeezysupply.com/';

    this.interval = null;

    this.forbidden = false;
    this.useTaskSession = true;

    this.form = {};
    this.data = {};
    this.termUrl = '';
    this.success = false;

    this.firstBasket = true;

    this.secUAHeader = this.extractSecurityHeader(this.userAgent);
  }

  extractSecurityHeader = (userAgent: string) => {
    const { browser } = new UAParser(userAgent).getResult();

    return `" Not A;Brand";v="99", "Chromium";v="${
      browser.major || 89
    }", "Google Chrome";v="${browser.major || 89}"`;
  };

  extractSoasta = (body: string) => {
    try {
      [, this.soastaApiKey] = /soastaApiKey\\":\\"(.*)\\",\\"orderT/.exec(
        body || ''
      );
    } catch (e) {
      // noop...
      this.soastaApiKey = '86N82-PSXN4-P5KN7-4G7XL-KJS5A';
    }
  };

  inject = async (data: any) => {
    if (!isEmpty(data)) {
      Object.entries(data).map(([key, value]: [string, any]) => {
        if (key === 'sitekey') {
          this.context.task.store.sitekey = value;
          return null;
        }

        if (key !== '_id') {
          (this as any)[key] = value;
        }

        return null;
      });
    }
  };

  harvest = async ({
    token,
    timestamp
  }: {
    token: string;
    timestamp?: number;
  }) => {
    this.context.setCaptchaToken(token);

    if (timestamp) {
      this.timestamp = timestamp;
    } else {
      this.timestamp = Math.floor(
        (Date.now() + this.recaptchaExpiration) / 1000
      );
    }
  };

  async resetAllData() {
    const {
      taskSession,
      task: {
        product: { variant }
      }
    } = this.context;

    this.auth = null;
    this.basket = '';
    this.retries = 0;
    this.errors = 0;
    this.timestamp = 0;
    this.firstBasket = true;

    this.hash = '';
    this.pxTag = '';
    this.pxId = '';
    this.payload = '';
    this.genOnce = true;
    this.submitted = false;
    this.firewall = false;
    this.referer = `https://www.yeezysupply.com/product/${variant}`;

    const os = getPlatform();
    this.userAgent = random(userAgents[os]);

    this.abck = '';

    this.form = {};
    this.termUrl = '';

    await taskSession.clearStorageData();

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  checkSaleLive(state: string) {
    if (!this.saleStarted) {
      this.proceedTo = state;
      return States.WAIT_FOR_SALE;
    }

    return null;
  }

  isBanned(body: string) {
    return (
      body
        .toString()
        .includes(
          'UNFORTUNATELY WE ARE UNABLE TO GIVE YOU ACCESS TO OUR SITE AT THIS TIME'
        ) &&
      body.toString().includes(`If you're on a personal connection you can run`)
    );
  }

  checkPixel($: any) {
    const { id, logger } = this.context;

    const regex = new RegExp(/akam\/[\d]+\/pixel_([^?|&|"].*)\?a=(.*)"\s/, 'i');

    $('noscript').each((_: any, el: any) => {
      const html = $(el).text() || '';

      if (html) {
        const match = html.match(regex);
        if (match) {
          [, this.pxTag] = match;

          logger.log({
            id,
            level: 'info',
            message: `Extracted pixel tag: ${this.pxTag}`
          });

          return true;
        }
      }
    });

    // not found, let's just continue
    return false;
  }

  async extractBearerAuth(headers: any) {
    const { id, logger } = this.context;

    const { authorization } = headers;

    if (authorization) {
      this.auth = authorization;
    }

    logger.log({
      id,
      level: 'info',
      message: `Extracted authorization: ${this.auth}`
    });
  }

  extractHashValue($: any) {
    const { id, logger } = this.context;

    try {
      $('script').each((_: any, el: any) => {
        const html = $(el).html() || '';
        if (new RegExp(this.scriptName, 'i')) {
          this.hash = html.split('=')[1].replace(/"/g, '');
        }
      });
    } catch (e) {
      // noop...
    }

    logger.log({
      id,
      level: 'info',
      message: `Extracted hash: ${this.hash}`
    });
  }

  async extractProductData(body: ProductInfoResponse) {
    const {
      task: {
        store: { url }
      }
    } = this.context;

    try {
      const {
        id: productId,
        name,
        view_list: viewList,
        attribute_list: attributeList,
        pricing_information: pricing
      } = body;

      const [{ image_url: imageUrl }] = viewList;
      const {
        search_color: searchColor,
        search_color_raw: searchColorRaw,
        color,
        isInPreview
      } = attributeList;

      const style = searchColor || searchColorRaw || color;
      const productName = `${name} ${style}`;

      this.preview = isInPreview;

      this.context.product.url = `${url}/product/${productId}`;
      this.context.product.image = imageUrl;
      this.context.product.name = productName;
      this.context.product.price =
        pricing.currentPrice || pricing.standard_price;
    } catch (err) {
      // fail silently...
    }
  }

  async extractCartData(body: AddToCartResponse) {
    const { basketId } = body;

    if (basketId) {
      this.basket = basketId;
    }
  }

  extractOutOfStock(body: AddToCartResponse) {
    const { shipmentList } = body;

    if (shipmentList?.length) {
      const [{ availableStock }] = shipmentList[0]?.productLineItemList;
      return Number(availableStock) === 0;
    }

    // default to false if we can't extract? idk
    return false;
  }

  extractErrorMessage(body: ErrorSubmitCheckoutResponse) {
    const { message: error } = body;
    return this.sendWebhook(body as any, Reasons(error) || 'Card declined');
  }

  async handleGetAkamai(proceedTo: string) {
    const {
      id,
      task: { retry },
      restartManager
    } = this.context;

    if (!this.proceedTo) {
      this.proceedTo = proceedTo;
    }

    if (this.retries > this.limit) {
      emitEvent(this.context, [id], { message: `Max retries reached` });

      const shouldRestart = restartManager.restart();
      if (!shouldRestart) {
        return States.DONE;
      }

      this.context.setCaptchaToken('');
      await this.resetAllData();

      return States.GET_HOMEPAGE;
    }

    this.delayer = waitForDelay(retry, this.aborter.signal);
    await this.delayer;

    this.retries += 1;
    return States.GET_SENSOR;
  }

  async handleFirewall(proceedTo: string) {
    const {
      task: { retry }
    } = this.context;

    this.proceedTo = proceedTo;

    this.delayer = waitForDelay(retry, this.aborter.signal);
    await this.delayer;

    this.retries += 1;
    return States.GET_PRODUCT_PAGE;
  }

  async extractPayload(body: string) {
    const decryptionString = 'hftdrsetrTYE%TSTHTFjthdrghfgdhfjthrd';

    let result = '';

    for (let a = 0; a < body.length; a += 1) {
      result += String.fromCharCode(
        body.charCodeAt(a) ^
          decryptionString.charCodeAt(a % decryptionString.length)
      );
    }

    const parts = result.split('*');
    if (!parts.length) {
      return States.GET_SENSOR;
    }

    const [sensor, userAgent] = parts;

    this.sensor = sensor;
    this.sensorUserAgent = userAgent;

    return States.SUBMIT_SENSOR;
  }

  async extractPxId(body: string) {
    const {
      id,
      logger,
      task: { retry }
    } = this.context;

    try {
      const array = body.substring(
        body.lastIndexOf('_='),
        body.indexOf('"];') + 3
      );

      const index = body.substring(
        body.lastIndexOf('g=_[') + 4,
        body.lastIndexOf('],m=_[')
      );

      const parts = array.split(',');

      logger.log({
        id,
        level: 'debug',
        message: `Extracted: index ${index} of array of length: ${parts.length}`
      });

      const unicode = parts[Number(index)]
        .replace(/"/g, '')
        .replace(/\\x/g, '');

      const bytes = [...Buffer.from(unicode, 'hex')];
      const pxId = Buffer.from(bytes as any, 'hex').toString('utf8');

      this.pxId = pxId;
      this.errors = 0;

      if (this.proceedTo) {
        const next = this.proceedTo;
        this.proceedTo = null;
        return next;
      }

      return States.GET_PAYLOAD;
    } catch (e) {
      emitEvent(this.context, [id], { message: 'Error extracting pixel' });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_PIXEL;
    }
  }

  async removeInSplashCookie() {
    const {
      taskSession,
      task: {
        store: { url }
      }
    } = this.context;

    return taskSession.cookies.remove(url, 'akavpwr_ys_us');
  }

  async setDebugSplashCookies() {
    const {
      taskSession,
      task: {
        store: { url }
      }
    } = this.context;

    const expTime = new Date(new Date().getTime() + 15 * 60000).getTime();

    const sets = [
      {
        name: `${this.recaptchaCookie}_u`,
        value: `234t5i765432~hmac~324543213243567898654321`
      },
      {
        name: this.recaptchaCookie,
        value: '_pls_remove_me_'
      },
      {
        name: 'akavpfq_ys_us',
        value: '_pls_remove_me_'
      },
      {
        name: 'NujTerVZWUM68Dv',
        value: `exp=${Math.floor(
          expTime / 1000
        )}~acl=%2f*~data=36433933323938463037423841423037363041433338453330353936383835343439314646384432393033374338304444353732454544463938424535424632~hmac=9f55a3f957f5ca71768c75e900fa51b66d0c89624429216b401d9a2aa40e4511`
      }
    ];

    return Promise.allSettled(
      sets.map(set => taskSession.cookies.set({ url, ...set }))
    );
  }

  async setDefaultCookies(cookies: any[]) {
    const {
      taskSession,
      task: {
        store: { url }
      }
    } = this.context;

    return Promise.allSettled(
      cookies.map(({ name, ...cookie }) =>
        taskSession.cookies.set({ url, name, ...cookie })
      )
    );
  }

  async setBasketCookies() {
    const {
      taskSession,
      task: {
        store: { url }
      }
    } = this.context;

    const cookies = [
      {
        name: 'persistentBasketCount',
        value: '1'
      },
      {
        name: 'userBasketCount',
        value: '1'
      }
    ];

    return Promise.allSettled(
      cookies.map(cookie => taskSession.cookies.set({ url, ...cookie }))
    );
  }

  async setBoomerangCookie() {
    const {
      taskSession,
      task: {
        store: { url }
      }
    } = this.context;

    const parts = [
      `z=1`,
      `dm=yeezysupply.com`,
      `si=${this.sessionId}`,
      `ss=${this.sessionStart}`,
      `sl=1`,
      `tt=${getRandomIntInclusive(3500, 12432).toString(36)}`,
      `bcn=${this.beaconUrl ? encodeURIComponent(this.beaconUrl) : this.bcn}`,
      `ul=${getRandomIntInclusive(2000000, 3000000).toString(36)}`
    ];

    return taskSession.cookies.set({
      url,
      domain: '.yeezysupply.com',
      name: 'RT',
      value: `"${parts.join(`&`)}"`
    });
  }

  async setSplashCookie() {
    const {
      taskSession,
      task: {
        store: { url }
      }
    } = this.context;

    const [name, value] = this.splashCookie.split('=');

    // remove the cookie to prevent dupicates and set it again
    return Promise.allSettled([
      taskSession.cookies.remove(url, name),
      taskSession.cookies.set({ url, name, value })
    ]);
  }

  getCorrelationHeaders() {
    const buffer = new Uint32Array(2);

    const crypto = new Crypto();

    crypto.getRandomValues(buffer);

    const id = buffer[0].toString(16) + buffer[1].toString(16);

    return {
      'x-instana-l': `1,correlationType=web;correlationId=${id}`,
      'x-instana-s': id,
      'x-instana-t': id
    };
  }

  async sendWebhook(body: SubmitCheckoutResponse, message = 'Payment failed') {
    const {
      id,
      proxy,
      task: {
        useMocks,
        oneCheckout,
        store: { url, name },
        monitor,
        retry,
        quantity
      },
      product: { image, url: productUrl, name: productName, size },
      webhookManager,
      browserManager,
      restartManager,
      checkoutManager,
      notificationManager,
      analyticsManager
    } = this.context;

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

    const usedProxy = proxy ? proxy.proxy : 'None';

    const { orderId, paRedirectForm } = body as any;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if (paRedirectForm && this.validate3DS) {
      this.form = {
        ...paRedirectForm,
        orderId
      };
      this.termUrl = `https://www.yeezysupply.com/payment/callback/CREDIT_CARD/${this.basket}/adyen?orderId=${orderId}&encodedData=${paRedirectForm.formFields.EncodedData}&result=AUTHORISED`;

      return States.WAIT_FOR_LAUNCH;
    }

    if (body?.pricing?.total) {
      this.context.product.price = body.pricing.total;
    }

    const success = this.success || !!orderId;

    if (!success) {
      emitEvent(this.context, [id], { message });

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
          mode: Modes.REQUEST,
          proxy: proxy ? proxy.proxy : undefined,
          product: {
            name: toTitleCase(productName),
            price: Intl.NumberFormat(this.formatter, {
              style: 'currency',
              currency: this.currency
            }).format(Number(`${this.context.product.price}`)),
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
        browserManager.remove({ id });

        return States.DONE;
      }

      this.context.setCaptchaToken('');
      await this.resetAllData();

      return States.GET_HOMEPAGE;
    }

    browserManager.remove({ id });

    emitEvent(this.context, [id], { message: 'Check email!' });

    if (useMocks) {
      return States.DONE;
    }

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
      order: orderId || 'Unknown',
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
      mode: Modes.REQUEST,
      proxy: proxy ? proxy.proxy : undefined,
      product: {
        name: toTitleCase(productName),
        price: Intl.NumberFormat(this.formatter, {
          style: 'currency',
          currency: this.currency
        }).format(Number(`${this.context.product.price}`)),
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

  async waitForSale() {
    const { id, aborted } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    emitEvent(this.context, [id], { message: 'Waiting for sale' });

    if (this.saleStarted) {
      if (this.proceedTo) {
        const going = this.proceedTo;
        this.proceedTo = null;
        return going;
      }

      return States.GET_WRGEN_ASSET;
    }

    this.delayer = waitForDelay(3000, this.aborter.signal);
    await this.delayer;

    return States.WAIT_FOR_SALE;
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

    const requestHeaders = { ...options.headers };

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
        message: `${from} error: ${error?.message || 'Unknown'}`
      });

      this.errors += 1;
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

  async getProduct() {
    const {
      task: {
        product: { variant }
      }
    } = this.context;

    await getProduct({
      handler: this.handler,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      productId: variant
    });
  }

  async getShared() {
    const {
      task: {
        product: { variant }
      }
    } = this.context;

    await getShared({
      handler: this.handler,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      productId: variant
    });
  }

  async getConfig() {
    const {
      task: {
        product: { variant }
      }
    } = this.context;

    await getConfig({
      handler: this.handler,
      productId: variant,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      configUrl: this.configUrl
    });
  }

  async getHomepage() {
    const {
      id,
      logger,
      task: {
        retry,
        product: { variant }
      }
    } = this.context;

    this.referer = `https://www.yeezysupply.com/product/${variant}`;

    const { nextState, data } = await getHomepage({
      handler: this.handler,
      secUAHeader: this.secUAHeader,
      userAgent: this.userAgent
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_HOMEPAGE} nextState: ${nextState}`
      });

      if (this.errors >= 5) {
        this.errors = 0;

        await this.resetAllData();

        this.prevState = States.GET_HOMEPAGE;
        return States.SWAP;
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_HOMEPAGE} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting homepage [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_HOMEPAGE;
    }

    if (this.isBanned(body)) {
      emitEvent(this.context, [id], {
        message: `Proxy banned, swapping..`
      });

      this.errors += 1;

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      await this.resetAllData();

      this.prevState = States.GET_HOMEPAGE;
      return States.SWAP;
    }

    const $ = load(body || '', {
      xmlMode: false,
      normalizeWhitespace: true,
      ignoreWhitespace: true
    });

    this.extractHashValue($);
    this.checkPixel($);
    this.extractSoasta(body);

    this.retries = 0;
    this.errors = 0;

    this.sessionStart = Date.now().toString(36);

    return States.GET_SESSION;
  }

  async getSession() {
    const { data: sessionData } = await getSession({
      handler: this.handler,
      boomerangUrl: this.boomerangUrl,
      soastaApiKey: this.soastaApiKey,
      userAgent: this.userAgent
    });

    const { body: sessionBody } = sessionData;

    // @ts-ignore
    [, this.boomerangVersion] = /BOOMR.version="([a-zA-Z0-9.]+)";/.exec(
      sessionBody
    );

    const { data: boomerangData } = await getBoomerang({
      handler: this.handler,
      boomerangApiUrl: this.boomerangApiUrl,
      boomerangVersion: this.boomerangVersion,
      sessionId: this.sessionId,
      soastaApiKey: this.soastaApiKey,
      userAgent: this.userAgent
    });

    const { body: boomerangBody } = boomerangData;

    this.sessionId = boomerangBody.session_id;
    this.beaconUrl = boomerangBody.beacon_url;

    if (!this.pxTag) {
      return States.GET_AKAMAI;
    }

    this.errors = 0;
    this.proceedTo = States.GET_AKAMAI;
    return States.GET_PIXEL;
  }

  async getPixel() {
    const {
      id,
      logger,
      task: { retry }
    } = this.context;

    await this.setBoomerangCookie();
    const { nextState, data } = await getPixel({
      handler: this.handler,
      pxTag: this.pxTag,
      secUAHeader: this.secUAHeader,
      userAgent: this.userAgent
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_PIXEL} nextState: ${nextState}`
      });

      if (this.errors >= 5) {
        this.errors = 0;

        await this.resetAllData();

        this.prevState = States.GET_HOMEPAGE;
        return States.SWAP;
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_PIXEL} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting pixel [${statusCode}]`
      });

      if (statusCode === 404) {
        await this.resetAllData();
        this.prevState = States.GET_HOMEPAGE;
        return States.SWAP;
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_PIXEL;
    }

    return this.extractPxId(body);
  }

  async getAkamai() {
    const {
      id,
      logger,
      task: { retry }
    } = this.context;

    const { nextState, data } = await getAkamai({
      handler: this.handler,
      akamaiUrl: this.akamaiUrl,
      referer: this.referer,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_AKAMAI} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_AKAMAI} statusCode: ${statusCode}`
    });

    this.retries = 0;

    return States.GET_BLOOM;
  }

  async getBloom() {
    const {
      id,
      logger,
      task: { retry }
    } = this.context;

    const extras = this.getCorrelationHeaders();
    const { nextState, data } = await getBloom({
      handler: this.handler,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      extras
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_BLOOM} nextState: ${nextState}`
      });

      if (this.errors >= 5) {
        await this.resetAllData();

        this.prevState = States.GET_HOMEPAGE;
        return States.SWAP;
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_BLOOM} statusCode: ${statusCode}`
    });

    this.errors = 0;

    this.proceedTo = States.GET_PAYLOAD;
    return States.GET_BASKET;
  }

  async getBasket() {
    const {
      id,
      logger,
      task: {
        retry,
        product: { variant }
      }
    } = this.context;

    const extras = this.getCorrelationHeaders();
    const { nextState, data } = await getCart({
      handler: this.handler,
      bearer: this.auth,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      productId: variant,
      extras
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_BASKET} nextState: ${nextState}`
      });

      if (this.errors >= 5) {
        this.errors = 0;

        await this.resetAllData();

        this.prevState = States.GET_HOMEPAGE;
        return States.SWAP;
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, headers, body } = data;

    if (this.firstBasket) {
      this.firstBasket = false;

      if (this.proceedTo) {
        const next = this.proceedTo;
        this.proceedTo = null;
        return next;
      }

      return States.GET_PAYLOAD;
    }

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_BASKET} statusCode: ${statusCode}`
    });

    if (statusCode === 400 && /invalid url/i.test(body)) {
      emitEvent(this.context, [id], {
        message: `Akamai block, retrying...`
      });

      this.basketBlock = true;
      return this.handleGetAkamai(States.GET_BASKET);
    }

    this.errors = 0;

    await this.extractBearerAuth(headers);

    // NOTE: reset firewall ban
    this.firewall = false;

    if (this.proceedTo) {
      const next = this.proceedTo;
      this.proceedTo = null;
      return next;
    }

    this.proceedTo = States.ADD_TO_CART;
    return States.GET_SENSOR;
  }

  async getPayload() {
    // const body = await fetchPixel(this.pxId, this.hash, this.userAgent);

    // if (!body) {
    //   emitEvent(this.context, [id], {
    //     message: `Error generating payload`
    //   });

    //   this.delayer = waitForDelay(retry, this.aborter.signal);
    //   await this.delayer;

    //   return States.GET_PAYLOAD;
    // }

    // [this.payload] = body.split('*');

    // if (!this.payload) {
    //   emitEvent(this.context, [id], {
    //     message: `Error generating payload`
    //   });

    //   this.delayer = waitForDelay(retry, this.aborter.signal);
    //   await this.delayer;

    //   return States.GET_PAYLOAD;
    // }

    // this.errors = 0;
    // this.retries = 0;

    return States.SUBMIT_PIXEL;
  }

  async submitPixel() {
    const {
      id,
      logger,
      task: { retry }
    } = this.context;

    const now = Date.now();
    const cookies = [
      { name: 'UserSignUpAndSave', value: '1' },
      {
        name: 'UserSignUpAndSaveOverlay',
        value: '0'
      },
      {
        name: 'default_searchTerms_CustomizeSearch',
        value: '%5B%5D'
      },
      {
        name: 'geoRedirectionAlreadySuggested',
        value: 'false'
      },
      {
        name: 'wishlist',
        value: '%5B%5D'
      },
      {
        name: 'persistentBasketCount',
        value: '0'
      },
      {
        name: 'userBasketCount',
        value: '0'
      },
      { name: 's_cc', value: 'true' },
      {
        name: 's_pers',
        value: encodeURIComponent(
          ` s_vnum=${encodeURIComponent(
            `${now}%26vn%3D${getRandomIntInclusive(
              5,
              9
            )}|${now}; s_invisit=true|${
              now - getRandomIntInclusive(61843433, 997009669)
            }`
          )};`
        )
      },
      {
        name: 'utag_main',
        value:
          'v_id:0179da7d7d510072a1dfc37fade003072002a06a00bd0$_sn:1$_se:3$_ss:0$_st:1622870133816$ses_id:1622868327761%3Bexp-session$_pn:1%3Bexp-session$_prevpage:PRODUCT%7CYEEZY%20BOOST%20380%20ADULTS%20(GW0304)%3Bexp-1622871928166'
      },
      {
        name: '_ga',
        value: 'GA1.2.2013592599.1622868328'
      },
      {
        name: '_gid',
        value: 'GA1.2.1602442703.1622868328'
      },
      {
        name: '_gat_tealium_0',
        value: '1'
      },
      {
        name: '_gcl_au',
        value: '1.1.1027174275.1622868328'
      },
      {
        name: '_fbp',
        value: 'fb.1.1622868328402.623832784'
      },
      {
        name: '_gcl_au',
        value: '1.1.1027174275.1622868328'
      },
      {
        name: 'AMCVS_7ADA401053CCF9130A490D4C%40AdobeOrg',
        value: '1'
      },
      {
        name: 'AMCV_7ADA401053CCF9130A490D4C%40AdobeOrg',
        value:
          '-227196251%7CMCIDTS%7C18784%7CMCMID%7C53841739473916663753859934600661933645%7CMCAAMLH-1623473127%7C7%7CMCAAMB-1623473127%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1622875528s%7CNONE%7CMCAID%7CNONE'
      }
    ];

    await this.setDefaultCookies(cookies);

    const extras = this.getCorrelationHeaders();
    const { nextState, data } = await submitPixel({
      handler: this.handler,
      pxTag: this.pxTag,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      payload: this.payload,
      extras
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.SUBMIT_PIXEL} nextState: ${nextState}`
      });

      if (this.errors >= 5) {
        await this.resetAllData();

        this.prevState = States.GET_HOMEPAGE;
        return States.SWAP;
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.SUBMIT_PIXEL} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error submitting pixel [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_PIXEL;
    }

    this.errors = 0;

    const sets = [{ name: 'geo_country', value: 'US' }];
    await this.setDefaultCookies(sets);

    this.pxTag = '';
    this.pxId = '';

    if (this.proceedTo) {
      const next = this.proceedTo;
      this.proceedTo = null;
      return next;
    }

    return States.GET_PRODUCT_PAGE;
  }

  async getProductPage() {
    const {
      id,
      logger,
      taskSession,
      notificationManager,
      task: {
        retry,
        useMocks,
        store: { url },
        product: { variant }
      }
    } = this.context;

    const { nextState, data } = await getProductPage({
      handler: this.handler,
      productId: variant,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_PRODUCT_PAGE} nextState: ${nextState}`
      });

      if (this.errors >= 5) {
        await this.resetAllData();

        this.prevState = States.GET_HOMEPAGE;
        return States.SWAP;
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;

    if (this.firewall) {
      return States.GET_PRODUCT_INFO;
    }

    if (!useMocks) {
      if (this.isBanned(body)) {
        emitEvent(this.context, [id], {
          message: `Akamai block, retrying..`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_PRODUCT_PAGE;
      }
    }

    const $ = load(body || '', {
      xmlMode: false,
      normalizeWhitespace: true,
      ignoreWhitespace: true
    });
    this.extractHashValue($);
    this.checkPixel($);

    if (this.pxTag) {
      return States.GET_PIXEL;
    }

    // check for splash HMAC cookie
    const cookies = await taskSession.cookies.get({ url });
    const hmac = cookies.find(
      ({ name, value }: { name: string; value: string }) =>
        /hmac/i.test(value) &&
        !new RegExp(`${this.recaptchaCookie}_u`, 'i').test(name)
    );

    logger.log({
      id,
      level: 'info',
      message: `${States.GET_PRODUCT_PAGE} HMAC: ${hmac}`
    });

    if (hmac) {
      notificationManager.insert({
        id,
        message: `Task ${id}: Passed splash!`,
        variant: 'info',
        type: 'HEADS_UP'
      });

      emitEvent(this.context, [id], {
        message: 'Passed splash'
      });

      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }

      this.errors = 0;
      this.retries = 0;
      this.referer = `${url}/product/${variant}`;

      return States.GET_PRODUCT_INFO;
    }

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_PRODUCT_PAGE} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      emitEvent(this.context, [id], {
        message: `Error visiting product [${statusCode}]`
      });

      if (statusCode === 403) {
        return this.handleGetAkamai(States.GET_PRODUCT_PAGE);
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_PRODUCT_PAGE;
    }

    this.errors = 0;
    this.retries = 0;

    if (!this.saleStarted) {
      return States.WAIT_FOR_SALE;
    }

    // NOTE: Uncomment to use debug path
    // if (this.tries > 0) {
    //   this.tries = 0;

    //   return States.GET_PRODUCT_INFO;
    // }
    // this.tries += 1;

    if (this.splashBypass) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_PRODUCT_PAGE;
    }

    // NOTE: Comment out to test splash handling
    if (!new RegExp(this.splashFlag, 'i').test(body)) {
      return States.GET_PRODUCT_INFO;
    }

    return States.GET_WRGEN_ASSET;
  }

  async getWrAsset() {
    const { id, logger } = this.context;

    const { data } = await getWrAsset({
      handler: this.handler,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      wrUrl: this.wrUrl
    });

    const { statusCode } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_WRGEN_ASSET} statusCode: ${statusCode}`
    });

    if (!this.interval) {
      const caller = async () => {
        this.getConfig();
        this.getProduct();
        this.getShared();
      };

      caller();

      this.interval = setInterval(() => this.getConfig(), 5000);
    }

    this.retries = 0;

    return States.WAIT_IN_SPLASH;
  }

  async waitInSplash() {
    const {
      id,
      logger,
      taskSession,
      captchaManager,
      task: {
        retry,
        store: { url },
        product: { variant }
      }
    } = this.context;

    const waitForSale = this.checkSaleLive(States.WAIT_IN_SPLASH);
    if (waitForSale) {
      return waitForSale;
    }

    // make sure to set the splash cookie and remove the in-splash cookie
    await Promise.allSettled([
      this.setSplashCookie(),
      this.removeInSplashCookie()
    ]);

    if (this.splashBypass) {
      return States.GET_PRODUCT_PAGE;
    }

    const cookies = await taskSession.cookies.get({ url });
    const recaptchaCookie = cookies.find(({ name }: { name: string }) =>
      new RegExp(this.recaptchaCookie, 'i').test(name)
    );

    // if our token has expired, let's request a new solve and insert it into the session
    if (this.v3Enabled && !recaptchaCookie) {
      captchaManager.insert({
        id,
        type: CAPTCHA_TYPES.RECAPTCHA_V3,
        sitekey: this.sitekey,
        platform: Platforms.YeezySupply,
        harvest: this.harvest as any,
        host: url,
        action: this.recaptchaAction,
        sharing: true,
        expiration: this.recaptchaExpiration
      });

      return States.CAPTCHA;
    }

    const { nextState, data } = await getSplash({
      handler: this.handler,
      productId: variant,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      splashUrl: this.splashUrl
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.WAIT_IN_SPLASH} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.WAIT_IN_SPLASH} statusCode: ${statusCode}`
    });

    // NOTE: Comment out to test queue handling
    if (
      this.splashStatuses.some(status => Number(status) === Number(statusCode))
    ) {
      // if (useMocks && IS_DEV) {
      //   await this.setDebugSplashCookies();
      // }

      const cookies = await taskSession.cookies.get({});
      // eslint-disable-next-line no-restricted-syntax
      for (const cookie of cookies) {
        if (/remove_me/i.test(cookie.value)) {
          // eslint-disable-next-line no-await-in-loop
          await taskSession.cookies.remove(url, cookie.name);
        }
      }

      this.retries = 0;

      return States.GET_PRODUCT_PAGE;
    }

    this.delayer = waitForDelay(this.pollRate, this.aborter.signal);
    await this.delayer;

    this.retries = 0;

    return States.WAIT_IN_SPLASH;
  }

  async waitForCaptcha() {
    const nextState = await super.waitForCaptcha('Waiting on v3 Captcha');
    if (nextState !== States.DONE) {
      return nextState;
    }

    const {
      taskSession,
      captchaToken,
      task: {
        store: { url }
      }
    } = this.context;

    await taskSession.cookies.set({
      url,
      name: this.recaptchaCookie,
      value: captchaToken,
      expirationDate: this.timestamp
    });

    // reset captcha token
    this.context.setCaptchaToken('');

    return States.WAIT_IN_SPLASH;
  }

  async getProductInfo() {
    const {
      id,
      logger,
      task: {
        retry,
        useMocks,
        product: { variant }
      }
    } = this.context;

    let body;

    const extras = this.getCorrelationHeaders();
    const { nextState, data } = await getProductInfo({
      handler: this.handler,
      productId: variant,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      extras
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_PRODUCT_INFO} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;

    if (useMocks) {
      body = mockGetProductInfo;
    } else {
      ({ body } = data);
    }

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_PRODUCT_INFO} statusCode: ${statusCode}`
    });

    if (this.isBanned(body)) {
      emitEvent(this.context, [id], {
        message: `Akamai ban, retrying...`
      });

      return this.handleGetAkamai(States.GET_PRODUCT_INFO);
    }

    if (this.firewall) {
      return States.GET_BASKET;
    }

    await this.extractProductData(body);
    const { name: productName, image } = this.context.product;

    const message: any = {};
    message.productName = productName;
    message.productImage = image;
    message.productImageHi = image;

    emitEvent(this.context, [id], message);

    this.retries = 0;
    this.retries = 0;

    this.proceedTo = States.GET_AVAILABILITY;
    return States.GET_BASKET;
  }

  async getAvailability() {
    const {
      id,
      logger,
      task: {
        retry,
        sizes,
        useMocks,
        product: { variant }
      }
    } = this.context;

    let body;

    const extras = this.getCorrelationHeaders();
    const { nextState, data } = await getAvailability({
      handler: this.handler,
      productId: variant,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      extras
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.GET_AVAILABILITY} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;

    if (useMocks) {
      body = mockGetAvailability;
    } else {
      ({ body } = data);
    }

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.GET_AVAILABILITY} statusCode: ${statusCode}`
    });

    if (!useMocks) {
      if (isImproperStatusCode(statusCode)) {
        emitEvent(this.context, [id], {
          message: `Error retrieving stock [${statusCode}]`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.GET_AVAILABILITY;
      }
    }

    if (this.isBanned(body)) {
      emitEvent(this.context, [id], {
        message: `Akamai ban, retrying...`
      });

      return this.handleGetAkamai(States.GET_AVAILABILITY);
    }

    const {
      id: productId,
      availability_status: availabilityStatus,
      variation_list: variationList
    } = body;

    this.context.product.id = productId;
    this.context.product.variants = variationList;

    if (!/in_stock/i.test(availabilityStatus)) {
      emitEvent(this.context, [id], {
        message: 'Out of stock'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_AVAILABILITY;
    }

    const chosen = pickVariant({
      variants: variationList,
      sizes,
      id,
      logger
    });

    if (!chosen) {
      emitEvent(this.context, [id], {
        message: 'No sizes matched, retrying...'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_AVAILABILITY;
    }

    const { sku, size } = chosen;
    this.context.product.sku = sku;
    this.context.product.size = size;

    emitEvent(this.context, [id], {
      chosenSize: size
    });

    this.retries = 0;
    this.retries = 0;

    this.proceedTo = States.ADD_TO_CART;
    return States.GET_SENSOR;
  }

  async getSensor() {
    const { id } = this.context;

    emitEvent(this.context, [id], {
      message: `Generating sensor`
    });

    // const cookies = await taskSession.cookies.get({ url });
    // const abck = cookies.find(({ name }) => name === '_abck');

    let body: any;
    // const body = await fetchSensor({ form });

    // if (!body) {
    //   emitEvent(this.context, [id], {
    //     message: `Error generating sensor`
    //   });

    //   this.delayer = waitForDelay(2500, this.aborter.signal);
    //   await this.delayer;

    //   return States.GET_SENSOR;
    // }

    return this.extractPayload(body);
  }

  async submitSensor() {
    const {
      id,
      logger,
      taskSession,
      task: {
        retry,
        store: { url }
      }
    } = this.context;

    const extras = this.getCorrelationHeaders();
    const { nextState, data } = await submitSensor({
      handler: this.handler,
      referer: this.referer,
      akamaiUrl: this.akamaiUrl,
      userAgent: this.useRegexToGen ? this.sensorUserAgent : this.userAgent,
      secUAHeader: this.secUAHeader,
      payload: this.sensor,
      extras
    });

    if (nextState) {
      logger.log({
        id,
        level: 'error',
        message: `${States.SUBMIT_SENSOR} nextState: ${nextState}`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.GET_SENSOR;
    }

    const { statusCode } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.SUBMIT_SENSOR} statusCode: ${statusCode}`
    });

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 403) {
        return States.GET_SENSOR;
      }

      emitEvent(this.context, [id], {
        message: `Error submitting sensor [${statusCode}]`
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_SENSOR;
    }

    if (this.posts >= this.maxPosts) {
      this.posts = 0;
      this.retries = 0;

      const cookies = await taskSession.cookies.get({ url });
      this.abck = cookies.find(({ name }) => name === '_abck')?.value || '';

      if (this.basketBlock) {
        this.basketBlock = false;

        return States.GET_BASKET;
      }

      if (this.proceedTo) {
        const next = this.proceedTo;
        this.proceedTo = null;
        return next;
      }

      if (!this.auth) {
        return States.GET_BASKET;
      }

      if (!this.submitted) {
        return States.SUBMIT_INFORMATION;
      }

      return States.SUBMIT_CHECKOUT;
    }

    this.posts += 1;

    return States.GET_SENSOR;
  }

  async addToCart() {
    const {
      id,
      logger,
      task: {
        retry,
        product: { variant },
        useMocks
      },
      product: { id: productId, sku, size }
    } = this.context;

    const extras = this.getCorrelationHeaders();
    const { nextState, data } = await addToCart({
      handler: this.handler,
      productId: variant,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      bearer: this.auth,
      extras,
      json: [
        {
          product_id: productId,
          product_variation_sku: sku,
          productId: sku,
          quantity: 1,
          size,
          displaySize: size
        }
      ]
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

    const { headers, statusCode, body } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.ADD_TO_CART} statusCode: ${statusCode}`
    });

    if (useMocks && statusCode === 400) {
      return States.SUBMIT_INFORMATION;
    }

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 400) {
        emitEvent(this.context, [id], {
          message: `Akamai block, retrying...`
        });

        return this.handleGetAkamai(States.ADD_TO_CART);
      }

      emitEvent(this.context, [id], {
        message: `Error adding to cart [${statusCode}]`
      });

      if (statusCode === 403) {
        this.firewall = true;
        return this.handleFirewall(States.ADD_TO_CART);
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.ADD_TO_CART;
    }

    if (
      headers.server === 'AkamaiNetStorage' &&
      !new RegExp(productId).test(body)
    ) {
      emitEvent(this.context, [id], {
        message: `Improper cart, retrying...`
      });

      this.firewall = true;
      return this.handleFirewall(States.ADD_TO_CART);
    }

    await this.extractBearerAuth(headers);
    await this.extractCartData(body);

    this.referer = 'https://www.yeezysupply.com/delivery';

    this.retries = 0;
    this.retries = 0;

    this.proceedTo = States.SUBMIT_INFORMATION;
    return States.GET_SENSOR;
  }

  async submitInformation() {
    const {
      id,
      logger,
      task: { useMocks, retry }
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

    await this.setBasketCookies();

    const extras = this.getCorrelationHeaders();
    const { nextState, data } = await submitInformation({
      handler: this.handler,
      bearer: this.auth,
      basketId: this.basket,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      extras,
      json: customerInfo(shipping, billing, this.shippingRate)
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

    const { statusCode } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.SUBMIT_INFORMATION} statusCode: ${statusCode}`
    });

    if (useMocks && statusCode === 400) {
      return States.SUBMIT_CHECKOUT;
    }

    if (isImproperStatusCode(statusCode)) {
      if (statusCode === 400) {
        emitEvent(this.context, [id], {
          message: `Akamai block, retrying...`
        });

        return this.handleGetAkamai(States.SUBMIT_INFORMATION);
      }

      emitEvent(this.context, [id], {
        message: `Error submitting information [${statusCode}]`
      });

      if (statusCode === 403) {
        this.firewall = true;
        return this.handleFirewall(States.SUBMIT_INFORMATION);
      }

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.SUBMIT_INFORMATION;
    }

    this.retries = 0;
    this.retries = 0;
    this.submitted = true;
    this.referer = 'https://www.yeezysupply.com/payment';

    this.proceedTo = States.SUBMIT_CHECKOUT;
    return States.GET_SENSOR;
  }

  async submitCheckout() {
    const {
      id,
      logger,
      task: { retry, useMocks }
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

    let body;

    const extras = this.getCorrelationHeaders();
    const { nextState, data } = await submitCheckout({
      handler: this.handler,
      encryptionKey: this.encryptionKey,
      bearer: this.auth,
      basketId: this.basket,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      extras,
      payment
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode } = data;

    if (useMocks) {
      body = mock3dsResponse;
      // body = mockSubmitCheckout;
    } else {
      ({ body } = data);
    }

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.SUBMIT_CHECKOUT} statusCode: ${statusCode}`
    });

    if (!useMocks) {
      if (isImproperStatusCode(statusCode)) {
        if (statusCode === 404) {
          emitEvent(this.context, [id], {
            message: 'Session expired'
          });

          this.delayer = waitForDelay(1000, this.aborter.signal);
          await this.delayer;

          await this.resetAllData();

          return States.GET_PRODUCT_PAGE;
        }

        if (statusCode === 400) {
          return this.sendWebhook(body);
        }

        emitEvent(this.context, [id], {
          message: `Error submitting checkout [${statusCode}]`
        });

        if (statusCode === 403) {
          emitEvent(this.context, [id], {
            message: `Akamai block, retrying...`
          });

          this.firewall = true;
          return this.handleFirewall(States.SUBMIT_CHECKOUT);
        }

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.SUBMIT_CHECKOUT;
      }
    }

    return this.sendWebhook(body);
  }

  async waitForLaunch() {
    const {
      id,
      aborted,
      browserManager,
      taskSession,
      proxy,
      task: {
        store: { url }
      }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    if (!browserManager.requesters[id]) {
      browserManager.insert({
        id,
        data: {},
        completed: false,
        active: false
      });
    }

    // if we have 5 or more browsers opened, let's wait
    if (browserManager.count() >= 5) {
      emitEvent(this.context, [id], {
        message: 'Waiting for browser'
      });

      this.delayer = waitForDelay(2500, this.aborter.signal);
      await this.delayer;

      return States.WAIT_FOR_LAUNCH;
    }

    emitEvent(this.context, [id], {
      message: 'Processing 3DSecure'
    });

    browserManager.requesters[id].active = true;
    browserManager.launch({
      id,
      session: this.useTaskSession ? taskSession : null,
      url,
      proxy: this.useTaskSession && proxy ? proxy.proxy : '',
      userAgent: this.userAgent,
      form: this.form,
      termUrl: this.termUrl
    });

    return States.WAIT_FOR_CLOSE;
  }

  async waitForClose() {
    const { id, aborted, browserManager } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    if (browserManager.requesters[id].completed) {
      this.data = browserManager.requesters[id].data;

      return States.COMPLETE_CHECKOUT;
    }

    if (browserManager.browsers[id]) {
      this.delayer = waitForDelay(2500, this.aborter.signal);
      await this.delayer;

      return States.WAIT_FOR_CLOSE;
    }

    // otherwise, they closed it without finishing 3DS
    // let's kick them back to waiting for launch
    return States.WAIT_FOR_LAUNCH;
  }

  async completeCheckout() {
    const {
      id,
      logger,
      task: {
        retry,
        useMocks,
        store: { url: storeUrl }
      }
    } = this.context;

    const extras = this.getCorrelationHeaders();
    const { nextState, data } = await completeCheckout({
      handler: this.handler,
      userAgent: this.userAgent,
      secUAHeader: this.secUAHeader,
      storeUrl,
      bearer: this.auth || 'null',
      form: this.data,
      extras
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, body } = data;

    logger.log({
      id,
      level: statusCode >= 400 ? 'error' : 'info',
      message: `${States.COMPLETE_CHECKOUT} statusCode: ${statusCode}`
    });

    if (!useMocks) {
      if (isImproperStatusCode(statusCode)) {
        if (statusCode === 404) {
          emitEvent(this.context, [id], {
            message: 'Session expired'
          });

          this.delayer = waitForDelay(1000, this.aborter.signal);
          await this.delayer;

          await this.resetAllData();

          return States.GET_PRODUCT_PAGE;
        }

        if (statusCode === 400) {
          return this.sendWebhook(body);
        }

        emitEvent(this.context, [id], {
          message: `Error completing checkout [${statusCode}]`
        });

        if (statusCode === 403) {
          emitEvent(this.context, [id], {
            message: `Akamai block, retrying...`
          });

          this.firewall = true;
          return this.handleFirewall(States.COMPLETE_CHECKOUT);
        }

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;

        return States.COMPLETE_CHECKOUT;
      }
    }

    this.success = true;

    return this.sendWebhook(body);
  }

  async handleStepLogic(currentState: string) {
    const { id, logger } = this.context;

    if (this.anticrack && currentState === States.SUBMIT_CHECKOUT) {
      // eslint-disable-next-line no-param-reassign
      currentState = States.NOOP;
    }

    const stepMap = {
      [States.GET_HOMEPAGE]: this.getHomepage,
      [States.GET_SESSION]: this.getSession,
      [States.GET_PIXEL]: this.getPixel,
      [States.GET_PAYLOAD]: this.getPayload,
      [States.SUBMIT_PIXEL]: this.submitPixel,
      [States.GET_BLOOM]: this.getBloom,
      [States.GET_BASKET]: this.getBasket,
      [States.GET_PRODUCT_PAGE]: this.getProductPage,
      [States.GET_WRGEN_ASSET]: this.getWrAsset,
      [States.WAIT_FOR_SALE]: this.waitForSale,
      [States.WAIT_IN_SPLASH]: this.waitInSplash,
      [States.GET_PRODUCT_INFO]: this.getProductInfo,
      [States.GET_AVAILABILITY]: this.getAvailability,
      [States.GET_AKAMAI]: this.getAkamai,
      [States.GET_SENSOR]: this.getSensor,
      [States.SUBMIT_SENSOR]: this.submitSensor,
      [States.ADD_TO_CART]: this.addToCart,
      [States.CAPTCHA]: this.waitForCaptcha,
      [States.SUBMIT_INFORMATION]: this.submitInformation,
      [States.SUBMIT_CHECKOUT]: this.submitCheckout,
      [States.WAIT_FOR_LAUNCH]: this.waitForLaunch,
      [States.WAIT_FOR_CLOSE]: this.waitForClose,
      [States.COMPLETE_CHECKOUT]: this.completeCheckout,
      [States.NOOP]: this.noop,
      [States.SWAP]: this.swap,
      [States.DONE]: () => States.DONE,
      [States.ERROR]: () => States.DONE,
      [States.ABORT]: () => States.DONE
    };

    // filter out captcha state...
    if (currentState !== States.CAPTCHA) {
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
    const { id, browserManager } = this.context;

    browserManager.remove({ id });

    super.abort();
  }
}
