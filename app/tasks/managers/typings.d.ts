import { WebhookClient } from 'discord.js';
import { Session } from 'electron';

import { AycdClient } from './webhook/aycd';
import { AsyncQueue, Queue } from '../common/utils';
import { ShopifyMonitor, RateFetcher } from '../shopify';
import { FastTask } from '../shopify/classes/tasks/fast';
import { SafeTask } from '../shopify/classes/tasks/safe';
import { PreloadTask } from '../shopify/classes/tasks/preload';
import { BaseFootsiteTask } from '../footsites/classes/tasks/base';
import { YeezySupplyTask } from '../yeezysupply/classes/tasks/base';

type Proxies = {
  [key: string]: Queue;
};

type ProxyGroup = {
  id: string;
  selected: boolean;
  name: string;
  proxies: Proxy[];
};

type Proxy = {
  ip: string;
  proxy?: string;
  selected: boolean;
  speed: null | number;
  inUse: boolean;
};

type RegisterProps = {
  id: string;
  proxies: Proxy[];
};

type DeregisterProps = {
  id: string;
};

type ReserveProps = {
  id: string;
  taskId: string;
};

type SwapProps = {
  id: string;
  proxy: Proxy | null;
  group: string;
};

type TestProps = {
  id: string;
  type: string;
};

type Webhook = {
  client: WebhookClient | AycdClient;
  id: string;
  name: string;
  url: string;
  declines: boolean;
  type: string;
};

type WebhookData = {
  idempotency?: string;
  success?: boolean;
  date?: Date | string | number;
  user?: string;
  version?: string;
  url?: string;
  mode: string;
  proxy?: string;
  quantity?: string;
  product: {
    name: string;
    price: string;
    image: string;
    size: string;
    url: string;
  };
  store: {
    name: string;
    url: string;
  };
  delays: {
    monitor: string | number;
    retry: string | number;
    checkout?: string | number;
  };
  profile: {
    name: string;
    type: string;
  };
};

type Webhooks = {
  [key: string]: Webhook;
};

type CaptchaQueues = {
  [key: string]: AsyncQueue;
};

type Sessions = {
  [key: string]: Session;
};

type Messages = {
  [group: string]: {
    [id: string]: {
      [prop: string]: string;
    };
  };
};

type Intervals = {
  [group: string]: number;
};

type Tasks = {
  [group: string]: {
    [id: string]:
      | FastTask
      | SafeTask
      | PreloadTask
      | SafeTask
      | FastTask
      | YeezySupplyTask
      | BaseFootsiteTask
      | RateFetcher;
  };
};

type Monitors = {
  [group: string]: {
    [id: string]: ShopifyMonitor;
  };
};
