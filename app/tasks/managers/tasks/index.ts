/* eslint-disable no-restricted-syntax */
import { isEmpty } from 'lodash';
import { session, BrowserWindow, Session } from 'electron';

import { IPCKeys } from '../../../constants/ipc';

// Shared includes
import { LoggerService, StaggeredQueue } from '../../common/utils';

import {
  CaptchaManager,
  ProxyManager,
  WebhookManager,
  ProfileManager,
  NotificationManager,
  RestartManager,
  CheckoutManager,
  BrowserManager,
  AnalyticsManager,
  CheckpointManager,
  GeetestManager,
  QueueManager,
  InterceptionManager
} from '..';

import { Task } from '../../common/constants';
// Shopify includes
import { Parse } from '../../shopify/utils';

import { Tasks, Monitors, Sessions, Intervals, Messages } from '../typings';
import { createTask } from './choose';

const { getParseType } = Parse;
const { Types } = Task;

export class TaskManager {
  logPath: string;

  mainWindow: BrowserWindow | null;

  startQueue: StaggeredQueue;

  startWorker: Worker | undefined;

  tasks: Tasks;

  monitors: Monitors;

  taskSessions: Sessions;

  monitorSessions: Sessions;

  messages: Messages;

  messageBatchDelay: number;

  messageIntervals: Intervals;

  proxyManager: ProxyManager;

  webhookManager: WebhookManager;

  captchaManager: CaptchaManager;

  profileManager: ProfileManager;

  notificationManager: NotificationManager;

  restartManager: RestartManager;

  checkoutManager: CheckoutManager;

  browserManager: BrowserManager;

  analyticsManager: AnalyticsManager;

  geetestManager: GeetestManager;

  checkpointManager: CheckpointManager;

  queueManager: QueueManager;

  ticketManager: any;

  interceptionManager: InterceptionManager;

  constructor(logPath: string, mainWindow: BrowserWindow | null) {
    // Logger file path
    this.logPath = logPath;

    this.mainWindow = mainWindow;

    // Tasks Map
    this.tasks = {};

    // Monitors Map
    this.monitors = {};

    // Sessions Map
    this.taskSessions = {};
    this.monitorSessions = {};

    this.messages = {};
    this.messageIntervals = {};
    this.messageBatchDelay = 150;

    // proxy related IPC
    this.proxyManager = new ProxyManager(mainWindow);

    // webhook related IPC
    this.webhookManager = new WebhookManager();

    this.notificationManager = new NotificationManager(mainWindow);

    // captcha related IPC
    this.captchaManager = new CaptchaManager(
      mainWindow,
      this.notificationManager
    );

    this.profileManager = new ProfileManager(mainWindow);

    this.restartManager = new RestartManager(mainWindow);

    this.checkoutManager = new CheckoutManager();

    this.browserManager = new BrowserManager();

    this.analyticsManager = new AnalyticsManager();

    this.geetestManager = new GeetestManager();

    this.queueManager = new QueueManager();

    this.checkpointManager = new CheckpointManager();

    this.startQueue = new StaggeredQueue();

    this.interceptionManager = new InterceptionManager();
  }

  process = ({ group, id }: any) => {
    if (this.mainWindow) {
      const task = this.tasks[group][id];
      const monitor = this.monitors[group][id];

      try {
        if (monitor) {
          monitor.run();
        }
        task.run();
      } catch (error) {
        this.stop({ id, group });
      }
    }
  };

  setupMessageInterval = async (group: string) => {
    if (!this.messages[group]) {
      this.messages[group] = {};
    }

    if (!this.messageIntervals[group]) {
      try {
        this.messageIntervals[group] = setInterval(() => {
          if (!this.mainWindow?.webContents) {
            return;
          }

          if (isEmpty(this.messages[group])) {
            return;
          }

          this.mainWindow.webContents.send(
            IPCKeys.TaskStatus,
            group,
            this.messages[group]
          );
          this.messages[group] = {};
        }, this.messageBatchDelay);
      } catch (e) {
        // fail silently...
      }
    }
  };

  stopMessageInterval = (group: string) => {
    // clear out messages before stopping...
    if (this.mainWindow && !isEmpty(this.messages[group])) {
      this.mainWindow.webContents.send(
        IPCKeys.TaskStatus,
        group,
        this.messages[group]
      );
      this.messages[group] = {};
    }

    if (this.messageIntervals[group]) {
      clearInterval(this.messageIntervals[group]);
      delete this.messageIntervals[group];
    }
  };

  stopMessageIntervals = async () => {
    return Promise.all(
      Object.keys(this.messageIntervals).map((group: any) =>
        this.stopMessageInterval(group)
      )
    ).catch(() => {});
  };

