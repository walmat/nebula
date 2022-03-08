import { PURGE } from 'redux-persist';

import { webhookActionTypes } from '../actions';

export type CurrentWebhook = {
  id: null | string;
  name: string;
  url: string;
  type: string;
  declines: boolean;
};

type Action = {
  type: string;
  payload?: any;
};

export const currentWebhookInitialState: CurrentWebhook = {
  id: null,
  name: '',
  url: '',
  type: '',
  declines: true
};

export function CurrentWebhook(
  state = currentWebhookInitialState,
  action: Action
) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return { ...currentWebhookInitialState };

    case webhookActionTypes.EDIT_WEBHOOK: {
      const { field, value } = payload;

      if (!field) {
        return state;
      }

      return { ...state, [field]: value };
    }

    case webhookActionTypes.DELETE_WEBHOOK: {
      if (
        !payload ||
        (payload && !payload.id) ||
        (payload && payload.id !== state.id)
      ) {
        return state;
      }

      return currentWebhookInitialState;
    }

    case webhookActionTypes.SELECT_WEBHOOK: {
      if (payload === null) {
        return { ...currentWebhookInitialState };
      }

      if (!payload || (payload && payload.id === state.id)) {
        return state;
      }
      return payload;
    }

    case webhookActionTypes.SAVE_WEBHOOK: {
      if (!payload || (payload && (!payload.url || !payload.name))) {
        return state;
      }
      return { ...currentWebhookInitialState };
    }

    default:
      return state;
  }
}
