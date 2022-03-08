import { BrowserWindow } from 'electron';

export const loadGoogle = async (window: BrowserWindow, options?: object) => {
  try {
    await window.loadURL('https://www.google.com', options);
  } catch (err) {
    // fail silently...
  }
};

export const loadSearch = async (window: BrowserWindow, options?: object) => {
  try {
    await window.loadURL(
      `https://www.google.com/search?q=youtube+videos`,
      options
    );
  } catch (err) {
    // fail silently...
  }
};

export const loadHost = async (
  window: BrowserWindow,
  host: string,
  options?: object
): Promise<any> => {
  try {
    await window.loadURL(host, options);
  } catch (err) {
    return loadHost(window, host, options);
  }
};
