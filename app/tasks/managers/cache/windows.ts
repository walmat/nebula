import { BrowserWindow } from 'electron';

export const createCacheWindow = () => {
  return new BrowserWindow({
    backgroundColor: '#202126',
    center: true,
    fullscreenable: false,
    movable: true,
    show: false,
    width: 800,
    height: 800,
    frame: false,
    transparent: true,
    resizable: true,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true,
      backgroundThrottling: true
    }
  });
};

export const WindowStates = {
  LOAD: 'load',
  READY: 'ready',
  SOLVING: 'solving',
  CLOSE: 'close'
};
