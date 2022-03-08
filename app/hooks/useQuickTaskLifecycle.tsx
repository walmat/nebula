import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useStore, useDispatch } from 'react-redux';
import { IPCKeys } from '../constants/ipc';

import {
  makeDefaultAccount,
  makeDefaultMode,
  makeDefaultProxies,
  makeDefaultProfile,
  makeDefaultSizes
} from '../components/Settings/selectors';
import { makeProfiles } from '../components/Profiles/selectors';

import { createTasks } from '../components/Tasks/actions';

import {
  ShopifyTypes,
  Platforms,
  createStore,
  parseProduct,
  States
} from '../constants';

import { makeDelays } from '../components/Tasks/selectors';
import { makeUser } from '../components/App/selectors';

export const useQuickTaskLifecycle = () => {
  const dispatch = useDispatch();
  const store = useStore();

  const handleQuickTask = async (_: any, { url }: { url: string }) => {
    const state = store.getState();
    const { id } = makeUser(state);
    const defaultProfile = makeDefaultProfile(state);
    const defaultSizes = makeDefaultSizes(state);

    // don't do anything if they don't have any profile/sizes selected
    if (!defaultProfile || !defaultSizes || !id) {
      return;
    }

    let product = parseProduct({ raw: url }, Platforms.Shopify);

    // handle /cart/PID:QUANTITY links
    if (/cart/i.test(url)) {
      const match = /.*?\/cart\/(.*):/i.exec(url);
      if (match?.length) {
        const [, variant] = match;
        product = parseProduct({ raw: variant, variant }, Platforms.Shopify);
      }
    }

    const defaultAccount = makeDefaultAccount(state);
    const defaultMode = makeDefaultMode(state);
    const defaultProxies = makeDefaultProxies(state);
    const { monitor, retry } = makeDelays(state);
    const profiles = makeProfiles(state);

    const task = {
      backupMode: defaultMode || ShopifyTypes.FAST,
      mode: defaultMode || ShopifyTypes.FAST,
      platform: Platforms.Shopify,
      store: createStore(url),
      proxies: defaultProxies,
      sizes: defaultSizes,
      account: defaultAccount,
      monitor,
      retry,
      startTime: null,
      endTime: null,
      selected: true,
      product,
      amount: 1
    };

    await Promise.all(
      defaultProfile.map((profile: any) => {
        if (profile.value === 'All') {
          return profiles.map((p: any) => {
            return dispatch(
              createTasks('default', {
                ...task,
                state: States.Running,
                message: 'Starting task',
                user: id,
                monitor,
                retry,
                profile: p,
                quicktask: true
              })
            );
          });
        }
        const p = profiles.find((pr: any) => pr.id === profile.value);
        return dispatch(
          createTasks('default', {
            ...task,
            state: States.Running,
            message: 'Starting task',
            user: id,
            monitor,
            retry,
            profile: p,
            quicktask: true
          })
        );
      })
    );
  };

  useEffect(() => {
    ipcRenderer.on(IPCKeys.QuickTask, handleQuickTask);

    return () => {
      ipcRenderer.removeListener(IPCKeys.QuickTask, handleQuickTask);
    };
  }, []);
};
