import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useStore, useDispatch } from 'react-redux';
import { IPCKeys } from '../constants/ipc';

import {
  makeAutoSolve,
  makeAutoSolveConnected
} from '../components/Settings/selectors';
import { setAutoSolveConnected } from '../components/Settings/actions';

export const useAutoSolveLifecycle = () => {
  const store = useStore();
  const dispatch = useDispatch();

  const _handleSetupAutoSolve = () => {
    const state = store.getState();
    const autoSolveConnected = makeAutoSolveConnected(state);

    if (autoSolveConnected) {
      const { accessToken, apiKey } = makeAutoSolve(state);
      if (accessToken && apiKey) {
        ipcRenderer
          .invoke(IPCKeys.SetupAutoSolve, {
            accessToken,
            apiKey
          })
          .then(({ success }) => {
            if (success) {
              return dispatch(setAutoSolveConnected(true));
            }
            return dispatch(setAutoSolveConnected(false));
          })
          .catch(() => {
            return dispatch(setAutoSolveConnected(false));
          });
      }
    }
  };

  useEffect(() => {
    _handleSetupAutoSolve();
  });
};
