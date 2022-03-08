/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { BrowserWindow, Cookie } from 'electron';
import { readFileSync } from 'fs';
import { parse } from 'url';

import { Platforms } from '../../constants';
import { IS_DEV, DEBUG_PROD } from '../../constants/env';
import { PATHS } from '../../utils/paths';
import { format } from '../../utils/proxy';

import {
  CaptchaRequester,
  CaptchaRequesters,
  CaptchaProps
} from './captcha/captcha';

import { IPCKeys } from '../../constants/ipc';

export const HarvestStates = {
  IDLE: 'idle',
  START: 'start',
  AUTOSOLVE: 'autosolve'
};

export const WindowStates = {
  LOAD: 'load',
  READY: 'ready',
  SOLVING: 'solving',
  CLOSE: 'close'
};

export const loadGoogle = async (window: BrowserWindow, options?: object) => {
  return window.loadURL('https://www.google.com', options);
};

export const loadLogin = async (window: BrowserWindow) => {
  return window.loadURL(
    'https://accounts.google.com/signin/v2/identifier?hl=en&service=youtube&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Ffeature%3Dsign_in_button%26hl%3Den%26app%3Ddesktop%26next%3D%252F%26action_handle_signin%3Dtrue&passive=true&uilel=3&flowName=GlifWebSignIn&flowEntry=ServiceLogin',
    {
      userAgent:
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0'
    }
  );
};

export const loadHost = async (
  window: BrowserWindow,
  host: string,
  options?: object
): Promise<any> => {
  return window.loadURL(host, options);
};

export const sleep = (time: string | number) =>
  new Promise(resolve => setTimeout(resolve, Number(time)));

export const intercept = (window: BrowserWindow) => {
  window.webContents.session.protocol.interceptBufferProtocol(
    'https',
    (req: any, callback: any) => {
      const { host } = parse(req.url);

      if (!/signify|paypal|datadome|google|gstatic|monorail/i.test(host)) {
        const html = readFileSync(PATHS.captchaUrlPath, 'utf8');
        window.webContents.session.protocol.uninterceptProtocol('https');

        return callback({
          mimeType: 'text/html',
          data: Buffer.from(html)
        });
      }
    }
  );
};

type SetProxyProps = {
  window: BrowserWindow;
  proxy?: string;
};

type SetCookieProps = {
  window: BrowserWindow;
  url: string;
  cookies: Cookie[];
};

type AttachRequesterProps = {
  entry: CaptchaProps;
  version: 0 | 1 | 2;
  requester: CaptchaRequester;
  window: BrowserWindow;
  isCheckpoint: boolean;
  remove: ({ id, platform }: { id: string; platform: string }) => void;
  needsFocus: boolean;
};

type DetachRequesterProps = {
  requesters: CaptchaRequesters;
  platform: string;
  entry: CaptchaProps;
};

export const setProxy = async ({ window, proxy }: SetProxyProps) => {
  const formatted = format(proxy);

  if (formatted) {
    const [ip, port] = formatted;

    await window.webContents.session.setProxy({
      mode: 'fixed_servers',
      proxyRules: `http=${ip}:${port};https=${ip}:${port};`
    });
  } else {
    await window.webContents.session.setProxy({
      mode: 'fixed_servers',
      proxyRules: ''
    });
  }

  if (IS_DEV || DEBUG_PROD) {
    const proxy = await window.webContents.session.resolveProxy(
      'https://google.com'
    );

    console.info('Using proxy: %j', proxy);
    window.webContents.session.cookies
      .get({})
      .then((cookies: any) => {
        console.info('Session cookies: %j', cookies?.length || 0);
        return null;
      })
      .catch((error: any) => {
        console.info('Error retrieving session cookies: %j', error);
      });
  }
};

export const setCookies = async ({
  window,
  url,
  cookies
}: SetCookieProps): Promise<any> => {
  try {
    for (const cookie of cookies) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await window.webContents.session.cookies.set({
          url,
          ...cookie
        });
      } catch (e) {
        console.error(
          '[HARVESTER]: Failed to set cookie: ',
          cookie.name,
          cookie.value
        );
        // noop..
      }
    }
  } catch (e) {
    console.error('[HARVESTER]: Failed to set cookies: ', e);
  }
};

type CheckpointProps = {
  window: BrowserWindow;
  url: string;
};

export const removeCookies = async ({ window, url }: CheckpointProps) => {
  const cookies = await window.webContents.session.cookies.get({ url });
  for (const cookie of cookies) {
    try {
      if (cookie.name !== 'hc_accessibility') {
        await window.webContents.session.cookies.remove(url, cookie.name);
      }
    } catch (e) {
      console.error(
        '[HARVESTER]: Failed to remove cookie: ',
        cookie.name,
        cookie.value
      );
    }
  }
};

export const blockPopups = (window: BrowserWindow) => {
  window.webContents.session.webRequest.onBeforeRequest((details, callback) => {
    const testUrl = details.url;

    if (/cookiebot.com|listrakbi.com|klaviyo.com/i.test(testUrl)) {
      callback({ cancel: true });
    } else {
      callback({ cancel: false });
    }
  });
};

