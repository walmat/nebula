import { PURGE } from 'redux-persist';

import { defaultsActionTypes } from '../actions';

type Action = {
  type: string;
  payload?: any;
};

type Account = {
  id: string;
  name: string;
  username: string;
  password: string;
};

type Proxies = {
  id: string;
  name: string;
};
type Profile = {
  value: string;
  label: string;
};

export type Defaults = {
  account: null | Account;
  mode: null | string;
  proxies: null | Proxies;
  profile: [] | Profile[];
  sizes: [] | string[];
};

export const defaultsInitialState: Defaults = {
  account: null,
  mode: null,
  proxies: null,
  profile: [],
  sizes: []
};

export function Defaults(state = defaultsInitialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return { ...defaultsInitialState };

    case defaultsActionTypes.SELECT: {
      if (!payload) {
        return state;
      }

      const { field, value } = payload;

      if (!field) {
        return state;
      }

      return {
        ...state,
        [field]: value
      };
    }

    default:
      return state;
  }
}
