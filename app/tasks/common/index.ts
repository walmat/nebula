// Constants
import {
  ErrorCodes,
  Manager,
  Monitor,
  Platforms,
  SiteKeyForPlatform,
  Task
} from './constants';

// Utils
import {
  capitalizeFirstLetter,
  compareProductData,
  LoggerService,
  currencyWithSymbol,
  deregisterForEvent,
  emitEvent,
  getRandomIntInclusive,
  now,
  reflect,
  registerForEvent,
  rfrl,
  trimKeywords,
  userAgent,
  waitForDelay,
  request,
  random,
  insertDecimal,
  format,
  isTimeout,
  isNetworkError,
  isImproperStatusCode,
  isEncoded,
  toTitleCase,
  Queue,
  AsyncQueue,
  CapacityQueue,
  Timer,
  ellipsis
} from './utils';

// Classes
import { BaseMonitor, BaseTask } from './classes';

import {
  ShopifyContext,
  YeezySupplyContext,
  FootsiteContext
} from './contexts';

const Utils = {
  request,
  now,
  rfrl,
  waitForDelay,
  reflect,
  userAgent,
  trimKeywords,
  compareProductData,
  getRandomIntInclusive,
  capitalizeFirstLetter,
  currencyWithSymbol,
  emitEvent,
  registerForEvent,
  deregisterForEvent,
  random,
  LoggerService,
  insertDecimal,
  format,
  isTimeout,
  isNetworkError,
  isImproperStatusCode,
  toTitleCase,
  isEncoded,
  ellipsis
};

const Classes = {
  Timer,
  Queue,
  AsyncQueue,
  CapacityQueue
};

const Bases = {
  BaseMonitor,
  BaseTask
};

const Constants = {
  ErrorCodes,
  Manager,
  Monitor,
  Platforms,
  SiteKeyForPlatform,
  Task
};

const Contexts = {
  ShopifyContext,
  YeezySupplyContext,
  FootsiteContext
};

export { Classes, Utils, Contexts, Bases, Constants };
