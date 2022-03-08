import { isEmpty } from 'lodash';

import { ShopifyAnswers } from '../../common/contexts/shopify';
import { ShopifyContext } from '../../common/contexts';
import {
  emitEvent,
  request,
  isTimeout,
  isNetworkError,
  waitForDelay,
  isImproperStatusCode,
  ellipsis
} from '../../common/utils';
import { Platforms, Monitor } from '../../common/constants';
import { BaseMonitor } from '../../common/classes';
import { Parse, getHeaders } from '../utils';
import { Monitor as MonitorConstants } from '../constants';

import { getProperties } from '../utils/parse';
import { getProducts, getProduct, getDetails } from './functions';

import { ProductMeta, Product } from '../types/product';

const { match } = Parse;
const { ParseType } = Monitor;
const { States } = MonitorConstants;

export class ShopifyMonitor extends BaseMonitor {
  context: ShopifyContext;

  products: any;

  fallback: boolean;

  product: any;

  constructor(context: ShopifyContext, platform = Platforms.Shopify) {
    super(context, States.MONITOR, platform);

    this.context = context;

    this.fallback = false;

    this.products = {};

    this.product = {};
  }

  // this only needs to live on the shopify side, so attach it here
  answer = ({ answers }: { answers: ShopifyAnswers[] }) => {
    this.context.answers = answers;
  };

  patchContext() {
    this.context.product = this.product;
  }

