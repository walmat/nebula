import { BrowserWindow, ipcRenderer } from 'electron';
import { PATHS } from './paths';
import { log } from './log';
import { APP_TITLE } from '../constants/meta';
import { undefinedOrNull } from './funcs';
import {
  PRIVACY_POLICY_PAGE_TITLE,
  TERMS_OF_SERVICE_TITLE
} from '../constants';
import { IPCKeys } from '../constants/ipc';

let _reportBugsWindow: BrowserWindow | null;
let _privacyPolicyWindow: BrowserWindow | null;
let _termsOfServiceWindow: BrowserWindow | null;

export const quit = () => ipcRenderer.send(IPCKeys.QuitApp);

export const close = () =>
  ipcRenderer.invoke(IPCKeys.GetCurrentWindow, 'close');

export const minimize = async () =>
  ipcRenderer.invoke(IPCKeys.GetCurrentWindow, 'minimize');

/**
 * Report Bugs Window
 */
const reportBugsCreateWindow = () => {
  return new BrowserWindow({
    height: 480,
    width: 600,
    frame: false,
    show: false,
    resizable: false,
    title: `${APP_TITLE}`,
    minimizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
};

export const reportBugsWindow = () => {
  try {
    if (_reportBugsWindow) {
      _reportBugsWindow.focus();
      _reportBugsWindow.show();
      return _reportBugsWindow;
    }

    _reportBugsWindow = reportBugsCreateWindow();

    _reportBugsWindow.loadURL(`${PATHS.mainUrlPath}#reportBugsPage`);
    _reportBugsWindow.webContents.on('did-finish-load', () => {
      if (_reportBugsWindow) {
        _reportBugsWindow.show();
        _reportBugsWindow.focus();
      }
    });

    _reportBugsWindow.on('closed', () => {
      _reportBugsWindow = null;
    });

    return _reportBugsWindow;
  } catch (e) {
    log.error(e, `createWindows -> reportBugsWindow`);
    return null;
  }
};

/**
 * Privacy Policy Window
 */

const privacyPolicyCreateWindow = async (
  isRenderedPage: boolean
): Promise<BrowserWindow> => {
  const config = {
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    frame: false,
    show: false,
    resizable: false,
    title: `${APP_TITLE}`,
    minimizable: true,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true
    }
  };

  // incoming call from a rendered page
  if (isRenderedPage) {
    const allWindows = await ipcRenderer.invoke(IPCKeys.GetAllWindows);

    const exists = loadExistingWindow(allWindows, PRIVACY_POLICY_PAGE_TITLE);
    if (exists) {
      return exists;
    }

    return new BrowserWindow(config);
  }

  // incoming call from the main process
  const allWindows = BrowserWindow.getAllWindows();
  const exists = loadExistingWindow(allWindows, PRIVACY_POLICY_PAGE_TITLE);
  if (exists) {
    return exists;
  }

  return new BrowserWindow(config);
};

export const privacyPolicyWindow = async (isRenderedPage = false) => {
  try {
    if (_privacyPolicyWindow) {
      _privacyPolicyWindow.focus();
      _privacyPolicyWindow.show();
      return _privacyPolicyWindow;
    }

    // show the existing _privacyPolicyWindow
    const _privacyPolicyWindowTemp = await privacyPolicyCreateWindow(
      isRenderedPage
    );
    if (!_privacyPolicyWindowTemp) {
      return _privacyPolicyWindow;
    }

    _privacyPolicyWindow = _privacyPolicyWindowTemp;
    _privacyPolicyWindow.loadURL(`${PATHS.mainUrlPath}#privacyPolicy`);
    _privacyPolicyWindow.webContents.on('did-finish-load', () => {
      if (_privacyPolicyWindow) {
        _privacyPolicyWindow.show();
        _privacyPolicyWindow.focus();
      }
    });

    _privacyPolicyWindow.on('closed', () => {
      _privacyPolicyWindow = null;
    });

    return _privacyPolicyWindow;
  } catch (e) {
    log.error(e, `createWindows -> privacyPolicyWindow`);
    return null;
  }
};

/**
 * TOS Window
 */

const TermsOfServiceCreateWindow = async (
  isRenderedPage: boolean
): Promise<BrowserWindow> => {
  const config = {
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    frame: false,
    show: false,
    resizable: false,
    title: `${APP_TITLE}`,
    minimizable: true,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true
    }
  };

  // incoming call from a rendered page
  if (isRenderedPage) {
    const allWindows = await ipcRenderer.invoke(IPCKeys.GetAllWindows);

    const exists = loadExistingWindow(allWindows, TERMS_OF_SERVICE_TITLE);
    if (exists) {
      return exists;
    }

    return new BrowserWindow(config);
  }

  const allWindows = BrowserWindow.getAllWindows();

  const exists = loadExistingWindow(allWindows, TERMS_OF_SERVICE_TITLE);
  if (exists) {
    return exists;
  }

  return new BrowserWindow(config);
};

export const termsOfServiceWindow = async (isRenderedPage = false) => {
  try {
    if (_termsOfServiceWindow) {
      _termsOfServiceWindow.focus();
      _termsOfServiceWindow.show();
      return _termsOfServiceWindow;
    }

    // show the existing _privacyPolicyWindow
    const _termsOfServiceWindowTemp = await TermsOfServiceCreateWindow(
      isRenderedPage
    );
    if (!_termsOfServiceWindowTemp) {
      return _termsOfServiceWindow;
    }

    _termsOfServiceWindow = _termsOfServiceWindowTemp;
    _termsOfServiceWindow.loadURL(`${PATHS.mainUrlPath}#termsOfService`);
    _termsOfServiceWindow.webContents.on('did-finish-load', () => {
      if (_termsOfServiceWindow) {
        _termsOfServiceWindow.show();
        _termsOfServiceWindow.focus();
      }
    });

    _termsOfServiceWindow.on('closed', () => {
      _termsOfServiceWindow = null;
    });

    return _termsOfServiceWindow;
  } catch (e) {
    log.error(e, `createWindows -> termsOfServiceWindow`);
    return null;
  }
};

const loadExistingWindow = (allWindows: any[], title: string) => {
  if (!undefinedOrNull(allWindows)) {
    for (let i = 0; i < allWindows.length; i += 1) {
      const item = allWindows[i];
      if (item.getTitle().indexOf(title) !== -1) {
        item.focus();
        item.show();

        return item;
      }
    }
  }

  return null;
};
