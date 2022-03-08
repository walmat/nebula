import { BrowserWindow } from 'electron';

export const createInterceptionWindow = (id: string) => {
  return new BrowserWindow({
    center: true,
    fullscreenable: false,
    movable: true,
    show: false,
    width: 600,
    height: 800,
    frame: false,
    transparent: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      backgroundThrottling: true,
      webSecurity: true,
      partition: `persist:${id}`
    }
  });
};
