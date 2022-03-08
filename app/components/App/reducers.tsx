import { startCase } from 'lodash';
import { PURGE } from 'redux-persist';

import {
  globalActionTypes,
  userActionTypes,
  storesActionTypes
} from './actions';

type Action = {
  type: string;
  payload?: any;
};

export type User = {
  id: string;
  username: string;
  avatar: string;
  name: string;
  email: string;
  status: string;
  type: string;
  createdAt: string;
  updatedAt: string;
};

export const initialState: User = {
  id: '',
  username: '',
  avatar: '',
  name: '',
  email: '',
  status: '',
  type: '',
  createdAt: '',
  updatedAt: ''
};

export type Theme = number;

export const initialThemeState: Theme = 0;

export function Theme(state = initialThemeState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case PURGE:
      return initialThemeState;
    case globalActionTypes.SET_THEME:
      return payload;
    default:
      return state;
  }
}

export function User(state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return { ...initialState };

    case userActionTypes.SET_USER:
      return { ...payload };

    default:
      return state;
  }
}

type Store = {
  label: string;
  supported: boolean;
  value: string;
};

type Platform = {
  options: Store[];
  _id: string;
  index: number;
  label: string;
};

export type Stores = Platform[];

export const initialStoresState: Stores | [] = [];
export function Stores(state = initialStoresState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return [...initialStoresState];

    case storesActionTypes.ADD_STORE: {
      if (!payload) {
        return state;
      }

      const { name, url } = payload;
      if (!name || !url) {
        return state;
      }

      const index = state.findIndex(({ label }) => label === 'Shopify');
      if (index === -1) {
        return state;
      }

      return [...state].map((platform, idx) => {
        if (idx !== index) {
          return platform;
        }

        if (platform.options.some(({ value }) => value === url)) {
          return platform;
        }

        const newOptions = [
          ...platform.options,
          { label: startCase(name), supported: true, value: url }
        ].sort((a, b) => {
          if (b.label < a.label) {
            return 1;
          }

          if (b.label > a.label) {
            return -1;
          }

          return 0;
        });

        return {
          ...platform,
          options: [...newOptions]
        };
      });
    }

    case storesActionTypes.SET_STORES: {
      if (payload) {
        return [...payload];
      }

      return state;
    }

    default:
      return state;
  }
}
