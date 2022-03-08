import {
  BrowserWindow,
  IpcMainInvokeEvent,
  ipcMain,
  AuthInfo,
  AuthenticationResponseDetails
} from 'electron';
import { IPCKeys } from '../../../constants/ipc';
import { createYoutubeWindow, closeAll } from './windows';
import { setProxy, loadHost } from '../utils';
import { format } from '../../../utils/proxy';
import { CaptchaManager } from './captcha';

export type YoutubeWindow = {
  id: string; // frontend ID
  proxy?: string; // frontend proxy
  window: BrowserWindow;
};

export type YoutubeWindows = {
  [id: string]: YoutubeWindow;
};

type LaunchProps = {
  id: string;
  platform: string;
  proxy?: string;
};

export class Youtube {
  mainWindow: BrowserWindow | null;

  captchaManager: CaptchaManager;

  windows: YoutubeWindows;

  constructor(
    mainWindow: BrowserWindow | null,
    captchaManager: CaptchaManager
  ) {
    this.mainWindow = mainWindow;

    this.captchaManager = captchaManager;

    this.windows = {};

    ipcMain.handle(IPCKeys.LaunchYoutube, this.launch);
    ipcMain.handle(IPCKeys.CancelLaunchYouTube, this.cancel);
  }

  /**
   * Attaches event listeners to the browser object to
   * help provide basic harvester functionality.
   *
   * @param window - BrowserWindow to attach to
   */
  attachHandlers = (id: string, window: BrowserWindow) => {
    // remove the window from list of windows before closing
    window.on('close', () => {
      delete this.windows[id];
    });

    const authHandler = (
      event: Event,
      _: AuthenticationResponseDetails,
      authInfo: AuthInfo,
      callback: Function
    ) => {
      event.preventDefault();

      const { proxy } = this.windows[id];

      if (authInfo.isProxy && proxy) {
        const formatted = format(proxy);
        if (formatted) {
          const [, , username, password] = formatted;
          callback(username, password);
        }
      }
    };

    // handle proxy authentication for this window
    window.webContents.on('login', authHandler);
  };

  closeAllWindows = () => closeAll(Object.values(this.windows));

  cancel = async (_: IpcMainInvokeEvent, { id }: LaunchProps) => {
    const launched = this.windows[id];
    if (launched) {
      launched.window.close();
      delete this.windows[id];
    }

    return true;
  };

  launch = async (
    _: IpcMainInvokeEvent,
    { id, platform, proxy }: LaunchProps
  ) => {
    if (this.captchaManager.windows[platform]) {
      const captcha = this.captchaManager.windows[platform][id];
      if (captcha) {
        const { window } = captcha;
        window.close();
      }
    }

    const launched = this.windows[id];
    if (launched) {
      launched.window.show();
      launched.window.focus();
      return;
    }

    const window = createYoutubeWindow(id);
    this.windows[id] = {
      id,
      proxy,
      window
    };

    this.attachHandlers(id, window);

    await setProxy({ window, proxy });

    const listener = (_: any, __: any, errorDescription: string) => {
      this.captchaManager.notificationManager.notify({
        message: `Failed to load YouTube [${errorDescription}]`,
        variant: 'error',
        force: true
      });

      return window.close();
    };

    window.webContents.once('did-fail-load', listener);

    await loadHost(
      window,
      'https://accounts.google.com/signin/v2/identifier?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3D%252F&hl=en&ec=65620&flowName=GlifWebSignIn&flowEntry=ServiceLogin',
      {
        userAgent:
          'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0'
      }
    );

    window.webContents.removeListener('did-fail-load', listener);

    window.show();

    return true;
  };
}
