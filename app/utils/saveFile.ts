import { ipcRenderer } from 'electron';

import { IPCKeys } from '../constants/ipc';

export default async state => {
  const { error, success } = await ipcRenderer.invoke(IPCKeys.SaveDialog, {
    title: `Please provide a name`,
    filters: [
      {
        name: 'JSON',
        extensions: ['json']
      }
    ],
    state
  });

  if (error) {
    return { error };
  }

  return { success };
};
