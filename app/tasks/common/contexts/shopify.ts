/* eslint-disable camelcase */

import { Session } from 'electron';
import { Task as TaskConstants, Monitor } from '../constants';
import {
  CaptchaManager,
  ProxyManager,
  WebhookManager,
  ProfileManager,
  NotificationManager,
  RestartManager,
  CheckoutManager,
  AnalyticsManager,
  CheckpointManager
} from '../../managers';
import { Proxy } from '../../managers/typings';
import { ShopifyVariant } from '../../shopify/utils/pickVariant';
import { Property } from '../../shopify/utils/forms';

const { ParseType } = Monitor;

const { Types } = TaskConstants;

export type ShopifyProduct = {
  id: number;
  name: string;
  url: string;
  image: string;
  price: string | number;
  properties: Property[];
  variant: ShopifyVariant;
  variants: ShopifyVariant[] | [];
};

export type ShopifyAnswers = {
  name: string;
  value: string;
};

export type ContextObject = {
  id: string;
  task: any;
  group: string;
  type: string;
  parseType?: string;
  taskSession: Session;
  monitorSession: Session;
  proxy: Proxy;
  logger: any; // TODO
  relayMessage: Function;
  captchaManager: CaptchaManager;
  proxyManager: ProxyManager;
  webhookManager: WebhookManager;
  notificationManager: NotificationManager;
  profileManager: ProfileManager;
  restartManager: RestartManager;
  checkoutManager: CheckoutManager;
  analyticsManager: AnalyticsManager;
  checkpointManager: CheckpointManager;
};

export class ShopifyContext {
  id: string;

  ids: string[];

  group: string;

  task: any; // TODO

  type: string;

  parseType: string;

  taskSession: Session;

  monitorSession: Session;

  logger: any; // TODO:

  relayMessage: Function;

  proxy: Proxy | null;

  monitorProxy: Proxy | null;

  lastProxy: Proxy | null;

  lastMonitorProxy: Proxy | null;

  message: string;

  aborted: boolean;

  captchaManager: CaptchaManager;

  proxyManager: ProxyManager;

  webhookManager: WebhookManager;

  notificationManager: NotificationManager;

  restartManager: RestartManager;

  checkoutManager: CheckoutManager;

  profileManager: ProfileManager;

  analyticsManager: AnalyticsManager;

  checkpointManager: CheckpointManager;

  product: ShopifyProduct;

  answers: ShopifyAnswers[];

  captchaToken: string;

  captchaForm: object;

  checkpointCookies: object[];

  accessToken: string;

  shopId: string;

  constructor({
    id,
    group,
    task,
    type = Types.Normal,
    parseType = ParseType.Unknown,
    taskSession,
    monitorSession,
    proxy,
    logger,
    relayMessage,
    captchaManager,
    proxyManager,
    webhookManager,
    profileManager,
    restartManager,
    checkoutManager,
    notificationManager,
    analyticsManager,
    checkpointManager
  }: ContextObject) {
    this.id = id;
    this.ids = [id];
    this.group = group;
    this.task = task;
    this.type = type;
    this.parseType = parseType;
    this.taskSession = taskSession;
    this.monitorSession = monitorSession;
    this.proxy = proxy;
    this.monitorProxy = proxy;
    this.lastProxy = proxy;
    this.lastMonitorProxy = proxy;
    this.message = '';
    this.logger = logger;
    this.relayMessage = relayMessage;
    this.aborted = false;
    this.captchaManager = captchaManager;
    this.proxyManager = proxyManager;
    this.webhookManager = webhookManager;
    this.profileManager = profileManager;
    this.restartManager = restartManager;
    this.checkoutManager = checkoutManager;
    this.notificationManager = notificationManager;
    this.analyticsManager = analyticsManager;
    this.checkpointManager = checkpointManager;

    this.product = {} as ShopifyProduct;

    this.answers = [];

    this.captchaToken = '';
    this.captchaForm = {};
    this.checkpointCookies = [];
    this.accessToken = '';
    this.shopId = '';
  }

  addId(id: string) {
    this.ids.push(id);
  }

  isEmpty() {
    return !this.ids.length;
  }

  hasId(id: string) {
    return this.ids.some(i => i === id);
  }

  removeId(id: string) {
    this.ids = this.ids.filter(i => i !== id);
  }

  setParseType(parseType: string) {
    this.parseType = parseType;
  }

  setLastProxy(lastProxy: Proxy | null) {
    this.lastProxy = lastProxy;
  }

  setProxy(proxy: Proxy | null) {
    this.proxy = proxy;
  }

  setLastMonitorProxy(proxy: Proxy | null) {
    this.lastMonitorProxy = proxy;
  }

  setMonitorProxy(proxy: Proxy | null) {
    this.monitorProxy = proxy;
  }

  setMessage(message: string) {
    this.message = message;
  }

  setLogger(logger: any) {
    this.logger = logger;
  }

  setShopId(shopId: string) {
    this.shopId = shopId;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  setAborted(aborted: boolean) {
    this.aborted = aborted;
  }

  setCaptchaToken(captchaToken: string) {
    this.captchaToken = captchaToken;
    this.captchaForm = {};
  }
}
