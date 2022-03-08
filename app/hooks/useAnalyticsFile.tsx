import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useStore } from 'react-redux';
import { IPCKeys } from '../constants/ipc';
import { makeAnalyticsFile } from '../components/Settings/selectors';

// hook to update webhooks based on IPC
export const useAnalyticsFile = () => {
  // we use store instead of tasks to avoid rerender when tasks changes
  const store = useStore();

  useEffect(() => {
    const state = store.getState();

    const file = makeAnalyticsFile(state);

    if (file) {
      ipcRenderer.send(IPCKeys.AddAnalyticsFile, file);
    }
  });
};
