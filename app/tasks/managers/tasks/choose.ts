import { BrowserWindow, Session } from 'electron';
import { Task, Monitor, Platforms } from '../../common/constants';
import { Parse } from '../../shopify/utils';

// Shopify includes
import { ShopifyMonitor, RateFetcher, chooseShopifyTask } from '../../shopify';

// YeezySupply includes
import { chooseYeezySupplyTask } from '../../yeezysupply';

// Footsites includes
import { chooseFootsiteTask } from '../../footsites';

// Pokemon includes
import { choosePokemonTask } from '../../pokemon';

import {
  ShopifyContext,
  YeezySupplyContext,
  FootsiteContext,
  PokemonContext
} from '../../common/contexts';
import { Proxy } from '../typings';
import {
  ProxyManager,
  CaptchaManager,
  WebhookManager,
  ProfileManager,
  NotificationManager,
  RestartManager,
  CheckoutManager,
  BrowserManager,
  GeetestManager,
  QueueManager,
  InterceptionManager,
  CheckpointManager
} from '..';
import { AnalyticsManager } from '../analytics';

const { getParseType } = Parse;
const { ParseType } = Monitor;
const { Types } = Task;

type CreateProps = {
  task: any;
  group: string;
  taskSession: Session;
  monitorSession: Session;
  proxy: Proxy;
  type: string;
  logger: any; // todo
  mainWindow: BrowserWindow | null;
  relayMessage: any;
  captchaManager: CaptchaManager;
  proxyManager: ProxyManager;
  webhookManager: WebhookManager;
  profileManager: ProfileManager;
  notificationManager: NotificationManager;
  restartManager: RestartManager;
  checkoutManager: CheckoutManager;
  analyticsManager: AnalyticsManager;
  browserManager: BrowserManager;
  geetestManager: GeetestManager;
  queueManager: QueueManager;
  checkpointManager: CheckpointManager;
  interceptionManager: InterceptionManager;
};

export const createTask = ({
  task,
  group,
  taskSession,
  monitorSession,
  proxy,
  type,
  logger,
  mainWindow,
  relayMessage,
  captchaManager,
  proxyManager,
  webhookManager,
  profileManager,
  notificationManager,
  restartManager,
  checkoutManager,
  analyticsManager,
  browserManager,
  geetestManager,
  queueManager,
  checkpointManager,
  interceptionManager
}: CreateProps) => {
  let _task;
  let _monitor;

  const { platform, id } = task;

  switch (platform) {
    case Platforms.Shopify: {
      const parseType = getParseType(task.product);

      const context = new ShopifyContext({
        id,
        task,
        group,
        type,
        parseType,
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
        checkpointManager
      });

      if (type === Types.Normal) {
        _monitor = new ShopifyMonitor(context);
        const ShopifyTask = chooseShopifyTask(task.mode);
        _task = ShopifyTask(context);
      } else if (type === Types.Rates) {
        _task = new RateFetcher(context, mainWindow);
      }
      break;
    }

    case Platforms.YeezySupply: {
      const context = new YeezySupplyContext({
        id,
        task,
        group,
        parseType: ParseType.Variant,
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
        browserManager,
        analyticsManager,
        interceptionManager
      });

      const YeezySupplyTask = chooseYeezySupplyTask();
      _task = YeezySupplyTask(context);
      break;
    }

    case Platforms.Pokemon: {
      const context = new PokemonContext({
        id,
        task,
        group,
        parseType: ParseType.Variant,
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
        geetestManager
      });

      const PokemonTask = choosePokemonTask();
      _task = PokemonTask(context);
      break;
    }

    case Platforms.Footsites: {
      const context = new FootsiteContext({
        id,
        task,
        group,
        parseType: ParseType.Variant,
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
        queueManager
      });

      const FootsiteTask = chooseFootsiteTask();
      _task = FootsiteTask(context);
      break;
    }
    default:
      break;
  }

  return { _task, _monitor };
};
