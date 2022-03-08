import { PURGE } from 'redux-persist';

import { proxiesActionTypes, PROXY_FIELDS } from '../actions';

export const initialState = {
  id: null,
  selected: false,
  name: '',
  proxies: []
};

type Action = {
  type: string;
  payload?: any;
};

export type Proxy = {
  ip: string;
  speed: null | string;
  selected: boolean;
};

export type CurrentProxies = {
  id: null | string;
  selected: boolean;
  name: string;
  proxies: Proxy[];
};

export function CurrentProxies(state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return { ...initialState };

    case proxiesActionTypes.CREATE: {
      if (!payload) {
        return state;
      }

      return { ...initialState };
    }

    case proxiesActionTypes.LOAD: {
      if (payload === null) {
        return { ...initialState };
      }

      if (!payload || (payload && !payload.id)) {
        return state;
      }

      return payload;
    }

    case proxiesActionTypes.EDIT: {
      const { field, value } = payload;

      // new proxies
      switch (field) {
        case PROXY_FIELDS.PROXIES: {
          return {
            ...state,
            proxies: value
          };
        }
        default:
          return {
            ...state,
            [field]: value
          };
      }
    }

    default:
      return state;
  }
}
