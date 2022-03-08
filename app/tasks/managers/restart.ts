import { BrowserWindow, ipcMain } from 'electron';

import { settingsStorage } from '../../utils/storageHelper';

import { IPCKeys } from '../../constants/ipc';

export class RestartManager {
  autoRestart: boolean;

  mainWindow: BrowserWindow | null;

  constructor(mainWindow: BrowserWindow | null) {
    this.autoRestart = settingsStorage.getItem('enableAutoRestart') || false;

    this.mainWindow = mainWindow;

    ipcMain.on(IPCKeys.ToggleAutoRestart, (_, value: boolean) => {
      this.autoRestart = value;
    });
  }

  restart = () => this.autoRestart;
}
