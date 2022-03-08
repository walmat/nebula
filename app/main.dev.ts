/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable no-console */
import { app, ipcMain } from 'electron';

import { log } from './utils/log';
import { DEBUG_PROD, IS_DEV, IS_PROD } from './constants/env';
import { bootLoader } from './utils/bootHelper';
import { appEvents } from './utils/eventHandling';
import { createMainWindow } from './mainWindow/windows';

const appLock = app.requestSingleInstanceLock();
app.setAppUserModelId('com.nebulabots.omega');

app.commandLine.appendSwitch('disable-renderer-backgrounding', 'true');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
bootTheDevice();

app.disableHardwareAcceleration();

Error.stackTraceLimit = 100; // https://v8.dev/docs/stack-trace-api

require('v8-compile-cache');

if (IS_DEV || DEBUG_PROD) {
  // eslint-disable-next-line global-require
  require('electron-debug')();
}

async function bootTheDevice() {
  try {
    // For an existing installation
    if (bootLoader.quickVerify()) {
      return true;
    }

    // For a fresh installation
    await bootLoader.init();
    return bootLoader.verify();
  } catch (e) {
    throw new Error(e as any);
  }
}

process.setMaxListeners(Infinity);
ipcMain.setMaxListeners(Infinity);

// safeguard against any unhandled promise rejections
process.on('unhandledRejection', err => {
  if (!IS_DEV) {
    log.error(err, `main.dev -> process -> unhandledRejection`);
  }
});

process.on('uncaughtException', error => {
  log.error(error, `main -> process -> uncaughtException`);
});

if (IS_PROD) {
  // Override log statements to silence all
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.trace = () => {};
  console.debug = () => {};

  if (process.argv.length > 2) {
    app.quit();
  }

  appEvents.on('error', (error: any) => {
    log.error(error, `main.dev -> appEvents -> error`);
  });
}

process.on('uncaughtException', error => {
  log.error(error, `main.dev -> process -> uncaughtException`);
});

const run = async () => {
  if (!appLock) {
    return app.quit();
  }

  app.on('window-all-closed', () => {
    try {
      app.quit();
    } catch (e) {
      log.error(e, `main.dev -> window-all-closed`);
    }
  });

  app.whenReady().then(() => {
    createMainWindow();
  });
};

run();
