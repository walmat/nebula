/* eslint-disable import/first */
import { app, dialog, BrowserWindow } from 'electron';
import { autoUpdater, CancellationToken } from 'electron-updater';

import { version } from '../../package.json';

app.getVersion = () => version;

import { isConnected } from '../utils/isOnline';
import { log } from '../utils/log';
import { isPackaged } from '../utils/isPackaged';
import { PATHS } from '../utils/paths';
import { ENABLE_BACKGROUND_AUTO_UPDATE } from '../constants';
import { unixTimestampNow } from '../utils/date';
import { getMainWindow } from '../mainWindow/windows';
import { undefinedOrNull } from '../utils/funcs';

let progressbarWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow;

const createChildWindow = () => {
  try {
    return new BrowserWindow({
      parent: mainWindow,
      modal: true,
      show: false,
      height: 150,
      width: 600,
      title: 'Update downloading...',
      resizable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      movable: false,
      webPreferences: {
        nodeIntegration: true
      }
    });
  } catch (e) {
    log.error(e, `AppUpdate -> createChildWindow`);
    return null;
  }
};

const fireProgressbar = () => {
  try {
    if (progressbarWindow) {
      progressbarWindow.show();
      progressbarWindow.focus();
      return;
    }

    progressbarWindow = createChildWindow();
    if (progressbarWindow) {
      progressbarWindow.loadURL(`${PATHS.loadUrlPath}#progressbarPage`);

      progressbarWindow.webContents.on('did-finish-load', () => {
        if (progressbarWindow) {
          progressbarWindow.show();
          progressbarWindow.focus();
        }
      });

      progressbarWindow.on('closed', () => {
        progressbarWindow = null;
      });

      progressbarWindow.on('unresponsive', (error: any) => {
        log.error(error, `AppUpdate -> progressbarWindow -> onerror`);
      });
    }
  } catch (e) {
    log.error(e, `AppUpdate -> fireProgressbar`);
  }
};

export default class AppUpdate {
  autoUpdater: any;

  domReadyFlag: boolean;

  updateInitFlag: boolean;

  updateForceCheckFlag: boolean;

  _errorDialog: {
    timeGenerated: number;
    title: string | null;
    message: string | null;
  };

  cancellationToken: any;

  updateIsDownloading: any;

  updateIsActive: number;

  disableAutoUpdateCheck: boolean;

  constructor() {
    this.autoUpdater = autoUpdater;
    if (!isPackaged) {
      this.autoUpdater.updateConfigPath = PATHS.appUpdateFile;
    }

    // Just in case we end up attaching more than 10 listeners
    this.autoUpdater.setMaxListeners(Infinity);

    this.autoUpdater.autoDownload = ENABLE_BACKGROUND_AUTO_UPDATE;
    this.domReadyFlag = false;
    this.updateInitFlag = false;
    this.updateForceCheckFlag = false;
    this._errorDialog = {
      timeGenerated: 0,
      title: null,
      message: null
    };
    this.cancellationToken = new CancellationToken();
    this.updateIsDownloading = false;
    this.updateIsActive = 0; // 0 = no, 1 = update check in progress, -1 = update in progress
    this.disableAutoUpdateCheck = false;
  }