const getCaptchaForm = `
(function() {
  return new Promise((resolve, reject) => {
   const interval = setInterval(() => {
      if ((document.querySelector('[name="g-recaptcha-response"]') && document.querySelector('[name="g-recaptcha-response"]').value && document.querySelector('[name="g-recaptcha-response"]').value.length > 0) || (document.querySelector('[name="h-captcha-response"]') && document.querySelector('[name="h-captcha-response"]').value && document.querySelector('[name="h-captcha-response"]').value.length > 0)) {
           clearInterval(interval)
           resolve({ form: Object.fromEntries(Array.from(new FormData(document.querySelector('form[action="/checkpoint"]')))), body: document.documentElement.innerHTML });
   }}, 100);
  })
})();`;

export const attachRequester = async ({
  entry,
  version,
  requester,
  window,
  isCheckpoint,
  remove,
  needsFocus
}: AttachRequesterProps) => {
  const { id, host, proxy, cookies, platform, harvest } = requester;

  entry.task = id; // assign task id to window
  requester.state = HarvestStates.START; // change requester state to start

  // no matter what we want to show the window if it isn't already shown..
  if (needsFocus) {
    window.show();
    window.focus();
  }

  if (requester.userAgent) {
    window.webContents.userAgent = requester.userAgent;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { harvest: _harvest, ...data } = requester;

  switch (platform) {
    case Platforms.Shopify: {
      entry.proxy = proxy;

      await setProxy({ window, proxy });

      if (isCheckpoint) {
        const { host: _host } = new URL(window.webContents.getURL());
        const { origin: url } = new URL(host);

        if (cookies?.length) {
          try {
            await removeCookies({ window, url });
          } catch (e) {
            console.error(e);
          }

          await setCookies({ window, url, cookies });
        }

        if (host !== _host) {
          await loadHost(window, host);
        }

        blockPopups(window);

        return window.webContents
          .executeJavaScript(getCaptchaForm)
          .then(async ({ form, body }) => {
            const cookies = await window.webContents.session.cookies.get({
              url
            });

            // harvest the token
            harvest({ form, body, cookies });

            // remove set-cookies
            await removeCookies({ window, url });

            // reomve the requesters
            return remove({ id, platform });
          })
          .catch(err => {
            console.error(`[CAPTCHA]: V2 Error: `, err);
          });
      }
      break;
    }

    case Platforms.Pokemon: {
      if (proxy) {
        entry.proxy = proxy;

        await setProxy({ window, proxy });
      }

      break;
    }

    default:
      break;
  }

  // all other cases other than checkpoint, just send the data across IPC
  window.webContents.send(IPCKeys.StartHarvest, { ...data, version });
};

export const detachRequester = async ({
  requesters,
  platform,
  entry
}: DetachRequesterProps) => {
  entry.task = null;
  const { window, type, name, theme } = entry;

  // special case for stopping a checkpoint harvester
  // since it's not our html file
  const isCheckpoint = type === 'Checkpoint';
  if (isCheckpoint) {
    // might be expensive, let's weigh the cost of it..
    const hasNextRequester = () =>
      Object.values(requesters[platform]).some(
        requester =>
          requester.checkpoint && requester.state === HarvestStates.IDLE
      );

    if (!hasNextRequester()) {
      entry.state = WindowStates.LOAD;

      window.webContents.once('did-finish-load', () => {
        window.webContents.send(IPCKeys.HarvesterData, {
          name,
          type,
          platform,
          theme
        });

        entry.state = WindowStates.READY;
      });

      intercept(window);
      // eslint-disable-next-line no-await-in-loop
      return loadHost(window, 'https://checkout.shopify.com');
    }

    entry.state = WindowStates.READY;

    return;
  }

  if (platform === Platforms.Footsites) {
    const hasNextRequester = () =>
      Object.values(requesters[platform]).some(
        requester =>
          requester.platform === Platforms.Footsites &&
          requester.state === HarvestStates.IDLE
      );

    if (!hasNextRequester()) {
      entry.state = WindowStates.LOAD;

      window.webContents.once('did-finish-load', () => {
        window.webContents.send(IPCKeys.HarvesterData, {
          name,
          type,
          platform,
          theme
        });

        entry.state = WindowStates.READY;
      });

      intercept(window);
      // eslint-disable-next-line no-await-in-loop
      return loadHost(window, 'https://geo.captcha-delivery.com');
    }

    entry.state = WindowStates.READY;

    return;
  }

  window.webContents.send(IPCKeys.StopHarvest);
  entry.state = WindowStates.READY;
};

export const removeNonAuthCookies = async (window: BrowserWindow) => {
  // get all cookies not related to google or youtube
  const cookies: Cookie[] = (
    await window.webContents.session.cookies.get({})
  ).filter(({ domain }) => domain && !/youtube|google/i.test(domain));

  if (cookies?.length) {
    await Promise.all(
      cookies.map(cookie =>
        cookie.domain
          ? window.webContents.session.cookies.remove(
              cookie.domain,
              cookie.name
            )
          : null
      )
    );
  }
};
