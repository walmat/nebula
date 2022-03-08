/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { PURGE } from 'redux-persist';
import { parseURL } from 'whatwg-url';

import { taskActionTypes, TASK_FIELDS } from '../actions';

import { platformForStore } from '../../../constants';

type Action = {
  type: string;
  payload?: any;
};

export type EditTask = {};

export const initialState: EditTask = {};

export function EditTask(state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return { ...initialState };

    case taskActionTypes.CLEAR_DIALOG: {
      const { isEditing } = payload;

      if (!isEditing) {
        return state;
      }

      return { ...initialState };
    }

    case taskActionTypes.EDIT: {
      const { isEditing, field, value, stores } = payload;

      if (!isEditing) {
        return state;
      }

      switch (field) {
        case TASK_FIELDS.PRODUCT: {
          let change = {
            ...state,
            product: {
              ...state.product,
              raw: value || ''
            }
          };

          if (!value) {
            const { product, ...rest } = state;
            return rest;
          }

          if (value && !value.startsWith('http')) {
            return { ...state, ...change };
          }

          const URL = parseURL(value);
          if (!URL || !URL.host) {
            return { ...state, ...change };
          }

          let newStore;

          stores.forEach(category => {
            const exists = category.options.find(s =>
              URL.host.includes(s.value.split('/')[2])
            );
            if (exists) {
              newStore = exists;
            }
          });

          if (
            !newStore ||
            (newStore.label &&
              state.store &&
              newStore.label === state.store.name)
          ) {
            return { ...state, ...change };
          }

          change = {
            ...change,
            store: {
              url: newStore.value,
              name: newStore.label
            },
            platform: platformForStore(newStore.value)
          };

          return { ...state, ...change };
        }
        case TASK_FIELDS.PROFILE: {
          if (!payload.value) {
            const { profile, ...rest } = state;
            return rest;
          }

          return {
            ...state,
            profile: payload.value
          };
        }

        case TASK_FIELDS.STORE: {
          if (!payload.value) {
            const { store, platform, mode, ...rest } = state;
            return rest;
          }

          if (
            state.store &&
            payload.value &&
            payload.value.name === state.store.name
          ) {
            return state;
          }

          let newStore;
          stores.forEach(category => {
            const exists = category.options.find(
              s =>
                s.value === payload.value.url && s.label === payload.value.name
            );
            if (exists) {
              newStore = exists;
            }
          });

          if (newStore) {
            if (state.store && newStore.label === state.store.name) {
              return state;
            }

            if (
              state.platform &&
              platformForStore(newStore.value) !== state.platform
            ) {
              return {
                ...state,
                platform: platformForStore(newStore.value),
                mode: null,
                store: {
                  name: newStore.label,
                  url: newStore.value
                }
              };
            }

            return {
              ...state,
              platform: platformForStore(newStore.value),
              store: {
                name: newStore.label,
                url: newStore.value
              }
            };
          }

          if (platformForStore(payload.value.url) !== state.platform) {
            return {
              ...state,
              platform: platformForStore(payload.url),
              mode: null,
              store: payload.value
            };
          }

          return {
            ...state,
            store: payload.value
          };
        }

        case TASK_FIELDS.PROXIES: {
          if (!payload.value) {
            const { proxies, ...rest } = state;
            return rest;
          }

          return {
            ...state,
            proxies: payload.value
          };
        }
        case TASK_FIELDS.SIZES: {
          if (!payload.value || !payload.value?.length) {
            const { sizes, ...rest } = state;
            return rest;
          }

          const newState = { ...state };
          if (!newState.sizes) {
            newState.sizes = [];
          }

          if (
            payload.value &&
            newState.sizes &&
            payload.value.length > newState.sizes.length
          ) {
            return {
              ...state,
              sizes: [...payload.value]
            };
          }

          return {
            ...state,
            sizes: newState.sizes.filter(s => payload.value.find(v => s === v))
          };
        }
        case TASK_FIELDS.CAPTCHA:
          return {
            ...state,
            [field]: !state[field]
          };

        case TASK_FIELDS.MODE: {
          if (!payload.value) {
            const { mode, ...rest } = state;
            return rest;
          }

          return { ...state, mode: value };
        }

        case TASK_FIELDS.ACCOUNT: {
          if (!payload.value) {
            const { account, ...rest } = state;
            return rest;
          }

          return { ...state, account: value };
        }

        case TASK_FIELDS.MIN_PRICE: {
          if (!payload.value) {
            const { minPrice, ...rest } = state;
            return rest;
          }

          return { ...state, minPrice: value };
        }

        case TASK_FIELDS.MAX_PRICE: {
          if (!payload.value) {
            const { maxPrice, ...rest } = state;
            return rest;
          }

          return { ...state, maxPrice: value };
        }

        case TASK_FIELDS.START_TIME: {
          if (!payload.value) {
            const { startTime, ...rest } = state;
            return rest;
          }

          return { ...state, startTime: value };
        }

        case TASK_FIELDS.END_TIME: {
          if (!payload.value) {
            const { endTime, ...rest } = state;
            return rest;
          }

          return { ...state, endTime: value };
        }

        default:
          return {
            ...state,
            [field]: value
          };
      }
    }

    case taskActionTypes.UPDATE_TASKS: {
      if (!payload) {
        return state;
      }

      return { ...initialState };
    }

    case taskActionTypes.CANCEL_UPDATE: {
      return { ...initialState };
    }

    default:
      return state;
  }
}
