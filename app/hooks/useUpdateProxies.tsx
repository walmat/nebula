import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useStore } from 'react-redux';
import { IPCKeys } from '../constants/ipc';
import { makeProxies } from '../components/Proxies/selectors';

// hook to update proxies based on IPC
export const useUpdateProxies = () => {
  // we use store instead of tasks to avoid rerender when tasks changes
  const store = useStore();

  useEffect(() => {
    const state = store.getState();

    const proxies = makeProxies(state);

    if (proxies.length) {
      ipcRenderer.send(IPCKeys.AddProxies, proxies);
    }
  });
};
