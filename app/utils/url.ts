import { ipcRenderer, shell } from 'electron';
import { IPCKeys } from '../constants/ipc';

export const openExternalUrl = ({
  url,
  isRenderer = false,
  events = null
}: any) => {
  if (events) {
    events.preventDefault();
  }

  if (isRenderer) {
    return ipcRenderer.invoke(IPCKeys.OpenUrl, { url });
  }
  return shell.openExternal(url);
};