  init() {
    try {
      if (this.updateInitFlag) {
        return;
      }

      this.autoUpdater.on('error', (error: any) => {
        const errorMsg =
          error == null ? 'unknown' : (error.stack || error).toString();

        if (progressbarWindow) {
          progressbarWindow.close();
        }
        this.closeActiveUpdates();

        if (this.isNetworkError(error)) {
          this.spitMessageDialog(
            'Update Error',
            'Oops.. A network error occured. Try again!',
            'error'
          );
          log.doLog(error);

          this.updateForceCheckFlag = false;
          this.disableAutoUpdateCheck = false;
          this.updateIsActive = 0;

          return;
        }

        if (/Cannot find channel/i.test(error)) {
          this.spitMessageDialog(
            'No Updates Found',
            'You have the latest version installed.',
            'info'
          );
          log.doLog(error);

          this.updateForceCheckFlag = false;
          this.disableAutoUpdateCheck = false;
          this.updateIsActive = 0;

          return;
        }

        this.spitMessageDialog(
          'Update Error',
          'Oops.. Some error occured while updating the app. Try again!',
          'error'
        );

        this.updateForceCheckFlag = false;
        this.disableAutoUpdateCheck = false;
        this.updateIsActive = 0;

        log.error(errorMsg, `AppUpdate -> onerror`);
      });

      this.autoUpdater.on('update-available', async () => {
        if (progressbarWindow && this.updateIsActive !== -1) {
          progressbarWindow.close();
        }

        const { response } = await dialog.showMessageBox({
          type: 'info',
          title: 'Update Available',
          message: 'New version available. Download now?',
          buttons: ['Yes', 'No']
        });

        if (response === 0) {
          if (progressbarWindow) {
            progressbarWindow.close();
          }
          this.closeActiveUpdates(-1);
          this.initDownloadUpdatesProgress();
          this.autoUpdater.downloadUpdate(this.cancellationToken);
        }

        this.closeActiveUpdates();
        this.updateForceCheckFlag = false;
        this.disableAutoUpdateCheck = false;
        this.updateIsActive = 0;
      });

      this.autoUpdater.on('download-progress', (progress: any) => {
        if (!progressbarWindow) {
          return;
        }

        this.setUpdateProgressWindow({ value: progress.percent || 0 });
      });

      this.autoUpdater.on('update-downloaded', async () => {
        this.closeActiveUpdates();
        if (progressbarWindow) {
          progressbarWindow.close();
        }

        await dialog.showMessageBox({
          type: 'info',
          title: 'Update Installed',
          message: 'Downloaded! Application will relaunch now.',
          buttons: ['Continue']
        });

        this.autoUpdater.quitAndInstall();
      });

      this.updateInitFlag = true;
    } catch (e) {
      log.error(e, `AppUpdate -> init`);
    }
  }

  pollForUpdates() {
    try {
      this.setMainWindow();

      if (!mainWindow) {
        return;
      }

      isConnected()
        .then((connected: any) => {
          if (!connected) {
            return null;
          }

          if (this.updateIsActive === 1 || this.disableAutoUpdateCheck) {
            return null;
          }

          this.autoUpdater.on('update-not-available', () => {
            this.updateForceCheckFlag = false;
            this.disableAutoUpdateCheck = false;
            this.updateIsActive = 0;
          });

          if (this.updateIsDownloading) {
            this.cancellationToken.cancel();
          }

          this.autoUpdater.checkForUpdates();
          this.updateIsActive = 1;
          return true;
        })
        .catch(() => {});
    } catch (e) {
      log.error(e, `AppUpdate -> checkForUpdates`);
    }
  }

  checkForUpdates() {
    try {
      this.setMainWindow();

      if (!mainWindow) {
        return;
      }

      isConnected()
        .then((connected: any) => {
          if (!connected) {
            return null;
          }

          if (this.updateIsActive === 1 || this.disableAutoUpdateCheck) {
            return null;
          }

          this.autoUpdater.on('checking-for-update', () => {
            this.setCheckUpdatesProgress();
          });

          this.autoUpdater.on('update-not-available', () => {
            this.closeActiveUpdates();
            if (progressbarWindow) {
              progressbarWindow.close();
            }

            this.updateForceCheckFlag = false;
            this.disableAutoUpdateCheck = false;
            this.updateIsActive = 0;
          });

          if (this.updateIsDownloading) {
            this.cancellationToken.cancel();
          }

          this.autoUpdater.checkForUpdates();
          this.updateIsActive = 1;
          return true;
        })
        .catch(() => {});
    } catch (e) {
      log.error(e, `AppUpdate -> checkForUpdates`);
    }
  }

  async forceCheck() {
    try {
      this.setMainWindow();

      if (!mainWindow) {
        return;
      }

      if (!this.updateForceCheckFlag && this.updateIsActive !== 1) {
        this.autoUpdater.once('update-not-available', async () => {
          this.closeActiveUpdates();
          if (progressbarWindow) {
            progressbarWindow.close();
          }

          await dialog.showMessageBox({
            title: 'No update found!',
            message: 'You have the latest version installed.',
            buttons: ['Close']
          });

          this.updateForceCheckFlag = false;
          this.disableAutoUpdateCheck = false;
          this.updateIsActive = 0;
        });
      }

      if (this.updateIsActive === 1) {
        return;
      }

      if (this.updateIsActive === -1) {
        const { response } = await dialog.showMessageBox({
          title: 'Update in progress',
          message:
            'Another update is in progess. Are you sure want to restart the update?',
          buttons: ['Yes', 'No']
        });

        if (response === 0) {
          if (this.updateIsDownloading) {
            this.cancellationToken.cancel();
          }

          this.autoUpdater.checkForUpdates();
          this.updateIsActive = -1;
        }
        return;
      }

      if (this.updateIsDownloading) {
        this.cancellationToken.cancel();
      }

      this.autoUpdater.checkForUpdates();
      this.updateForceCheckFlag = true;
      this.disableAutoUpdateCheck = true;
      this.updateIsActive = 1;
    } catch (e) {
      log.error(e, `AppUpdate -> forceCheck`);
    }
  }

