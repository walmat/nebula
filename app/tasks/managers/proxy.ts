import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import {
  RegisterProps,
  DeregisterProps,
  ReserveProps,
  SwapProps,
  ProxyGroup,
  Proxy
} from './typings';
import { IPCKeys } from '../../constants/ipc';
import { format, Queue } from '../common/utils';

import { IS_DEV } from '../../constants/env';

type Proxies = {
  [key: string]: Queue;
};

export class ProxyManager {
  mainWindow: BrowserWindow | null;

  proxies: Proxies;

  constructor(mainWindow: BrowserWindow | null) {
    this.mainWindow = mainWindow;
    this.proxies = {};

    ipcMain.on(IPCKeys.AddProxies, this.registerAll);
    ipcMain.on(IPCKeys.RemoveProxies, this.deregisterAll);
  }

  /**
   * Registers a proxy group on the main process
   * @param id - proxy group id
   * @param proxies - list of proxies
   */
  register = async ({ id, proxies }: RegisterProps) => {
    const queue = new Queue();
    this.proxies[id] = queue;

    // prevent multiple logs happening over and over again
    let logged = false;

    return Promise.all(
      proxies.map((p: Proxy) => {
        if (!IS_DEV && /^127/.test(p.ip) && !logged) {
          logged = true;
          return null;
        }

        const proxy = format(p.ip);
        if (!proxy) {
          return null;
        }

        return queue.enqueue({ ...p, proxy });
      })
    );
  };

  /**
   * Deregisters a previously registered group from the main process
   * @param id - proxy group id
   */
  deregister = async ({ id }: DeregisterProps) => {
    const group = this.proxies[id];
    if (!group) {
      return;
    }

    delete this.proxies[id];
  };

  /**
   *
   * @param id - proxy group id
   * @param taskId - task id
   */
  reserve = ({ id, taskId }: ReserveProps) => {
    const queue = this.proxies[id];
    if (!queue) {
      return null;
    }

    const proxy = queue.dequeue();

    // we're out of proxies, return null
    if (!proxy) {
      return null;
    }

    if (this.mainWindow) {
      this.mainWindow.webContents.send(
        IPCKeys.ProxyStatus,
        taskId,
        id,
        proxy.ip,
        true
      );
    }

    // push the reserved proxy back to the end of the queue
    queue.enqueue(proxy);
    return proxy;
  };

  swap = async ({ id, proxy, group }: SwapProps) => {
    const swapped = this.reserve({ id: group, taskId: id });
    if (!swapped) {
      return null;
    }

    // send an event to the frontend to change inUse status of old proxy
    if (this.mainWindow && proxy) {
      this.mainWindow.webContents.send(
        IPCKeys.ProxyStatus,
        id,
        group,
        proxy.ip,
        false
      );
    }

    return swapped;
  };

  /**
   * Registers a list or singular proxy group object on the main process
   * @param proxies - Proxy/Proxies group(s) to register
   */
  registerAll = (_: IpcMainEvent, proxies: ProxyGroup[] | ProxyGroup) => {
    if (Array.isArray(proxies)) {
      return Promise.all(proxies.map(p => this.register(p)));
    }
    return this.register(proxies);
  };

  /**
   * Deregisters a previously loaded proxy group (or groups) from the main process
   * @param proxies - Proxy/Proxies group(s) to deregister
   */
  deregisterAll = (_: IpcMainEvent, proxies: ProxyGroup[] | ProxyGroup) => {
    if (Array.isArray(proxies)) {
      return Promise.all(proxies.map(p => this.deregister(p)));
    }
    return this.deregister(proxies);
  };
}
