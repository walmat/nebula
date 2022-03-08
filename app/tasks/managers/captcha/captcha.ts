/* eslint-disable no-restricted-syntax */
import {
  session,
  BrowserWindow,
  ipcMain,
  IpcMainInvokeEvent,
  AuthenticationResponseDetails,
  AuthInfo,
  IpcMainEvent,
  Cookie
} from 'electron';
import uuid from 'uuid';
import AutoSolve from 'autosolve-client';
import { isEmpty } from 'lodash';

import captchaTypes from '../../../utils/captchaTypes';
import { Platforms } from '../../../constants';
import { requestAutoSolve, cancelAutoSolve, versionForType } from './autoSolve';
import {
  loadGoogle,
  loadHost,
  sleep,
  intercept,
  setProxy,
  HarvestStates,
  WindowStates,
  attachRequester,
  detachRequester
} from '../utils';
import { createCaptchaWindow, closeAll } from './windows';
import { IPCKeys } from '../../../constants/ipc';
import { Youtube } from './youtube';
import { format } from '../../../utils/proxy';
import { NotificationManager } from '..';

type AutoSolveProps = {
  apiKey: string;
  accessToken: string;
};

type CaptchaDetailProps = {
  id: string;
  name: string;
  store: string;
  proxy: string;
  type: string;
  platform: string;
  theme: number;
};

export type CaptchaProps = {
  id: string; // frontend ID
  guid: string; // backend ID
  name: string; // frontend name
  proxy?: string; // frontend proxy
  lastUsed: number;
  state: string;
  host: string;
  type: string;
  platform: string;
  theme: number;
  task: null | string; // currently solving task id
  window: BrowserWindow;
};

export type InterceptProps = {
  listener: any;
  window: BrowserWindow;
  id: string;
  guid: string;
  platform: string;
  store: string;
  name: string;
  proxy?: string;
  type: string;
  theme: number;
};

export type CaptchaWindow = {
  [id: string]: CaptchaProps;
};

export type CaptchaWindows = {
  [platform: string]: CaptchaWindow;
};

export type CaptchaRequester = {
  id: string;
  type: string;
  initialCid?: string;
  hash?: string;
  cid?: string;
  t?: string;
  sitekey: string;
  platform: string;
  host: string;
  state?: string; // state of the requester
  harvest: ({
    token,
    form,
    body,
    cookies,
    timestamp
  }: {
    token?: string;
    form?: string;
    body?: string;
    cookies?: Cookie[];
    timestamp?: number;
  }) => void;
  userAgent?: string;
  checkpoint?: boolean; // shopify
  proxy?: string; // currently only used for shopify
  s?: string; // shopify
  cookies?: Cookie[];
  action?: string; // yeezysupply
  sharing?: boolean; // yeezysupply
  expiration?: number; // yeezysupply
};

export type CaptchaRequesters = {
  [platform: string]: {
    [id: string]: CaptchaRequester;
  };
};

type CaptchaIntervals = {
  [platform: string]: number;
};

type TokenQueue = {
  [platform: string]: {
    id: string;
    token: string;
    timestamp: number;
  };
};

export class CaptchaManager {
  mainWindow: BrowserWindow | null;

  notificationManager: NotificationManager;

  windows: CaptchaWindows;

  requesters: CaptchaRequesters;

  intervals: CaptchaIntervals;

  intervalRate: number;

  autoSolve: AutoSolve | null;

  youtubeManager: Youtube;

  tokens: TokenQueue;

  captchaSemaphore: string;

