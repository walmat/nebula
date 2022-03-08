import createIPCMock from 'electron-mock-ipc';

const mocked = createIPCMock();
export const { ipcMain, ipcRenderer } = mocked;

export const app = {
  getPath: jest.fn(name => {
    return name;
  }),
  getName: jest.fn(),
  getVersion: jest.fn()
};
export const require = jest.fn();
export const match = jest.fn();
export const remote = {
  app
};
export const dialog = jest.fn();
