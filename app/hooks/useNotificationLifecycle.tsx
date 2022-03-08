import { useEffect } from 'react';
import { useStore } from 'react-redux';
import { ipcRenderer } from 'electron';
import { useSnackbar } from 'notistack';

import { play, preload } from '../classes/Notification';
import { IPCKeys } from '../constants/ipc';

import { RootState } from '../store/reducers';

export const useNotificationLifecycle = () => {
  const { enqueueSnackbar } = useSnackbar();
  const store = useStore();

  const handleNotification = (
    _: any,
    { message, variant, type, force }: any
  ) => {
    const {
      Settings: { enableNotifications }
    }: RootState = store.getState();

    if (force || enableNotifications) {
      enqueueSnackbar(message, { variant });

      play(type);
    }
  };

  useEffect(() => {
    preload();
    ipcRenderer.on(IPCKeys.Notification, handleNotification);

    return () => {
      ipcRenderer.removeListener(IPCKeys.Notification, handleNotification);
    };
  });
};
