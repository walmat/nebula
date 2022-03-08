import delay from 'delay';
import now from 'performance-now';
import { isEqual } from 'lodash';

import { request } from './request';
import { AsyncQueue, Queue, CapacityQueue, StaggeredQueue } from './queues';
import { Timer } from './timer';
import { LoggerService } from './logger';
import rfrl from './rfrl';
import { Monitor } from '../constants';

import { IS_DEV } from '../../../constants/env';

const { ParseType } = Monitor;

type Ellipsis = {
  [key: number]: string;
};

export const ellipsis: Ellipsis = {
  0: '',
  1: '.',
  2: '..',
  3: '...'
};

export const insertDecimal = (price: string) =>
  Number((Number(price) / 100).toFixed(2));

export const waitForDelay = (time: number, signal: AbortSignal) =>
  delay(time, { signal });

export const reflect = (p: Promise<any>) =>
  p.then(
    v => ({ v, status: 'fulfilled' }),
    e => ({ e, status: 'rejected' })
  );

export const userAgents = {
  mac: [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36'
  ],
  win: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
  ],
  linux: []
};

export const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36';

export const trimKeywords = (input: string[]) => {
  const ret: string[] = [];
  input.map(word => word.trim().substring(1, word.length).toUpperCase());
  return ret;
};

export const capitalizeFirstLetter = (sentence: string) =>
  sentence
    .toLowerCase()
    .split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');

export const toTitleCase = (string: string) =>
  string
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const isEncoded = (string: string) =>
  decodeURIComponent(string) !== string;

export const getRandomIntInclusive = (min: number, max: number) => {
  const randMin = Math.ceil(min);
  const randMax = Math.floor(max);
  return Math.floor(Math.random() * (randMax - randMin + 1)) + randMin;
};

export const currencyWithSymbol = (price: number, name: string) => {
  switch (name) {
    case 'usd':
    case 'USD': {
      return `$${price}`;
    }
    case 'cad':
    case 'CAD': {
      return `$${price} CAD`;
    }
    case 'eur':
    case 'EUR': {
      return `€${price}`;
    }
    case 'gbp':
    case 'GBP': {
      return `£${price}`;
    }
    default: {
      return price;
    }
  }
};

export const registerForEvent = (event: string, context: any, cb: Function) => {
  const { events } = context;
  events.on(event, cb);
};

export const deregisterForEvent = (
  event: string,
  context: any,
  cb: Function
) => {
  const { events } = context;
  events.removeListener(event, cb);
};

export const emitEvent = (context: any, ids: string[], payload: any = {}) => {
  // reduce emitting the same message more than once
  if (context?.message !== payload?.message) {
    context.setMessage(payload?.message);
    const { group } = context;
    context.relayMessage(group, ids, { ...payload });
  }
};

export const compareProductData = async (
  product1: any,
  product2: any,
  parseType: string
) => {
  // we only care about keywords/url matching here...
  switch (parseType) {
    case ParseType.Keywords: {
      const { pos, neg } = product1;
      const samePositiveKeywords = isEqual(product2.pos.sort(), pos.sort());
      const sameNegativeKeywords = isEqual(product2.neg.sort(), neg.sort());
      return samePositiveKeywords && sameNegativeKeywords;
    }
    case ParseType.Url: {
      const { url } = product1;
      return url && product2.url.toUpperCase() === url.toUpperCase();
    }
    case ParseType.Variant: {
      return product1.variant === product2.variant;
    }
    default:
      return false;
  }
};

const format = (data: string) => {
  if (IS_DEV && /^127/i.test(data)) {
    return 'http://127.0.0.1:8888';
  }

  if (!data || /^(127.*|localhost)/.test(data)) {
    return null;
  }

  const [ip, port, user, pass] = data.split(':');
  if (user && pass) {
    return `http://${user}:${pass}@${ip}:${port}`;
  }

  return `http://${ip}:${port}`;
};

const isTimeout = (errorObj: any) => {
  return /timeout|ERR_TIMED_OUT|ERR_CONNECTION_TIMED_OUT/i.test(errorObj);
};

const isNetworkError = (errorObj: any) => {
  return /ERR_TOO_MANY_RETRIES|ERR_CONNECTION_CLOSED|ERR_INTERNET_DISCONNECTED|PROXY_CONNECTION_FAILED|ERR_CONNECTION_RESET|ERR_CONNECTION_CLOSE|ERR_NAME_NOT_RESOLVED/i.test(
    errorObj
  );
};

const isImproperStatusCode = (
  statusCode: string | number,
  regex = /(?!([23][0-9]))\d{3}/i
) => regex.test(statusCode?.toString());

const random = (items: any[]) =>
  // eslint-disable-next-line no-bitwise
  items[~~(items.length * Math.random())];

export {
  Timer,
  Queue,
  StaggeredQueue,
  AsyncQueue,
  CapacityQueue,
  LoggerService,
  rfrl,
  now,
  random,
  format,
  request,
  isTimeout,
  isNetworkError,
  isImproperStatusCode
};