  /**
   * Callback for Task Events
   *
   * This method is registered as a callback for all running tasks. The method
   * is used to merge all task events into a single stream, so only one
   * event handler is needed to consume all task events.
   *
   * @param {String} id the id of the task/monitor that emitted the event
   * @param {String} message the status message
   * @param {Task.Event} event the type of event that was emitted
   */
  mergeStatusUpdates = async (
    group: string,
    taskIds: string[],
    message: any
  ) => {
    if (this.mainWindow) {
      Promise.all(
        // eslint-disable-next-line array-callback-return
        [...taskIds].map(id => {
          this.messages[group] = {
            ...this.messages[group],
            [id]: {
              ...this.messages[group][id],
              ...message
            }
          };
        })
      ).catch(() => {});
    }
  };

  /**
   * Changes a delay for a group of tasks
   * @param delay {Number} - numerical value to change the delay to
   * @param type {DelayType} - either a) monitor, or b) retry
   * @param tasks {List} -
   */
  changeDelay = async ({
    delay,
    type,
    group,
    tasks = []
  }: {
    delay: number;
    type: string;
    group: string;
    tasks?: any[];
  }) => {
    // exit early if we don't have any task groups or tasks in the group
    if (isEmpty(this.tasks) || isEmpty(this.tasks[group])) {
      return;
    }

    Promise.all(
      tasks.map((t: any) => {
        const task = this.tasks[group][t.id];
        const monitor = this.monitors[group][t.id];

        if (task) {
          task.context.task[type] = delay;
          if (task.delayer) {
            task.delayer.clear();
          }
        }

        if (monitor) {
          monitor.context.task[type] = delay;

          if (monitor.delayer) {
            monitor.delayer.clear();
          }
        }

        return t;
      })
    ).catch(() => {});
  };

  /**
   * Start a task
   *
   * This method starts a given task if it has not already been started. The
   * requisite data is generated (id, open proxy if it is available, etc.) and
   * starts the task asynchronously.
   *
   * If the given task has already started, this method does nothing.
   * @param {Task} task
   * @param {object} options Options to customize the task:
   *   - type - The task type to start
   */
  start = async ({
    group,
    task,
    type = Types.Normal
  }: {
    group: string;
    task: any;
    type?: string;
  }) => {
    const { id, proxies } = task;

    this.startQueue.removeJob(group, id);

    if (!this.tasks[group]) {
      this.tasks[group] = {};
    }

    if (!this.monitors[group]) {
      this.monitors[group] = {};
    }

    setTimeout(async () => {
      let proxy: any = null;
      if (proxies) {
        proxy = this.proxyManager.reserve({
          id: proxies.id,
          taskId: id
        });
      }

      const taskSession: Session = session.fromPartition(`${id}-task`, {
        cache: false
      });

      await taskSession.closeAllConnections();

      const monitorSession: Session = session.fromPartition(`${id}-monitor`, {
        cache: false
      });

      await monitorSession.closeAllConnections();

      this.taskSessions[id] = taskSession;
      this.monitorSessions[id] = monitorSession;

      await taskSession.clearAuthCache();
      await monitorSession.clearAuthCache();

      await taskSession.clearStorageData();
      await monitorSession.clearStorageData();

      await taskSession.clearCache();
      await monitorSession.clearCache();

      await taskSession.clearHostResolverCache();
      await monitorSession.clearHostResolverCache();

      if (proxy?.ip) {
        const [ip, port] = proxy.ip.split(':');

        await taskSession.setProxy({
          mode: 'fixed_servers',
          proxyRules: `http=${ip}:${port};https=${ip}:${port};`
        });
        await monitorSession.setProxy({
          mode: 'fixed_servers',
          proxyRules: `http=${ip}:${port};https=${ip}:${port};`
        });
      } else {
        await taskSession.setProxy({
          mode: 'fixed_servers',
          proxyRules: ''
        });
        await monitorSession.setProxy({
          mode: 'fixed_servers',
          proxyRules: ''
        });
      }

      await taskSession.forceReloadProxyConfig();
      await monitorSession.forceReloadProxyConfig();

      setTimeout(() => {
        const { _task, _monitor } = createTask({
          task,
          group,
          taskSession,
          monitorSession,
          proxy,
          type,
          logger: LoggerService,
          mainWindow: this.mainWindow,
          relayMessage: this.mergeStatusUpdates,
          captchaManager: this.captchaManager,
          proxyManager: this.proxyManager,
          webhookManager: this.webhookManager,
          profileManager: this.profileManager,
          notificationManager: this.notificationManager,
          restartManager: this.restartManager,
          checkoutManager: this.checkoutManager,
          analyticsManager: this.analyticsManager,
          browserManager: this.browserManager,
          geetestManager: this.geetestManager,
          queueManager: this.queueManager,
          checkpointManager: this.checkpointManager,
          interceptionManager: this.interceptionManager
        });

        if (!_task) {
          return;
        }

        if (_monitor) {
          this.monitors[group][id] = _monitor;
        }

        this.tasks[group][id] = _task;

        this.setupMessageInterval(group);

        return this.startQueue.add(group, id, this.process);
      }, 500);
    }, 0);
  };

