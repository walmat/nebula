import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useStore } from 'react-redux';
import { IPCKeys } from '../constants/ipc';

// hook to update stagger based on IPC
export const useUpdateStagger = () => {
  // we use store instead of tasks to avoid render when profiles change
  const store = useStore();

  useEffect(() => {
    const state = store.getState();

    const { stagger } = state.Settings;

    ipcRenderer.send(IPCKeys.ChangeStagger, stagger || 1);
  });
};
