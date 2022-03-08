import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPCKeys } from '../../../constants/ipc';
import { createCacheWindow, WindowStates } from './windows';
import { PATHS } from '../../../utils/paths';

type Products = {
  [id: string]: any;
};

type Window = {
  id: number;
  window: BrowserWindow | null;
  state: string;
};

export class CacheManager {
  mainWindow: BrowserWindow | null;

  window: Window;

  products: Products;

  constructor(mainWindow: BrowserWindow | null) {
    this.mainWindow = mainWindow;

    this.window = {
      id: 0,
      state: WindowStates.CLOSE,
      window: null
    };

    this.products = {};

    ipcMain.handle(IPCKeys.LaunchCacheWindow, this.launch);
  }

  launch = (_: IpcMainInvokeEvent) => {
    if (this.window.window) {
      const { window } = this.window;
      window.show();
      window.focus();

      return;
    }

    this.window.state = WindowStates.LOAD;

    const window = createCacheWindow();
    this.window.window = window;
    this.window.id = window.id;

    window.loadURL(`${PATHS.cacheUrlPath}`);

    window.once('ready-to-show', () => {
      window.show();

      this.window.state = WindowStates.READY;
    });
  };
}
