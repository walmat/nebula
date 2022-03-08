import { ipcRenderer } from 'electron';

import { IPCKeys } from '../constants/ipc';

export const toggleWindowSizeOnDoubleClick = async () =>
  ipcRenderer.invoke(IPCKeys.GetCurrentWindow, 'maximize');
