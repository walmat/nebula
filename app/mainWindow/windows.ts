/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

import { BrowserWindow, app, ipcMain, dialog, shell } from 'electron';
import { join, resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';

// internals
import { baseName, PATHS } from '../utils/paths';
import { log } from '../utils/log';
import MenuBuilder from '../menu';
import { isPackaged } from '../utils/isPackaged';

// classes
import AppUpdate from '../classes/AppUpdate';
import ProxyTester from '../classes/ProxyTester';
import { TaskManager } from '../tasks';
import { Task } from '../tasks/common/constants';

// constants
import { mailToInstructions as _mailToInstructions } from '../constants';
import { IPCKeys } from '../constants/ipc';
import { IS_DEV } from '../constants/env';
import { APP_TITLE } from '../constants/meta';

let mainWindow: BrowserWindow | null;
let loggerInterval: any = null;
let taskManager: TaskManager;
let autoAppUpdate: AppUpdate;
let proxyTester: ProxyTester;

const { logFile } = PATHS;

export const getMainWindow = () => {
  if (mainWindow) {
    return mainWindow;
  }

  return null;
};

export const getProxytester = () => {
  return proxyTester;
};

app.on('second-instance', () => {
  if (!mainWindow) {
    return;
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  mainWindow.focus();
});

app.on('before-quit', () => {
  try {
    clearInterval(loggerInterval);
    loggerInterval = null;
  } catch (err) {
    log.error(err, 'windows -> before-quit');
  }
});

ipcMain.handle(IPCKeys.GetCurrentWindow, (_, action) => {
  const focused = BrowserWindow.getFocusedWindow();
  switch (action) {
    case 'close':
      if (focused) {
        focused.close();
      }
      break;

    case 'minimize':
      if (focused) {
        focused.minimize();
      }
      break;

    case 'maximize':
      if (focused) {
        if (!focused.isMaximized()) {
          return focused.maximize();
        }

        focused.unmaximize();
      }
      break;

    case 'reload':
      if (focused) {
        focused.reload();
      }
      break;

    default:
      console.warn(`Unknown window action: ${action}`);
      break;
  }
});

export async function createMainWindow() {
  try {
    mainWindow = await createWindow();

    ipcMain.on(IPCKeys.QuitApp, () => {
      app.quit();
    });

    ipcMain.handle(IPCKeys.GetVersion, () => app.getVersion());

    ipcMain.handle(IPCKeys.GetLogPath, () => {
      const { getPath } = app;
      const desktopPath = getPath('desktop');
      const zippedLogFileBaseName = `${baseName(logFile)}.gz`;
      const logFileZippedPath = resolve(
        join(desktopPath, `./${zippedLogFileBaseName}`)
      );
      const mailToInstructions = _mailToInstructions(zippedLogFileBaseName);

      return {
        mailToInstructions,
        logFile,
        logFileZippedPath
      };
    });

    ipcMain.handle(
      IPCKeys.ShowOpenDialog,
      async (_, { title, filters, json = false, path = false }: any) => {
        try {
          const response = await dialog.showOpenDialog({
            title,
            defaultPath: app.getPath('documents'),
            buttonLabel: 'Import',
            filters,
            properties: ['openFile']
          });

          if (
            !response ||
            (response && !response.filePaths) ||
            (response && response.canceled)
          ) {
            throw new Error('Canceled!');
          }

          if (path) {
            return { success: true, data: response.filePaths[0] };
          }

          const raw = readFileSync(response.filePaths[0], { encoding: 'utf8' });

          if (json) {
            const data = JSON.parse(raw);
            if (!data) {
              throw new Error('Malformed state');
            }

            return { success: true, data };
          }

          return { success: true, data: raw };
        } catch (error) {
          return { error };
        }
      }
    );

    ipcMain.handle(IPCKeys.OpenUrl, (_, { url }) => {
      return shell.openExternal(url);
    });

    ipcMain.handle(
      IPCKeys.SaveDialog,
      async (_, { title, filters, state }: any) => {
        try {
          const response = await dialog.showSaveDialog({
            title,
            defaultPath: app.getPath('documents'),
            buttonLabel: 'Export',
            filters
          });

          if (
            !response ||
            (response && !response.filePath) ||
            (response && response.canceled)
          ) {
            throw new Error('Canceled!');
          }

          const { filePath } = response;
          if (filePath) {
            writeFileSync(filePath, JSON.stringify(state));
            return { success: true };
          }

          return { success: false };
        } catch (error) {
          return { error };
        }
      }
    );

    ipcMain.handle(IPCKeys.GetAllWindows, () => {
      return BrowserWindow.getAllWindows();
    });

    proxyTester = new ProxyTester(mainWindow);
    taskManager = new TaskManager(app.getPath('documents'), mainWindow);

    let appUpdaterEnable = true;
    if (isPackaged) {
      if (process.platform === 'darwin') {
        appUpdaterEnable = app.isInApplicationsFolder();
      }

      autoAppUpdate = new AppUpdate();
      autoAppUpdate.init();

      setTimeout(() => autoAppUpdate.checkForUpdates(), 6000);
    }

    const menuBuilder = new MenuBuilder({
      mainWindow,
      autoAppUpdate,
      appUpdaterEnable
    });
    menuBuilder.buildMenu();
  } catch (e) {
    log.error(e, `main.dev -> transition to main`);
  }
}

export const createWindow = async () => {
  try {
    ipcMain.on(IPCKeys.FocusMainWindow, async () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });

    ipcMain.on(IPCKeys.StartTasks, async (_, { group, tasks }) => {
      try {
        if (Array.isArray(tasks)) {
          taskManager.startAll({ group, tasks });
        } else {
          taskManager.start({ group, task: tasks });
        }
      } catch (e) {
        log.error(e, 'Tasks -> Start Tasks');
      }
    });

    ipcMain.on(IPCKeys.StopTasks, async (_, { group, tasks }) => {
      try {
        if (Array.isArray(tasks)) {
          taskManager.stopAll({ group, tasks });
        } else {
          taskManager.stop({ id: tasks.id, group });
        }
      } catch (e) {
        log.error(e, 'Tasks -> Stop Tasks');
      }
    });

    ipcMain.on(IPCKeys.UpdateTasks, async (_, { group, tasks }) => {
      try {
        if (Array.isArray(tasks)) {
          taskManager.updateAll(group, tasks);
        } else {
          taskManager.update(group, tasks);
        }
      } catch (e) {
        log.error(e, 'Tasks -> Restart Tasks');
      }
    });

    ipcMain.on(IPCKeys.FetchRates, async (_, task) => {
      try {
        taskManager.start({
          group: 'RATE_FETCHER',
          task,
          type: Task.Types.Rates
        });
      } catch (e) {
        log.error(e, 'Tasks -> Start Rates Task');
      }
    });

    ipcMain.on(IPCKeys.CancelRates, async () => {
      try {
        taskManager.stop({ id: 'RATE_FETCHER', group: 'RATE_FETCHER' });
      } catch (e) {
        log.error(e, 'Tasks -> Cancel Rates Task');
      }
    });

    ipcMain.on(IPCKeys.ChangeDelay, async (_, group, delay, type, tasks) => {
      try {
        taskManager.changeDelay({ group, delay, type, tasks });
      } catch (e) {
        log.error(e, 'Tasks -> Change Delay');
      }
    });

    ipcMain.on(IPCKeys.CheckForUpdates, async (_, check = true) => {
      if (autoAppUpdate && check) {
        autoAppUpdate.forceCheck();
      }
    });

    mainWindow = new BrowserWindow({
      title: `${APP_TITLE}`,
      center: true,
      show: false,
      resizable: true,
      transparent: true,
      autoHideMenuBar: false,
      maximizable: false,
      acceptFirstMouse: true,
      fullscreen: false,
      frame: false,
      minWidth: 1150,
      minHeight: 775,
      width: 1150,
      height: 775,
      webPreferences: {
        backgroundThrottling: true,
        nodeIntegration: true,
        contextIsolation: false,
        nodeIntegrationInWorker: false,
        webSecurity: true,
        devTools: IS_DEV,
        allowRunningInsecureContent: false,
        experimentalFeatures: false
      }
    });

    mainWindow.once('ready-to-show', () => {
      if (!mainWindow) {
        throw new Error(`"mainWindow" is not defined`);
      }

      setTimeout(() => {
        if (!mainWindow) {
          return;
        }

        mainWindow.show();
        mainWindow.focus();
      }, 2500);
    });

    mainWindow.loadURL(`${PATHS.mainUrlPath}`);

    return mainWindow;
  } catch (e) {
    log.error(e, `main.dev -> createWindow`);
    return null;
  }
};
