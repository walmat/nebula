import { ipcRenderer } from 'electron';
import { EOL } from 'os';

import { IPCKeys } from '../constants/ipc';

type TitleStrings = {
  [key: string]: string;
};

const toTitle: TitleStrings = {
  accounts: 'Accounts',
  profiles: 'Profiles',
  tasks: 'Tasks'
};

export default async type => {
  return ipcRenderer.invoke(IPCKeys.ShowOpenDialog, {
    title: `Select ${toTitle[type]} File`,
    json: true,
    filters: [
      {
        name: 'JSON',
        extensions: ['json']
      }
    ]
  });
};

export const loadTextFile = async () => {
  const { error, data } = await ipcRenderer.invoke(IPCKeys.ShowOpenDialog, {
    title: `Select File`,
    json: true,
    filters: [
      {
        name: 'JSON',
        extensions: ['json']
      }
    ]
  });

  if (error) {
    return error;
  }

  try {
    const accounts = data.split(EOL);
    if (!accounts?.length) {
      throw new Error('No data parsed');
    }

    return { success: true, accounts };
  } catch (error) {
    return { error };
  }
};

export const loadCSVFile = async () => {
  const { error, data } = await ipcRenderer.invoke(IPCKeys.ShowOpenDialog, {
    title: `Select File`,
    path: false,
    filters: [
      {
        name: 'CSV',
        extensions: ['csv']
      }
    ]
  });

  if (error) {
    return null;
  }

  return data;
};
