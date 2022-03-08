import AbortController from 'abort-controller';
import { ClientRequest } from 'electron';

import { ClearablePromise } from 'delay';

import { Task } from '../constants';
import { waitForDelay, CapacityQueue, emitEvent } from '../utils';
import { Context } from '../contexts';

const { States } = Task;

export class BaseTask {
  context: Context;

  aborter: AbortController;

  platform: string;

  delayer: ClearablePromise<void> | null;

  current: ClientRequest | null;

  history: CapacityQueue;

  state: string;

  prevState: string;

  stateOverride: string | null;

  webhookSent: boolean;

  tries: number;

  captchaFinished: boolean;

  anticrack: boolean;

  constructor(context: Context, state: string, platform: string) {
    this.context = context;
    this.aborter = new AbortController();
    this.platform = platform;
    this.delayer = null;

    // add task to checkout management
    if (this.context.task.oneCheckout) {
      this.context.checkoutManager.insert({
        context: this.context,
        abort: this.stop
      });
    }

    this.current = null;
    this.history = new CapacityQueue();
    this.webhookSent = false;

    this.tries = 0;

    this.state = state;
    this.prevState = state;
    this.stateOverride = null;

    this.anticrack = false;
    this.captchaFinished = false;
  }

  remove = async () => {
    const { id, taskSession, captchaManager, questionManager } = this.context;

    try {
      await taskSession.closeAllConnections();
    } catch (e) {
      // noop.
    }

    if (questionManager) {
      questionManager.remove({ id });
    }

    captchaManager.remove({ id, platform: this.platform });
  };

  // c1x todo: fix typing
  harvest = async ({ token }: { token: string }) => {
    this.context.captchaToken = token;
  };

  retrieveProfile() {
    const {
      profileManager,
      task: {
        profile: { id }
      }
    } = this.context;

    return profileManager.retrieve(id);
  }

  async swapProxies() {
    const { id, proxy, task, proxyManager } = this.context;
    let newProxy = proxy;
    try {
      newProxy = await proxyManager.swap({ id, proxy, group: task.proxies.id });
    } catch (e) {
      // fail silently...
    }
    return newProxy;
  }

  formatProxy = (proxy: string) => {
    const splitProxy = proxy.split('@');
    return splitProxy[splitProxy.length - 1];
  };

  swap = async () => {
    const { id, aborted, logger, taskSession, lastProxy } = this.context;
    if (aborted) {
      return States.ABORT;
    }

    try {
      const proxy = await this.swapProxies();

      logger.log({
        id,
        level: 'silly',
        message: `Using proxy: ${proxy ? proxy.proxy : 'localhost'}`
      });

      if (proxy?.proxy === lastProxy?.proxy) {
        this.context.setProxy(null);
        taskSession.setProxy({ proxyRules: '' });

        logger.log({
          id,
          level: 'debug',
          message: `Rewinding to state: ${this.prevState}`
        });

        return this.prevState;
      }

      this.context.setLastProxy(this.context.proxy);
      this.context.setProxy(proxy);

      if (proxy?.proxy) {
        taskSession.setProxy({ proxyRules: this.formatProxy(proxy.proxy) });
      } else {
        taskSession.setProxy({ proxyRules: '' });
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
        message: `Error swapping proxies: ${(error as any).toString()}`
      });
    }
    return this.prevState;
  };

  async waitForCaptcha(message = 'Checkout captcha', autoRemove = false) {
    const { id, aborted } = this.context;
    if (aborted) {
      return States.ABORT;
    }

    emitEvent(this.context, [id], { message });

    if (this.captchaFinished) {
      this.captchaFinished = false;
      return States.DONE;
    }

    if (!this.context.captchaToken) {
      this.delayer = waitForDelay(500, this.aborter.signal);
      await this.delayer;

      return States.CAPTCHA;
    }

    if (autoRemove) {
      setTimeout(() => {
        this.context.setCaptchaToken('');
      }, 118000);
    }

    return States.DONE;
  }

  async handleStepLogic(_: any): Promise<string> {
    throw new Error('Task step logic should be implemented in subclass!');
  }

  async noop() {
    const { id } = this.context;

    emitEvent(this.context, [id], { message: 'Submitting payment' });

    this.delayer = waitForDelay(12500, this.aborter.signal);
    await this.delayer;

    emitEvent(this.context, [id], {
      message: 'Error submitting payment [TIMEOUT]'
    });

    this.delayer = waitForDelay(500, this.aborter.signal);
    await this.delayer;

    return States.NOOP;
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
      if (!/aborterror/i.test((e as any).name)) {
        logger.log({
          id,
          level: 'error',
          message: `Task error: ${(e as any).toString()}`
        });
      }

      try {
        this.delayer = waitForDelay(retry, this.aborter.signal);
        await this.delayer;
      } catch (e) {
        // noop...
      }
    }

    if (this.state !== nextState) {
      this.prevState = this.state;
      this.state = nextState;

      this.history.insert(nextState);
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

  async run() {
    const {
      id,
      logger,
      task: { mode }
    } = this.context;

    logger.log({
      id,
      level: 'info',
      message: `Starting ${mode} task`
    });

    let shouldStop = false;
    do {
      // eslint-disable-next-line no-await-in-loop
      shouldStop = await this.loop();
    } while (this.state !== States.DONE && !shouldStop);

    // remove logger ref
    logger.remove(id);

    // remove captcha requester
    await this.remove();

    logger.log({
      id,
      level: 'silly',
      message: `States: ${this.history.toString()}`
    });
  }

  stop = () => {
    this.context.setAborted(true);
    this.stateOverride = States.ABORT;

    this.context.checkoutManager.remove({ context: this.context });

    if (this.aborter) {
      this.aborter.abort();
    }

    if (this.current) {
      this.current.abort();
    }

    if (this.delayer) {
      this.delayer.clear();
    }
  };

  abort() {
    this.context.setAborted(true);
    this.stateOverride = States.ABORT;

    this.context.checkoutManager.remove({ context: this.context });

    if (this.aborter) {
      this.aborter.abort();
    }

    if (this.current) {
      this.current.abort();
    }

    if (this.delayer) {
      this.delayer.clear();
    }
  }
}
