import { pick } from 'lodash';
import { load } from 'cheerio';

import { ShopifyContext } from '../../common/contexts';
import { request, isImproperStatusCode } from '../../common/utils';
import { Monitor } from '../../common/constants';

import { ShopifyTask } from './tasks/base';

import { getProducts, getDetails, getProductUrl } from './functions';
import { IPCKeys } from '../../../constants/ipc';
import { Parse, getHeaders } from '../utils';

const { match } = Parse;
const { ParseType } = Monitor;

const States = {
  ABORT: 'ABORT',
  ERROR: 'ERROR',
  MONITOR: 'MONITOR',
  WAIT_FOR_PRODUCT: 'WAIT_FOR_PRODUCT',
  SUBMIT_CART: 'SUBMIT_CART',
  GET_SHIPPING: 'GET_SHIPPING',
  DONE: 'DONE'
};

export class RateFetcher extends ShopifyTask {
  context: ShopifyContext;

  shippingRates: any[];

  _error: string;

  _mainWindow: any;

  constructor(context: ShopifyContext, mainWindow: any) {
    super(context, States.MONITOR);

    this.context = context;
    this.shippingRates = [];
    this._error = '';
    this._mainWindow = mainWindow;
  }

  retrieveProfile() {
    const {
      profileManager,
      task: {
        profile: { id }
      }
    } = this.context;

    return profileManager.retrieve(id);
  }