  handler = async ({
    endpoint,
    options = {},
    message = '',
    from = this.prevState,
    timeout = 10000,
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
      monitorSession,
      monitorProxy,
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
      proxy: monitorProxy ? monitorProxy.proxy : undefined,
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
      const res = await request(monitorSession, opts);

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

  async getProducts() {
    const {
      id,
      aborted,
      logger,
      task: { retry, monitor }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    const message = `Monitoring${ellipsis[this.tries]}`;

    this.tries += 1;
    if (this.tries > 2) {
      this.tries = 0;
    }

    const { nextState, data } = await getProducts({
      handler: this.handler,
      message
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, headers, body } = data;

    if (isImproperStatusCode(statusCode, /429|430|403/)) {
      emitEvent(this.context, [id], {
        message: `Error monitoring [${statusCode}]`
      });

      this.delayer = waitForDelay(monitor, this.aborter.signal);
      await this.delayer;

      return States.MONITOR;
    }

    if (isImproperStatusCode(statusCode, /401/)) {
      emitEvent(this.context, [id], {
        message: 'Password page'
      });

      this.delayer = waitForDelay(monitor, this.aborter.signal);
      await this.delayer;

      return States.MONITOR;
    }

    logger.log({
      id,
      level: 'silly',
      message: `Was cached? ${headers['x-cache'] !== 'miss'}`
    });

    if (!body?.products) {
      emitEvent(this.context, [id], {
        message: 'Error monitoring [UNKNOWN]'
      });

      this.delayer = waitForDelay(monitor, this.aborter.signal);
      await this.delayer;

      return States.MONITOR;
    }

    const { products } = body;
    this.products = products;

    return States.MATCH_PRODUCT;
  }

  async match() {
    const {
      aborted,
      task: {
        monitor,
        store: { url }
      }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    const matched: Product = await match(this.context, this.products);
    if (!matched) {
      this.delayer = waitForDelay(monitor, this.aborter.signal);
      await this.delayer;

      return States.MONITOR;
    }

    this.product.url = `${url}/products/${matched.handle}`;
    this.product.name = matched.title;
    this.product.variants = matched.variants;

    return States.GET_PRODUCT;
  }

  async getProductDetails() {
    const {
      id,
      aborted,
      logger,
      task: {
        retry,
        monitor,
        store: { url }
      }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    const message = `Monitoring${ellipsis[this.tries]}`;

    this.tries += 1;
    if (this.tries > 2) {
      this.tries = 0;
    }

    const { nextState, data } = await getDetails({
      handler: this.handler,
      message,
      url
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, headers, body } = data;

    if (isImproperStatusCode(statusCode, /429|430|403/)) {
      emitEvent(this.context, [id], {
        message: `Error monitoring [${statusCode}]`
      });

      this.delayer = waitForDelay(monitor, this.aborter.signal);
      await this.delayer;

      return States.MONITOR;
    }

    if (isImproperStatusCode(statusCode, /401/)) {
      emitEvent(this.context, [id], {
        message: 'Password page'
      });

      this.delayer = waitForDelay(monitor, this.aborter.signal);
      await this.delayer;

      return States.MONITOR;
    }

    logger.log({
      id,
      level: 'silly',
      message: `Was cached? ${headers['x-cache'] !== 'miss'}`
    });

    const { title, handle, variants } = body;
    this.product.name = title;
    this.product.url = `${url}/products/${handle}`;
    this.product.variants = variants;

    this.patchContext();

    return States.DONE;
  }

  async getProduct() {
    const {
      id,
      aborted,
      logger,
      task: {
        retry,
        monitor,
        store: { url: storeUrl }
      }
    } = this.context;

    if (aborted) {
      return States.ABORT;
    }

    if (this.fallback) {
      return this.getProductDetails();
    }

    // patch this so we don't circle back to parsing out the url of the product again
    if (this.context.parseType !== ParseType.Url) {
      this.context.parseType = ParseType.Url;
    }

    const message = `Monitoring${ellipsis[this.tries]}`;

    this.tries += 1;
    if (this.tries > 2) {
      this.tries = 0;
    }

    const { url } = this.product;

    const { nextState, data } = await getProduct({
      handler: this.handler,
      message,
      url
    });

    if (nextState) {
      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const { statusCode, headers, body } = data;

    if (isImproperStatusCode(statusCode, /429|430|403/)) {
      emitEvent(this.context, [id], {
        message: `Error monitoring [${statusCode}]`
      });

      this.delayer = waitForDelay(monitor, this.aborter.signal);
      await this.delayer;

      return States.MONITOR;
    }

    if (isImproperStatusCode(statusCode, /404/)) {
      emitEvent(this.context, [id], {
        message: 'Product not live'
      });

      this.delayer = waitForDelay(monitor, this.aborter.signal);
      await this.delayer;

      return States.MONITOR;
    }

    if (isImproperStatusCode(statusCode, /401/)) {
      emitEvent(this.context, [id], {
        message: 'Password page'
      });

      this.delayer = waitForDelay(monitor, this.aborter.signal);
      await this.delayer;

      return States.MONITOR;
    }

    logger.log({
      id,
      level: 'silly',
      message: `Was cached? ${headers['x-cache'] !== 'miss'}`
    });

    if (!body) {
      this.delayer = waitForDelay(monitor, this.aborter.signal);
      await this.delayer;

      return nextState;
    }

    const match = /(?<!ShopifyAnalytics\.)meta\s?=\s?(.*)(?=;)/i.exec(body);
    if (!match) {
      if (!this.product.variants) {
        return this.getProductDetails();
      }

      this.patchContext();

      return States.DONE;
    }

    const [, raw] = match;

    let product = {} as ProductMeta;
    try {
      ({ product } = JSON.parse(raw));
    } catch (e) {
      emitEvent(this.context, [id], {
        message: 'Error parsing product'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.MONITOR;
    }

    if (isEmpty(product)) {
      emitEvent(this.context, [id], {
        message: 'Error parsing product'
      });

      this.delayer = waitForDelay(retry, this.aborter.signal);
      await this.delayer;

      return States.MONITOR;
    }

    const { properties } = getProperties(body, storeUrl);

    logger.log({
      id,
      level: 'silly',
      message: `Properties list: ${JSON.stringify(properties)}`
    });

    this.product = {
      ...product,
      properties,
      variants: product.variants.map(p => ({
        id: p.id,
        price: p.price,
        name: p.name,
        title: p.public_title || 'N/A'
      }))
    };

    this.patchContext();

    return States.DONE;
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

        return States.DONE;
      }
      case ParseType.Url: {
        // patch this to avoid runtime errors
        this.product.url = this.context.task.product.url;
        return this.getProduct();
      }
      case ParseType.Keywords: {
        return this.getProducts();
      }
      default: {
        return States.ERROR;
      }
    }
  }

  async handleStepLogic(currentState: string) {
    const { id, logger } = this.context;

    const stepMap = {
      [States.MONITOR]: this.monitor,
      [States.GET_PRODUCT]: this.getProduct,
      [States.MATCH_PRODUCT]: this.match,
      [States.SWAP]: this.swap,
      [States.ERROR]: () => States.ABORT,
      [States.DONE]: () => States.ABORT,
      [States.ABORT]: () => States.ABORT
    };

    logger.log({
      id,
      level: 'info',
      message: `Handling monitor state: ${currentState}`
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
}
