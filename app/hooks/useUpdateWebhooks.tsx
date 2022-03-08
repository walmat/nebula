import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useStore } from 'react-redux';
import { IPCKeys } from '../constants/ipc';
import { makeWebhookList } from '../components/Settings/selectors';

// hook to update webhooks based on IPC
export const useUpdateWebhooks = () => {
  // we use store instead of tasks to avoid rerender when tasks changes
  const store = useStore();

  useEffect(() => {
    const state = store.getState();

    const webhooks = makeWebhookList(state);

    if (webhooks.length) {
      ipcRenderer.send(IPCKeys.AddWebhooks, webhooks);
    }
  });
};
