/* eslint-disable */
import { parseURL } from 'whatwg-url';
import { PURGE } from 'redux-persist';

import { proxiesActionTypes } from '../../Proxies/actions';
import { accountsActionTypes } from '../../Settings/actions';
import { profilesActionTypes } from '../../Profiles/actions';
import { taskActionTypes, TASK_FIELDS } from '../actions';

import { Platforms, States, platformForStore } from '../../../constants';

type Action = {
  type: string;
  payload?: any;
};

export type Store = {
  url: string;
  name: string;
};

export type Product = {
  raw: string;
  variant: null | string;
  pos: null | string[];
  neg: null | string[];
  url: null | string;
};

export type Profile = {
  value: string;
  label: string;
};

export type Proxies = {};

export type Rate = {};

export type Profiles = Profile[];

export type CurrentTask = {
  id: null | string;
  store: Store | null;
  platform: string;
  mode: string | null;
  backupMode: string | null;
  product: Product;
  variation?: string;
  startTime: null | string;
  endTime: null | string;
  category?: null | string;
  paypal: boolean;
  profile: Profiles;
  proxies: null | Proxies;
  rate: null | Rate;
  sizes: string[];
  account: null | Account;
  state: string;
  message: string;
  amount: number;
  checkoutDelay?: number;
  quantity: number;
  selected: boolean;
  secureBypass?: boolean;
  password: string;
  quicktask?: boolean;
  useMocks: boolean;
  oneCheckout: boolean;
};

export const initialState: CurrentTask = {
  id: null,
  store: null,
  platform: Platforms.Shopify,
  mode: null,
  product: {
    raw: '',
    variant: null,
    pos: null,
    neg: null,
    url: null,
  },
  variation: '',
  startTime: null,
  endTime: null,
  category: null,
  profile: [],
  proxies: null,
  paypal: false,
  rate: null,
  sizes: [],
  account: null,
  state: States.Stopped,
  message: '',
  amount: 1,
  checkoutDelay: 0,
  quantity: 1,
  selected: false,
  secureBypass: false,
  backupMode: null,
  password: '',
  oneCheckout: false,
  quicktask: false,
  useMocks: false,
};

