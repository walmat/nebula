import AbortController from 'abort-controller';

import { ClientRequest } from 'electron';
import { ClearablePromise } from 'delay';
import { Context } from '../contexts';
import { Monitor } from '../constants';
import { waitForDelay } from '../utils';

const { States } = Monitor;

export class BaseMonitor {
  context: Context;

  aborter: AbortController;

  platform: string;

  delayer: ClearablePromise<void> | null;

  current: ClientRequest | ClientRequest[] | null;

  history: any;

  state: string;

  prevState: string;

  stateOverride: any;

  tries: number;

  override: boolean;

  constructor(context: Context, state: string, platform: string) {
    this.context = context;
    this.aborter = new AbortController();
    this.platform = platform;
    this.delayer = null;

    this.current = null;
    this.state = state;
    this.prevState = state;
    this.stateOverride = null;

    this.tries = 0;

    this.override = false;
  }

  async swapProxies() {
    const { id, monitorProxy, task, proxyManager } = this.context;
    let newProxy = monitorProxy;
    try {
      newProxy = await proxyManager.swap({
        id,
        proxy: monitorProxy,
        group: task.proxies.id
      });
    } catch (e) {
      // fail silently...
    }
    return newProxy;
  }

  async swap() {
    const { id, logger, monitorSession, lastMonitorProxy } = this.context;
    try {
      const proxy = await this.swapProxies();

      const formatProxy = (proxy: string) => {
        const splitProxy = proxy.split('@');
        return splitProxy[splitProxy.length - 1];
      };

      logger.log({
        id,
        level: 'debug',
        message: `Using proxy: ${proxy ? proxy.proxy : 'localhost'}`
      });

      if (proxy?.proxy === lastMonitorProxy?.proxy) {
        this.context.setMonitorProxy(null);
        monitorSession.setProxy({ proxyRules: '' });

        logger.log({
          id,
          level: 'debug',
          message: `Rewinding to state: ${this.prevState}`
        });

        return this.prevState;
      }

      this.context.setLastMonitorProxy(this.context.monitorProxy);
      this.context.setMonitorProxy(proxy);

      if (proxy?.proxy) {
        monitorSession.setProxy({ proxyRules: formatProxy(proxy.proxy) });
      } else {
        monitorSession.setProxy({ proxyRules: '' });
      }

      logger.log({
        id,
        level: 'debug',
        message: `Rewinding to state: ${this.prevState}`
      });

      return this.prevState;
    } catch (error) {
      logger.log({
        id,
        level: 'error',
        message: `Error swapping proxies: ${error.toString()}`
      });
    }
    return this.prevState;
  }

  async handleStepLogic(_: any): Promise<string> {
    throw new Error('Monitor step logic should be implemented in subclass!');
  }

  async loop() {
    let nextState = this.state;

    const {
      id,
      aborted,
      logger,
      task: { retry }
    } = this.context;

    if (aborted) {
      nextState = States.ABORT;
      return true;
    }

    if (this.stateOverride) {
      this.state = this.stateOverride;
      this.stateOverride = null;
    }

    try {
      nextState = await this.handleStepLogic(this.state);
    } catch (e) {
      if (!/aborterror/i.test(e.name)) {
        logger.log({
          id,
          level: 'error',
          message: `Monitor error: ${e.toString()}`
        });

        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;
      }
    }

    if (this.state !== nextState) {
      this.prevState = this.state;
      this.state = nextState;
    }

    if (nextState === States.ABORT) {
      return true;
    }

    if (this.stateOverride) {
      this.state = this.stateOverride;
      this.stateOverride = null;
    }

    return false;
  }

  stop(id: string) {
    if (!this.context.hasId(id)) {
      return;
    }

    this.context.removeId(id);

    if (this.context.isEmpty()) {
      this.context.setAborted(true);
      this.stateOverride = States.ABORT;

      if (this.aborter) {
        this.aborter.abort();
      }

      if (this.current) {
        if (this.current instanceof Array) {
          this.current.map(c => c.abort());
        } else {
          this.current.abort();
        }
      }
      if (this.delayer) {
        this.delayer.clear();
      }
    }
  }

  async run() {
    const { monitorSession } = this.context;

    let shouldStop = false;

    do {
      // eslint-disable-next-line no-await-in-loop
      shouldStop = await this.loop();
    } while (this.state !== States.ABORT && !shouldStop);

    try {
      await monitorSession.closeAllConnections();
    } catch (e) {
      // noop.
    }
  }
}