  /**
   * Start multiple tasks
   *
   * This method is a convenience method to start multiple tasks
   * with a single call. The `start()` method is called for all
   * tasks in the given list.
   *
   * @param {List<Task>} tasks list of tasks to start
   * @param {object} options Options to customize the task:
   *   - type - The task type to start
   */
  startAll = async ({ group, tasks }: { group: string; tasks: any[] }) => {
    const promises = tasks.map(task => this.start({ group, task }));
    return Promise.allSettled(promises).catch(() => {});
  };

  /**
   * Stop a task
   *
   * This method stops a given task if it is running. This is done by sending
   * an abort signal to force the task to stop and cleanup anything it needs
   * to.
   *
   * This method does nothing if the given task has already stopped or
   * if it was never started.
   *
   * @param {Task} task the task to stop
   */
  stop = async ({ id, group }: { id: string; group: string }) => {
    this.startQueue.removeJob(group, id);

    const task = this.tasks[group][id];
    if (!task) {
      return null;
    }

    delete this.tasks[group][id];

    const taskSession = this.taskSessions[id];
    if (taskSession) {
      await Promise.allSettled([
        taskSession.clearCache(),
        taskSession.clearStorageData()
      ]).catch(console.error);
      delete this.taskSessions[id];
    }

    const monitorSession = this.monitorSessions[id];
    if (monitorSession) {
      await Promise.allSettled([
        monitorSession.clearCache(),
        monitorSession.clearStorageData()
      ]).catch(console.error);
      delete this.monitorSessions[id];
    }

    try {
      task.abort();
    } catch (e) {
      // fail silently...
    }

    // if we're just stopping a rate task, return early..
    if (id === 'RATE_FETCHER') {
      return true;
    }

    // emit an event to set the task's proxy to !inUse
    if (this.mainWindow && task.context?.proxy) {
      this.mainWindow.webContents.send(
        IPCKeys.ProxyStatus,
        id,
        task.context.task.proxies.id,
        task.context.proxy.ip,
        false
      );
    }

    const monitor: any = Object.values(this.monitors[group]).find((m: any) =>
      m.context.hasId(id)
    );

    try {
      monitor.stop(id);
    } catch (e) {
      // fail silently...
    }

    if (isEmpty(this.tasks[group])) {
      this.stopMessageInterval(group);
    }

    return this._cleanup(group, task, monitor);
  };

  /**
   * Stop multiple tasks
   *
   * This method is a convenience method to stop multiple tasks
   * with a single call. The `stop()` method is called for all
   * tasks in the given list.
   *
   * @param {List<Task>} tasks list of tasks to stop
   * @param {Map} options options associated with stopping tasks
   */
  async stopAll({ group, tasks }: { group: string; tasks: any[] }) {
    const promises = tasks.map(({ id }: { id: string }) =>
      this.stop({ id, group })
    );
    return Promise.allSettled(promises).catch(() => {});
  }

  async update(group: string, task: any) {
    const { id } = task;

    const taskGroup = this.tasks[group];
    const monitorGroup = this.monitors[group];
    if (!taskGroup || !monitorGroup) {
      return;
    }

    const oldTask = taskGroup[id];
    const monitor = monitorGroup[id];

    // we need to hard restart the task in these cases
    if (oldTask?.context?.task?.store?.url !== task.store.url) {
      this.stop({ group, id });
      return this.start({ group, task });
    }

    if (!monitor) {
      return;
    }

    const parseType = getParseType(task.product);
    oldTask.context.task = task;
    oldTask.context.parseType = parseType;
    monitor.context.task = task;
    monitor.context.parseType = parseType;

    if (monitor.delayer) {
      monitor.delayer.clear();
    }
  }

  async updateAll(group: string, tasks: any[]) {
    return Promise.all([...tasks].map(t => this.update(group, t)));
  }

  async _cleanup(group: string, task: any, monitor: any) {
    const { context: taskContext } = task;

    if (monitor) {
      const { context: monitorContext } = monitor;

      if (!monitorContext.ids.length) {
        delete this.monitors[group][monitorContext.id];
      }
    }

    return taskContext.id;
  }
}
