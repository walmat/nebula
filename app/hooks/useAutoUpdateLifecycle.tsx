import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useDispatch } from 'react-redux';
import { IPCKeys } from '../constants/ipc';

import { toggleField, SETTINGS_FIELDS } from '../components/Settings/actions';

export const useAutoUpdaterLifecycle = () => {
  const dispatch = useDispatch();

  const _handleToggle = () => {
    dispatch(toggleField(SETTINGS_FIELDS.AUTO_UPDATE));
  };

  useEffect(() => {
    ipcRenderer.on(IPCKeys.CheckForUpdates, _handleToggle);
  });
};