  handler = async ({
    endpoint,
    options = {},
    from = this.prevState,
    timeout = 10000,
    includeHeaders = true
  }: {
    endpoint: string;
    options?: any;
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

    const baseOptions = {
      proxy: proxy ? proxy.proxy : undefined,
      followAllRedirects: true,
      followRedirect: true,
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
        message: `${from} error: ${error?.message || 'Unknown'}`
      });

      return { data: {}, nextState: from };
    }
  };

  async getProducts() {
    const {
      aborted,
      task: {
        store: { url }
      }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    const { nextState, data } = await getProducts({
      handler: this.handler,
      message: ''
    });

    if (nextState) {
      this._error = 'UNKNOWN';

      return States.ERROR;
    }

    const { statusCode, body } = data;

    if (
      isImproperStatusCode(statusCode, /429|430|403|401/) ||
      !body ||
      !body?.products
    ) {
      this._error = 'NETWORK';

      return States.ERROR;
    }

    const { products } = body;

    const matched = await match(this.context, products);
    if (!matched) {
      this._error = 'PRODUCT';

      return States.ERROR;
    }

    const { id, variants, handle } = matched;

    this.context.product.id = id;
    this.context.product.variants = variants.map((v: any) =>
      pick(
        v,
        'id',
        'product_id',
        'title',
        'available',
        'price',
        'option1',
        'option2',
        'option3',
        'option4'
      )
    );

    if (/eflash-us/i.test(url)) {
      this.context.task.product.url = `${url}/products/${handle}`;

      return this.getProductFrontend();
    }

    return States.WAIT_FOR_PRODUCT;
  }

  async getProductFrontend() {
    const {
      aborted,
      task: {
        product: { url }
      }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    const { nextState, data } = await getProductUrl({
      handler: this.handler,
      url
    });

    if (nextState) {
      this._error = 'UNKNOWN';

      return States.ERROR;
    }

    const { statusCode, body } = data;

    if (isImproperStatusCode(statusCode, /429|430|403|401/) || !body) {
      this._error = 'NETWORK';

      return States.ERROR;
    }

    const $ = load(body, { normalizeWhitespace: true, xmlMode: false });

    const template = $('script#ProductJson-product-template') || '';
    if (!template || template.attr('type') !== 'application/json') {
      this._error = 'UNKNOWN';

      return States.ERROR;
    }

    const html = template.html();
    if (!html) {
      this._error = 'UNKNOWN';

      return States.ERROR;
    }

    const product = JSON.parse(html);

    // for DSM US we need to parse the `properties[_HASH]` field
    if (/eflash-us/i.test(url)) {
      const regex = /\$\(\s*atob\(\s*'PGlucHV0IHR5cGU9ImhpZGRlbiIgbmFtZT0icHJvcGVydGllc1tfSEFTSF0iIC8\+'\s*\)\s*\)\s*\.val\(\s*'(.+)'\s*\)/;
      const elements = regex.exec(body);

      if (elements) {
        const [, hash] = elements;
        this.context.product.properties = [
          {
            name: 'properties[_HASH]',
            value: hash,
            question: false
          }
        ];
      }
    }

    // for DSM UK the hash hasn't changed, so let's just hardcode it
    if (/eflash(?!.)/i.test(url)) {
      this.context.product.properties = [
        {
          name: 'properties[_hash]',
          value: 'ee3e8f7a9322eaa382e04f8539a7474c11555',
          question: false
        }
      ];
    }

    const { variants } = product;

    this.context.product.variants = variants.map((v: any) =>
      pick(
        v,
        'id',
        'product_id',
        'title',
        'available',
        'price',
        'option1',
        'option2',
        'option3',
        'option4'
      )
    );

    return States.WAIT_FOR_PRODUCT;
  }

  async getProduct() {
    const {
      aborted,
      task: {
        product: { url }
      }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    if (/eflash(?!-sg|-jp)/i.test(url)) {
      return this.getProductFrontend();
    }

    const { nextState, data } = await getDetails({
      handler: this.handler,
      url,
      message: ''
    });

    if (nextState) {
      this._error = 'UNKNOWN';

      return States.ERROR;
    }

    const { statusCode, body } = data;

    if (isImproperStatusCode(statusCode, /429|430|403|401/) || !body) {
      this._error = 'NETWORK';

      return States.ERROR;
    }

    const { variants } = body;

    this.context.product.variants = variants.map((v: any) =>
      pick(
        v,
        'id',
        'product_id',
        'title',
        'available',
        'price',
        'option1',
        'option2',
        'option3',
        'option4'
      )
    );

    return States.WAIT_FOR_PRODUCT;
  }

  async monitor() {
    const {
      aborted,
      parseType,
      task: {
        product: { variant }
      }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    switch (parseType) {
      case ParseType.Variant: {
        this.context.product.variants = [{ id: variant }];

        return States.WAIT_FOR_PRODUCT;
      }
      case ParseType.Url: {
        return this.getProduct();
      }
      case ParseType.Keywords: {
        return this.getProducts();
      }
      default: {
        this._error = 'PARSER';

        return States.ERROR;
      }
    }
  }

  async submitCart() {
    const nextState = await super.submitCart();

    if (nextState === States.DONE) {
      return States.GET_SHIPPING;
    }

    this._error = 'ERR: Cart';

    return States.ERROR;
  }

  async getShipping() {
    const { aborted } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    const profile = this.retrieveProfile();
    if (!profile) {
      this._error = 'ERR: Profile';

      return States.ERROR;
    }

    const {
      shipping: { country, province, zip }
    } = profile;

    const { nextState, data } = await this.handler({
      endpoint: `/cart/shipping_rates.json?shipping_address[zip]=${zip.replace(
        /\s/g,
        '+'
      )}&shipping_address[country]=${country.value.replace(
        /\s/g,
        '+'
      )}&shipping_address[province]=${
        province ? province.value.replace(/\s/g, '+') : ''
      }`,
      options: {
        json: true
      },
      from: States.GET_SHIPPING,
      timeout: 15000,
      includeHeaders: true
    });

    if (nextState) {
      this._error = 'UNKNOWN';

      return nextState;
    }

    const { statusCode, body } = data;
    if (statusCode === 422) {
      this._error = 'NETWORK';

      return States.ERROR;
    }

    if (!body) {
      this._error = 'NETWORK';

      return States.ERROR;
    }

    const { shipping_rates: shippingRates } = body;
    if (!shippingRates || !shippingRates.length) {
      return States.GET_SHIPPING;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const { name, price, source, code } of shippingRates) {
      const newRate = {
        name,
        price,
        id: `${source}-${encodeURI(code)}-${price}`
      };

      this.shippingRates.push(newRate);
    }

    return States.DONE;
  }

  async handleStepLogic(currentState: string) {
    const { id, logger } = this.context;

    const stepMap = {
      [States.MONITOR]: this.monitor,
      [States.WAIT_FOR_PRODUCT]: this.waitForProduct,
      [States.SUBMIT_CART]: this.submitCart,
      [States.GET_SHIPPING]: this.getShipping,
      [States.DONE]: () => States.DONE,
      [States.ERROR]: () => States.DONE,
      [States.ABORT]: () => States.DONE
    };

    logger.log({
      id,
      level: 'info',
      message: `Rate fetcher state: ${currentState}`
    });

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

  async run() {
    await super.run();

    if (this.shippingRates.length) {
      this._mainWindow.send(IPCKeys.RatesTaskStatus, {
        success: true,
        store: this.context.task.store.url,
        rates: this.shippingRates
      });

      return;
    }

    this._mainWindow.send(IPCKeys.RatesTaskStatus, {
      success: false,
      error: this._error
    });
  }
}
