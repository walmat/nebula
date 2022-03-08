import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useStore } from 'react-redux';
import { IPCKeys } from '../constants/ipc';
import { makeProfiles } from '../components/Profiles/selectors';

// hook to update profiles based on IPC
export const useUpdateProfiles = () => {
  // we use store instead of tasks to avoid render when profiles change
  const store = useStore();

  useEffect(() => {
    const state = store.getState();

    const profiles = makeProfiles(state);

    if (profiles.length) {
      ipcRenderer.send(IPCKeys.AddProfiles, profiles);
    }
  });
};
