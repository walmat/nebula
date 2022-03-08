import { isEmpty } from 'lodash';

import { ipcMain, IpcMainInvokeEvent, BrowserWindow } from 'electron';
import { IPCKeys } from '../constants/ipc';
import { Proxy } from '../components/Proxies/reducers/current';

import { testProxy } from '../utils/testProxies';
import { StaggeredQueue } from '../tasks/common/utils';

export default class ProxyTester {
  mainWindow: BrowserWindow | null;

  hasLogged: boolean;

  queue: StaggeredQueue;

  results: {
    [group: string]: {
      [ip: string]: {
        speed: number | 'failed';
      };
    };
  };

  interval: {
    [id: string]: any;
  };

  constructor(mainWindow: BrowserWindow | null) {
    this.queue = new StaggeredQueue(false, 20);

    this.hasLogged = false;

    this.mainWindow = mainWindow;

    this.results = {};

    this.interval = {};

    ipcMain.on(IPCKeys.RequestTestProxy, this.insert);
  }

  process = async ({ group, id, url }: any) => {
    if (this.mainWindow) {
      const time = await testProxy(url, id);
      if (!this.results[group]) {
        this.results[group] = {};
      }

      this.results[group][id] = time;
    }
  };

  start = (group: string) => {
    if (!this.interval[group]) {
      this.interval[group] = setInterval(() => {
        if (isEmpty(this.results[group])) {
          return;
        }

        if (this.mainWindow) {
          this.mainWindow.webContents.send(
            IPCKeys.ResponseTestProxy,
            group,
            this.results[group]
          );
          this.results[group] = {};
        }
      }, 1000);
    }
  };

  stop = (group: string) => {
    if (this.interval[group]) {
      clearInterval(this.interval[group]);
      this.interval[group] = null;
    }
  };

  clear = () => {
    this.queue.clear();

    return Object.keys(this.results).map((id: string) => this.stop(id));
  };

  remove = (group: string, ip: string) => {
    this.queue.removeJob(group, ip);
  };

  insert = (
    _: IpcMainInvokeEvent,
    id: string,
    url: string,
    proxies: Proxy[]
  ) => {
    const promises = proxies.map(({ ip }) =>
      this.queue.add(id, ip, this.process, { url })
    );

    this.start(id);

    Promise.all(promises).catch(() => {});
  };
}
