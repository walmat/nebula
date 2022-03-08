/* eslint-disable camelcase */

import { Session } from 'electron';
import { CookieJar } from 'tough-cookie';
import HttpsProxyAgent from 'https-proxy-agent';

import { Monitor } from '../constants';
import {
  CaptchaManager,
  ProxyManager,
  WebhookManager,
  ProfileManager,
  NotificationManager,
  RestartManager,
  CheckoutManager,
  AnalyticsManager,
  QueueManager
} from '../../managers';
import { Proxy } from '../../managers/typings';
import { Variant } from '../../footsites/classes/types/variant';
import { Price } from '../../footsites/classes/types/stock';

const { ParseType } = Monitor;

export type FootsiteProduct = {
  id: number;
  name: string;
  url: string;
  image: string;
  sku: string;
  size: string;
  price: Price;
  variant: Variant;
  variants: Variant[] | [];
};

export type ContextObject = {
  id: string;
  task: any;
  group: string;
  parseType: string;
  taskSession: Session;
  monitorSession: Session;
  proxy: Proxy;
  logger: any; // TODO
  relayMessage: Function;
  captchaManager: CaptchaManager;
  proxyManager: ProxyManager;
  webhookManager: WebhookManager;
  profileManager: ProfileManager;
  notificationManager: NotificationManager;
  restartManager: RestartManager;
  checkoutManager: CheckoutManager;
  analyticsManager: AnalyticsManager;
  queueManager: QueueManager;
  cookieJar?: CookieJar;
};

export class FootsiteContext {
  id: string;

  ids: string[];

  group: string;

  task: any; // TODO

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

  profileManager: ProfileManager;

  notificationManager: NotificationManager;

  restartManager: RestartManager;

  checkoutManager: CheckoutManager;

  analyticsManager: AnalyticsManager;

  queueManager: QueueManager;

  product: FootsiteProduct;

  captchaToken: string;

  flSessionId: string;

  cookieJar: CookieJar;

  agent: ReturnType<typeof HttpsProxyAgent> | null;

  constructor({
    id,
    task,
    group,
    parseType = ParseType.Variant,
    taskSession,
    monitorSession,
    proxy,
    logger,
    relayMessage,
    captchaManager,
    proxyManager,
    webhookManager,
    profileManager,
    notificationManager,
    restartManager,
    checkoutManager,
    analyticsManager,
    queueManager,
    cookieJar = new CookieJar()
  }: ContextObject) {
    this.id = id;
    this.ids = [id];
    this.group = group;
    this.task = task;
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
    this.notificationManager = notificationManager;
    this.restartManager = restartManager;
    this.checkoutManager = checkoutManager;
    this.analyticsManager = analyticsManager;
    this.queueManager = queueManager;

    this.cookieJar = cookieJar;

    this.agent = null;

    this.product = {} as FootsiteProduct;

    this.captchaToken = '';
    this.flSessionId = '';
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

  setAborted(aborted: boolean) {
    this.aborted = aborted;
  }

  setCaptchaToken(captchaToken: string) {
    this.captchaToken = captchaToken;
  }
}