  constructor(
    mainWindow: BrowserWindow | null,
    notificationManager: NotificationManager
  ) {
    this.mainWindow = mainWindow;

    this.notificationManager = notificationManager;

    this.windows = {};

    this.requesters = {};

    this.intervals = {};

    this.intervalRate = 250; // .25 of a second poll for new requesters

    this.autoSolve = null;

    this.tokens = {};

    this.youtubeManager = new Youtube(mainWindow, this);

    this.captchaSemaphore = '';

    // handlers
    ipcMain.handle(IPCKeys.SetupAutoSolve, this.setupAutoSolve);
    ipcMain.handle(IPCKeys.LaunchHarvester, this.launch);
    ipcMain.handle(IPCKeys.CancelLaunchHarvester, this.cancel);
    ipcMain.handle(IPCKeys.CloseHarvesterWindows, this.close);
    ipcMain.on(IPCKeys.UpdateHarvester, this.update);
    ipcMain.on(IPCKeys.UpdateHCaptchaToken, this.saveHcaptchaToken);
    ipcMain.on(IPCKeys.UpdateTheme, this.theme);
    ipcMain.on(IPCKeys.HarvestCaptcha, this.harvest);
  }

  /**
   * Sends solve requests for idle requesters to idle windows
   * @param platform - Platform to check solve requests for
   */
  startInterval = (platform: string) => {
    return setInterval(async () => {
      const requesters = Object.values(this.requesters[platform]).filter(
        ({ state }) =>
          state === HarvestStates.IDLE || state === HarvestStates.AUTOSOLVE
      );

      // eslint-disable-next-line no-restricted-syntax
      for (const requester of requesters) {
        const {
          id,
          type,
          host,
          sitekey,
          platform,
          proxy,
          state,
          s,
          action
        } = requester;

        if (!this.windows[platform]) {
          this.windows[platform] = {};
        }

        const queue = Object.values(this.windows[platform])
          .filter(
            ({ state, task, type: _type }) =>
              state === WindowStates.READY &&
              !task &&
              (platform !== Platforms.Shopify ||
                (platform === Platforms.Shopify &&
                  ((_type === 'Checkout' &&
                    type === captchaTypes.RECAPTCHA_V2) ||
                    (_type === 'Checkpoint' &&
                      type === captchaTypes.RECAPTCHA_V2C) ||
                    (_type === 'Login' && type === captchaTypes.RECAPTCHA_V3))))
          )
          .sort((a, b) => (a.lastUsed > b.lastUsed ? 1 : -1));

        const window = (queue || [])[0];
        if (window) {
          window.lastUsed = Date.now();
        }

        const version = versionForType(type);
        if (this.autoSolve && state !== HarvestStates.AUTOSOLVE) {
          requester.state = HarvestStates.AUTOSOLVE;

          const renderParameters = s ? { s } : {};

          if (platform === Platforms.YeezySupply) {
            if (!this.captchaSemaphore) {
              this.captchaSemaphore = id;
            }

            requestAutoSolve({
              autoSolve: this.autoSolve,
              id,
              platform,
              siteKey: sitekey,
              version: `${version}`,
              action,
              proxy,
              renderParameters,
              url: host
            });
          } else {
            requestAutoSolve({
              autoSolve: this.autoSolve,
              id,
              platform,
              siteKey: sitekey,
              version: `${version}`,
              action,
              proxy,
              renderParameters,
              url: host
            });
          }
        }

        if (window) {
          window.state = WindowStates.SOLVING;
          requester.state = HarvestStates.START;

          attachRequester({
            entry: window,
            version,
            requester,
            window: window.window,
            isCheckpoint: window.type === 'Checkpoint',
            needsFocus: this.mainWindow?.isFocused() || false,
            remove: this.remove
          });
        }
      }
    }, this.intervalRate);
  };

  stopInterval = (platform: string) => {
    clearInterval(this.intervals[platform]);
    delete this.intervals[platform];
  };

