import { BrowserWindow, session } from 'electron';
import { join } from 'path';

import { IS_DEV } from '../../../constants/env';
import { PATHS } from '../../../utils/paths';

export const createYoutubeWindow = (id: string) => {
  return new BrowserWindow({
    center: true,
    transparent: false,
    fullscreenable: false,
    movable: true,
    show: false,
    width: 450,
    height: 600,
    frame: true,
    resizable: true,
    webPreferences: {
      webSecurity: true,
      devTools: IS_DEV,
      nodeIntegration: false,
      backgroundThrottling: true,
      session: session.fromPartition(`persist:${id}`)
    }
  });
};

export const createCaptchaWindow = (
  id: string,
  theme: number,
  type: string
) => {
  const preload = IS_DEV
    ? join(PATHS.preload, 'harvester.js')
    : join(__dirname, 'dist/harvester.prod.js');

  return new BrowserWindow({
    backgroundColor: theme === 0 ? '#f4f4f4' : '#202126',
    width: 400,
    height: 555,
    minWidth: 400,
    minHeight: 555,
    resizable: true,
    fullscreenable: false,
    useContentSize: true,
    show: false,
    transparent: type !== 'Checkpoint',
    frame: type === 'Checkpoint',
    titleBarStyle: 'default',
    acceptFirstMouse: true,
    webPreferences: {
      contextIsolation: false,
      backgroundThrottling: true,
      devTools: IS_DEV,
      webSecurity: false,
      plugins: true,
      session: session.fromPartition(`persist:${id}`),
      preload
    }
  });
};

export const closeAll = async (windows: any[]) => {
  return Promise.all(windows.map(({ window }) => window?.close()));
};
