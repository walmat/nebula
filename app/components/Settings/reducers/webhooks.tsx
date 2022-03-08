import { ipcRenderer } from 'electron';
import uuidv4 from 'uuidv4';
import { PURGE } from 'redux-persist';

import { webhookActionTypes } from '../actions';
import { CurrentWebhook } from './currentWebhook';
import { IPCKeys } from '../../../constants/ipc';

export const webhooksInitialState: any[] = [];

export type Webhooks = CurrentWebhook[];

type Action = {
  type: string;
  payload?: any;
};

export function Webhooks(state = webhooksInitialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return [...webhooksInitialState];

    case webhookActionTypes.SAVE_WEBHOOK: {
      // new webhook...
      if (!payload.id) {
        let newId: string;
        const idCheck = (acc: any) => acc.id === newId;
        do {
          newId = uuidv4();
        } while (state.some(idCheck));

        payload.id = newId;

        ipcRenderer.send(IPCKeys.AddWebhooks, [payload]);

        return [...state, payload];
      }

      // existing webhook...
      return state.map(hook => {
        if (hook.id === payload.id) {
          ipcRenderer.send(IPCKeys.AddWebhooks, [payload]);

          return payload;
        }
        return hook;
      });
    }

    case webhookActionTypes.DELETE_WEBHOOK: {
      if (!payload || (payload && !payload.id)) {
        return state;
      }

      ipcRenderer.send(IPCKeys.RemoveWebhooks, [payload]);

      return state.filter(hook => hook.id !== payload.id);
    }

    default:
      return state;
  }
}