  setCheckUpdatesProgress() {
    try {
      isConnected()
        .then((connected: any) => {
          if (!connected) {
            this.spitMessageDialog(
              'Checking For Updates',
              'Internet connection is unavailable.'
            );
            return null;
          }

          fireProgressbar();
          this.setTaskBarProgressBar(2);

          if (progressbarWindow) {
            progressbarWindow.webContents.on('dom-ready', () => {
              if (progressbarWindow) {
                progressbarWindow.webContents.send(
                  'progressBarDataCommunication',
                  {
                    progressTitle: `Checking For Updates`,
                    progressBodyText: `Please wait...`,
                    value: 0,
                    variant: `indeterminate`
                  }
                );
              }
            });
          }
          return true;
        })
        .catch(() => {});
    } catch (e) {
      log.error(e, `AppUpdate -> setCheckUpdatesProgress`);
    }
  }

  initDownloadUpdatesProgress() {
    try {
      isConnected()
        .then((connected: any) => {
          if (!connected) {
            this.spitMessageDialog(
              'Downloading Updates',
              'Internet connection is unavailable.'
            );
            return null;
          }

          fireProgressbar();
          this.updateIsDownloading = true;
          this.domReadyFlag = false;
          this.setUpdateProgressWindow({ value: 0 });
          return true;
        })
        .catch(() => {});
    } catch (e) {
      log.error(e, `AppUpdate -> initDownloadUpdatesProgress`);
    }
  }

  setUpdateProgressWindow({ value = 0 }) {
    try {
      const data = {
        progressTitle: `Downloading Updates`,
        progressBodyText: `Please wait...`,
        value,
        variant: `determinate`
      };

      this.setTaskBarProgressBar(value / 100);
      if (this.domReadyFlag && progressbarWindow) {
        progressbarWindow.webContents.send(
          'progressBarDataCommunication',
          data
        );
        return;
      }

      if (progressbarWindow) {
        progressbarWindow.webContents.on('dom-ready', () => {
          if (progressbarWindow) {
            progressbarWindow.webContents.send(
              'progressBarDataCommunication',
              data
            );

            this.domReadyFlag = true;
          }
        });
      }
    } catch (e) {
      log.error(e, `AppUpdate -> setUpdateProgressWindow`);
    }
  }

  setMainWindow() {
    const _mainWindow = getMainWindow();
    if (!_mainWindow || undefinedOrNull(_mainWindow)) {
      return;
    }

    mainWindow = _mainWindow;
  }

  setTaskBarProgressBar(value: any) {
    try {
      if (mainWindow) {
        mainWindow.setProgressBar(value);
      }
    } catch (e) {
      log.error(e, `AppUpdate -> setTaskBarProgressBar`);
    }
  }

  isNetworkError(errorObj: any) {
    return (
      errorObj.message === 'net::ERR_INTERNET_DISCONNECTED' ||
      errorObj.message === 'net::ERR_PROXY_CONNECTION_FAILED' ||
      errorObj.message === 'net::ERR_CONNECTION_RESET' ||
      errorObj.message === 'net::ERR_CONNECTION_CLOSE' ||
      errorObj.message === 'net::ERR_NAME_NOT_RESOLVED' ||
      errorObj.message === 'net::ERR_CONNECTION_TIMED_OUT'
    );
  }

  async spitMessageDialog(title: string, message: string, type = 'message') {
    const { timeGenerated: _timeGenerated } = this._errorDialog;
    const delayTime = 1000;

    if (
      _timeGenerated !== 0 &&
      _timeGenerated - unixTimestampNow() < delayTime
    ) {
      return;
    }

    this._errorDialog = {
      timeGenerated: unixTimestampNow(),
      title,
      message
    };

    switch (type) {
      default:
      case 'message':
        await dialog.showMessageBox({
          title,
          message,
          buttons: ['Close']
        });
        break;
      case 'error':
        dialog.showErrorBox(title, message);
        break;
    }
  }

  closeActiveUpdates(updateIsActive = 0) {
    this.setTaskBarProgressBar(-1);
    this.updateIsActive = updateIsActive;
  }
}