  /**
   * Attaches event listeners to the browser object to
   * help provide basic harvester functionality.
   *
   * @param window - BrowserWindow to attach to
   */
  attachHandlers = (guid: string, window: BrowserWindow, platform: string) => {
    window.hide();

    // remove the window from list of windows before closing
    window.on('close', () => {
      this.windows[platform][guid].state = WindowStates.CLOSE;
      const { task } = this.windows[platform][guid];

      // if we had a requester while closing, unassign it from the window
      if (task) {
        const requester = this.requesters[platform][task];
        if (requester) {
          requester.state = HarvestStates.IDLE;
        }
      }

      delete this.windows[platform][guid];
    });

    const authHandler = (
      event: Event,
      _: AuthenticationResponseDetails,
      authInfo: AuthInfo,
      callback: Function
    ) => {
      event.preventDefault();

      const { proxy } = this.windows[platform][guid];

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

  /**
   * Inserts a requester into it's respective mapping by platform
   *
   * Note: This method also kicks off the requester interval if it
   *       wasn't start already.
   */
  insert = async ({
    id,
    type,
    initialCid,
    hash,
    cid,
    sitekey,
    platform,
    harvest,
    host,
    proxy,
    t,
    s,
    userAgent,
    cookies,
    action,
    sharing,
    expiration,
    state = HarvestStates.IDLE
  }: CaptchaRequester) => {
    // if we're sharing, return the token
    if (sharing && this.tokens[platform]) {
      const { timestamp, token } = this.tokens[platform];
      return harvest({ token, timestamp });
    }

    // or if the stored token corresponds to the same task, return it
    if (this.tokens[platform] && this.tokens[platform].id === id) {
      const { timestamp, token } = this.tokens[platform];
      return harvest({ token, timestamp });
    }

    if (this.autoSolve) {
      this.notificationManager.insert({
        id,
        message: `Task ${id}: Sent to AutoSolve`,
        variant: 'info'
      });
    }

    this.notificationManager.insert({
      id,
      message: `Task ${id}: ${type}`,
      variant: 'warning',
      type: 'HEADS_UP'
    });

    if (!this.requesters[platform]) {
      this.requesters[platform] = {};
    }

    if (this.requesters[platform][id]) {
      return;
    }

    this.requesters[platform][id] = {
      id,
      type,
      initialCid,
      hash,
      cid,
      t,
      sitekey,
      platform,
      harvest,
      host,
      state,
      proxy,
      cookies,
      userAgent,
      s,
      action,
      sharing,
      expiration
    };

    if (!this.intervals[platform]) {
      this.intervals[platform] = this.startInterval(platform);
    }

    return null;
  };

  /**
   * Removes a requester from the mapping of requesters and assignment
   * to any captcha windows
   *
   * Note: This method will also stop the requester interval if there
   *       aren't anymore requesters for that platform.
   */
  remove = async ({ id, platform }: { id: string; platform: string }) => {
    if (!this.requesters[platform]) {
      return;
    }

    delete this.requesters[platform][id];

    if (this.autoSolve) {
      cancelAutoSolve({ id, platform, autoSolve: this.autoSolve });
    }

    const windows = Object.values(this.windows[platform]);

    // eslint-disable-next-line no-restricted-syntax
    for (const entry of windows) {
      if (entry.task === id) {
        detachRequester({ requesters: this.requesters, platform, entry });
        break;
      }
    }

    // focus next window
    const nextToFocus = windows.find(({ task }) => task);

    if (nextToFocus && !nextToFocus.window.isFocused()) {
      nextToFocus.window.show();
      nextToFocus.window.focus();
    }

    if (isEmpty(this.requesters[platform])) {
      this.stopInterval(platform);
    }
  };

  /**
   * Handles harvesting the captcha token and sending it to the proper task
   */
  harvest = async (
    _: IpcMainEvent | null, // null if called from AutoSolve
    {
      id,
      platform,
      token,
      timestamp
    }: {
      id: string;
      platform: string;
      token: string;
      timestamp: number;
    }
  ) => {
    if (!this.requesters[platform]) {
      return;
    }

    const { sharing } = this.requesters[platform][id];

    // store the token in the token cache
    if (platform === Platforms.YeezySupply) {
      this.tokens[platform] = {
        id,
        token,
        timestamp
      };

      // remove the token in (expiration || 115s)
      setTimeout(() => {
        if (this.captchaSemaphore) {
          this.captchaSemaphore = '';
        }

        delete this.tokens[platform];
      }, 110000);
    }

    // if we're sharing tokens, let's harvest for all shared requesters..
    if (sharing) {
      return Promise.all(
        Object.values(this.requesters[platform]).map(
          (requester: CaptchaRequester) => {
            if (requester.sharing) {
              requester.harvest({ token, timestamp });
              if (this.autoSolve && requester.id === this.captchaSemaphore) {
                return this.remove({ id: requester.id, platform });
              }

              return this.remove({ id: requester.id, platform });
            }
            return null;
          }
        )
      );
    }

    const requester = this.requesters[platform][id];
    requester.harvest({ token, timestamp });

    return this.remove({ id, platform });
  };

  cancel = async (_: IpcMainInvokeEvent, { id }: CaptchaDetailProps) => {
    for (const platform of Object.keys(this.windows)) {
      if (!this.windows[platform]) {
        this.windows[platform] = {};
      }

      for (const window of Object.values(this.windows[platform])) {
        const { id: _id, guid, window: _window, state } = window;

        if (_id === id && state === WindowStates.LOAD) {
          _window.close();
          delete this.windows[platform][guid];
        }
      }
    }

    return true;
  };

  /**
   * Launches a captcha window and stores it in the map of windows
   */
  launch = async (
    _: IpcMainInvokeEvent,
    { id, name, store, proxy, type, platform, theme }: CaptchaDetailProps
  ) => {
    if (!this.windows[platform]) {
      this.windows[platform] = {};
    }

    // make sure we close the youtube window associated with the harvester
    const youtube = this.youtubeManager.windows[id];
    if (youtube) {
      youtube.window.close();
    }

    const guid = uuid();
    const window = createCaptchaWindow(id, theme, type);

    this.windows[platform][guid] = {
      id,
      guid,
      name,
      host: store,
      platform,
      lastUsed: 0,
      state: WindowStates.LOAD,
      task: null,
      theme,
      type,
      window,
      proxy
    };

    this.attachHandlers(guid, window, platform);

    await setProxy({ window, proxy });

    const listener = (_: any, __: any, errorDescription: string) => {
      this.notificationManager.notify({
        message: `Failed to load harvester [${errorDescription}]`,
        variant: 'error',
        force: true
      });

      return window.close();
    };

    window.webContents.once('did-fail-load', listener);

    await loadGoogle(window);
    await sleep(Math.floor(Math.random() * 1750) + 1250);

    return this.intercept({
      listener,
      window,
      id,
      guid,
      platform,
      store,
      name,
      proxy,
      type,
      theme
    });
  };

  intercept = async ({
    listener,
    window,
    guid,
    platform,
    store,
    name,
    type,
    theme
  }: InterceptProps) => {
    // intercept and load the proper host finally..
    intercept(window);

    await loadHost(window, store);

    window.webContents.send(IPCKeys.HarvesterData, {
      name,
      type,
      platform,
      theme
    });

    window.show();

    window.webContents.removeListener('did-fail-load', listener);

    this.windows[platform][guid].state = WindowStates.READY;

    return true;
  };

  /**
   * Invoked by a user deleting the harvester from the frontend.
   * This method will close either A) the harvester window, or B)
   * the Youtube window (whichever is open at the time).
   */
  close = async (_: IpcMainInvokeEvent, { id }: CaptchaDetailProps) => {
    const youtube = this.youtubeManager.windows[id];
    if (youtube) {
      const { window } = youtube;
      window.close();
    }

    for (const platform of Object.keys(this.windows)) {
      if (!this.windows[platform]) {
        this.windows[platform] = {};
      }

      for (const window of Object.values(this.windows[platform])) {
        if (window.id === id) {
          window.window.close();
        }
      }
    }

    return true;
  };

  closeAllWindows = () => {
    return Promise.all(
      Object.values(this.windows).map(windows =>
        closeAll(Object.values(windows))
      )
    );
  };

  theme = async (_: IpcMainEvent, { theme }: CaptchaDetailProps) => {
    for (const platform of Object.keys(this.windows)) {
      if (!this.windows[platform]) {
        this.windows[platform] = {};
      }

      for (const window of Object.values(this.windows[platform])) {
        window.window.webContents.send(IPCKeys.HarvesterData, {
          theme
        });
      }
    }

    return true;
  };

  /**
   * Updates a previously launched harvester with new information
   */
  update = async (
    _: IpcMainEvent,
    { id, name, proxy, type, theme }: CaptchaDetailProps
  ) => {
    for (const platform of Object.keys(this.windows)) {
      if (!this.windows[platform]) {
        this.windows[platform] = {};
      }

      for (const window of Object.values(this.windows[platform])) {
        if (window.id === id) {
          if (window.proxy !== proxy) {
            // eslint-disable-next-line no-await-in-loop
            await setProxy({ window: window.window, proxy });
          }

          this.windows[platform][id] = {
            ...window,
            id,
            name,
            proxy,
            lastUsed: Date.now(),
            type
          };

          window.window.webContents.send(IPCKeys.HarvesterData, {
            name,
            type,
            theme
          });
        }
      }
    }

    return true;
  };

  saveHcaptchaToken = async (
    _: IpcMainEvent,
    { id, token }: { id: string; token: string }
  ) => {
    const sess = session.fromPartition(`persist:${id}`);

    if (!token) {
      return sess.cookies.remove(
        'https://www.hcaptcha.com',
        'hc_accessibility'
      );
    }

    return sess.cookies.set({
      url: 'https://www.hcaptcha.com',
      domain: '.hcaptcha.com',
      name: 'hc_accessibility',
      value: token,
      secure: true
    });
  };

  /**
   * Allows you to swap to and from autosolve / bot solvers
   */
  unassignRequesters = (autoSolve = false) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const platform of Object.keys(this.requesters)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const requester of Object.values(this.requesters[platform])) {
        if (!autoSolve) {
          if (requester.state === HarvestStates.AUTOSOLVE) {
            requester.state = HarvestStates.IDLE;
          }
        } else if (requester.state === HarvestStates.START) {
          requester.state = HarvestStates.IDLE;

          const window = Object.values(this.windows[requester.platform]).find(
            ({ task }) => task === requester.id
          );

          if (window) {
            detachRequester({
              requesters: this.requesters,
              platform,
              entry: window
            });
          }
        }
      }
    }
  };

  setupAutoSolve = async (
    _: IpcMainInvokeEvent,
    { apiKey, accessToken }: AutoSolveProps
  ) => {
    if (!apiKey || !accessToken) {
      if (this.autoSolve) {
        this.autoSolve.cancelAllRequests();
        this.autoSolve = null;
      }

      this.unassignRequesters();

      return { success: false };
    }

    this.autoSolve = AutoSolve.getInstance({
      accessToken,
      apiKey,
      clientKey: '',
      shouldAlertOnCancel: true,
      debug: true
    });

    if (!this.autoSolve) {
      this.autoSolve = null;

      return { success: false };
    }

    return this.autoSolve
      .init()
      .then(() => {
        if (this.autoSolve) {
          this.unassignRequesters(true);

          this.autoSolve.ee.on(
            `AutoSolveResponse`,
            async (data: AutoSolveResponseProps) => {
              const { taskId, token, createdAt } = JSON.parse(data);

              const [id, platform] = taskId.split('::');

              this.harvest(null, {
                id,
                platform,
                timestamp: Math.floor((createdAt * 1000 + 120000) / 1000),
                token
              });
            }
          );
        }

        return { success: true };
      })
      .catch((error: string) => {
        this.autoSolve = null;
        if (typeof error === 'string') {
          return { error };
        }

        return { error: 'Unknown AutoSolve Error' };
      });
  };
}