export function CurrentTask(state = initialState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case PURGE:
      return { ...initialState };

    case taskActionTypes.CLEAR_DIALOG: {
      const { isEditing } = payload;

      if (isEditing) {
        return state;
      }

      return { ...initialState };
    }

    case taskActionTypes.EDIT: {
      const { isEditing, field, value, stores } = payload;

      if (isEditing) {
        return state;
      }

      // new task
      switch (field) {
        case TASK_FIELDS.PRODUCT: {
          let change = {
            ...state,
            product: {
              ...state.product,
              raw: value || '',
            },
          };

          if (!value || !value.startsWith('http')) {
            return { ...state, ...change };
          }

          const URL = parseURL(value);
          if (!URL || !URL.host) {
            return { ...state, ...change };
          }

          let newStore: any;

          stores.forEach((category: any) => {
            const exists = category.options.find((s: any) => `${URL?.host}`.includes(s.value.split('/')[2]));
            if (exists) {
              newStore = exists;
            }
          });

          if (!newStore || (newStore.label && state.store && newStore.label === state.store.name)) {
            return { ...state, ...change };
          }

          change = {
            ...change,
            store: {
              url: newStore.value,
              name: newStore.label,
            },
            oneCheckout: false,
            quantity: 1,
            mode: null,
            rate: null,
            password: '',
            platform: platformForStore(newStore.value),
          };

          const {
            rate,
            category,
            checkoutDelay,
            variation,
            secureBypass,
            colorCode,
            account,
            styleCode,
            ...rest
          } = state;

          return { ...rest, ...change };
        }
        case TASK_FIELDS.PROFILE: {
          if (!payload.value) {
            return {
              ...state,
              profile: [],
            };
          }

          if (payload.value && payload.value.length > state.profile.length) {
            return {
              ...state,
              profile: [...payload.value],
            };
          }

          return {
            ...state,
            profile: state.profile.filter(s => payload.value.find(v => s === v)),
          };
        }

        case TASK_FIELDS.STORE: {
          if (!payload.value) {
            return {
              ...state,
              store: initialState.store,
              platform: null,
              oneCheckout: false,
              quantity: 1,
              password: '',
              rate: initialState.rate,
              mode: initialState.mode,
            };
          }

          if (state.store && payload.value && payload.value.name === state.store.name) {
            return state;
          }

          let newStore;
          stores.forEach(category => {
            const exists = category.options.find(s => s.value === payload.value.url && s.label === payload.value.name);
            if (exists) {
              newStore = exists;
            }
          });

          if (newStore) {
            if (state.store && newStore.label === state.store.name) {
              return state;
            }

            if (platformForStore(newStore.value) !== state.platform) {
              const {
                rate,
                category,
                checkoutDelay,
                variation,
                secureBypass,
                colorCode,
                account,
                styleCode,
                ...rest
              } = state;

              return {
                ...rest,
                platform: platformForStore(newStore.value),
                rate: initialState.rate,
                oneCheckout: false,
                quantity: 1,
                password: '',
                mode: platformForStore(newStore.value) !== state.mode ? null : state.mode,
                store: {
                  name: newStore.label,
                  url: newStore.value,
                },
              };
            }

            const {
              rate,
              category,
              checkoutDelay,
              variation,
              secureBypass,
              colorCode,
              account,
              styleCode,
              ...rest
            } = state;

            return {
              ...rest,
              platform: platformForStore(newStore.value),
              rate: initialState.rate,
              oneCheckout: false,
              quantity: 1,
              password: '',
              mode: null,
              store: {
                name: newStore.label,
                url: newStore.value,
              },
            };
          }

          console.log(platformForStore(payload.value.url), state.platform);

          if (platformForStore(payload.value.url) !== state.platform) {
            const {
              rate,
              category,
              checkoutDelay,
              variation,
              secureBypass,
              colorCode,
              account,
              styleCode,
              ...rest
            } = state;

            return {
              ...rest,
              rate: initialState.rate,
              oneCheckout: false,
              quantity: 1,
              password: '',
              platform: platformForStore(payload.value.url),
              mode: initialState.mode,
              store: payload.value,
            };
          }

          return {
            ...state,
            rate: initialState.rate,
            store: payload.value,
          };
        }

        case TASK_FIELDS.PROXIES: {
          if (!payload.value) {
            return {
              ...state,
              proxies: initialState.proxies,
            };
          }

          return {
            ...state,
            proxies: payload.value,
          };
        }
        case TASK_FIELDS.SIZES: {
          if (!payload.value) {
            return {
              ...state,
              sizes: [],
            };
          }

          if (payload.value && payload.value.length > state.sizes.length) {
            return {
              ...state,
              sizes: [...payload.value],
            };
          }

          return {
            ...state,
            sizes: state.sizes.filter(s => payload.value.find(v => s === v)),
          };
        }
        case TASK_FIELDS.CAPTCHA:
          return {
            ...state,
            [field]: !state[field],
          };

        case TASK_FIELDS.AMOUNT: {
          const num = parseInt(value || '0', 10);
          const amount = !Number.isNaN(num) ? num : 0;

          return { ...state, amount };
        }
        case TASK_FIELDS.CHECKOUT_DELAY: {
          const num = parseInt(value || '0', 10);
          const checkoutDelay = !Number.isNaN(num) ? num : 0;

          return { ...state, checkoutDelay };
        }
        default:
          return {
            ...state,
            [field]: value,
          };
      }
    }

    case profilesActionTypes.SAVE: {
      if (!payload || !state.profile?.length) {
        return state;
      }

      return {
        ...state,
        profile: state.profile.map((p: any) => {
          if (p.value === payload.id) {
            return {
              ...p,
              label: payload.name,
            };
          }
          return p;
        }),
      };
    }

    case profilesActionTypes.DELETE: {
      if (!payload || !state.profile?.length) {
        return state;
      }

      return {
        ...state,
        profile: state.profile.filter((p: any) => p.value !== payload.id),
      };
    }

    case profilesActionTypes.DELETE_ALL:
      if (!state?.profile?.length) {
        return state;
      }

      return {
        ...state,
        profile: initialState.profile,
      };

    case accountsActionTypes.SAVE_ACCOUNT: {
      if (
        !payload ||
        (payload && !payload.id) ||
        !state.account ||
        (payload && payload.id && state.account && state.account.id !== payload.id)
      ) {
        return state;
      }

      return {
        ...state,
        account: payload,
      };
    }

    case accountsActionTypes.DELETE_ACCOUNT: {
      if (!payload || (payload && state.account && payload.id !== state.account.id)) {
        return state;
      }

      return {
        ...state,
        account: initialState.account,
      };
    }

    case proxiesActionTypes.CREATE: {
      if (
        !payload ||
        !state.proxies ||
        (payload && !payload.id) ||
        (payload && state.proxies && payload.id !== state.proxies.id)
      ) {
        return state;
      }

      return {
        ...state,
        proxies: payload,
      };
    }

    case proxiesActionTypes.DELETE: {
      if (!payload || (payload && state.proxies && payload.id !== state.proxies.id)) {
        return state;
      }

      return {
        ...state,
        proxies: initialState.proxies,
      };
    }

    default:
      return state;
  }
}
