import { ipcRenderer } from 'electron';
import uuidv4 from 'uuidv4';
import { PURGE } from 'redux-persist';

import { captchasActionTypes, HARVESTER_FIELDS } from '../actions';

import {
  HarvesterOptions,
  HarvesterTypes,
  Platforms,
  platformForStore
} from '../../../constants';
import { IPCKeys } from '../../../constants/ipc';

export const initialState: any[] = [];

type Action = {
  type: string;
  payload?: any;
};

export type Captchas = [];

export function Captchas(state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return [...initialState];

    case captchasActionTypes.CREATE: {
      let id: string;
      const checker = (c: any) => c.id === id;
      do {
        id = uuidv4();
      } while (state.some(checker));

      const count = state.length + 1;

      const harvester = {
        id,
        name: `Harvester ${count}`,
        store: HarvesterOptions.Shopify,
        platform: Platforms.Shopify,
        type: HarvesterTypes.Checkout,
        proxy: ''
      };

      return [...state, harvester];
    }

    case captchasActionTypes.EDIT: {
      if (!payload || (payload && !payload.id)) {
        return state;
      }

      const { id, field, value } = payload;
      return state.map(captcha => {
        if (captcha.id === id) {
          if (field === HARVESTER_FIELDS.STORE) {
            const platform = platformForStore(value);

            if (platform !== Platforms.Shopify) {
              return {
                ...captcha,
                platform,
                type: HarvesterTypes.Checkout,
                [field]: value
              };
            }

            return {
              ...captcha,
              platform,
              [field]: value
            };
          }

          return {
            ...captcha,
            [field]: value
          };
        }
        return captcha;
      });
    }

    case captchasActionTypes.THEME: {
      return state.map(harvester => {
        ipcRenderer.send(IPCKeys.UpdateTheme, {
          theme: payload
        });

        return harvester;
      });
    }

    case captchasActionTypes.DELETE:
      if (payload) {
        return state.filter(p => p.id !== payload.id);
      }
      return state;

    default:
      return state;
  }
}
