import uuidv4 from 'uuidv4';
import valid from 'card-validator';
import { ipcRenderer } from 'electron';
import { PURGE } from 'redux-persist';

import { IPCKeys } from '../../../constants/ipc';
import { profilesActionTypes } from '../actions';

import { CurrentProfile } from './current';

export type Profiles = CurrentProfile[];

type Action = {
  type: string;
  payload?: any;
};

export const initialState: Profiles = [];

export function Profiles(state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return [...initialState];

    case profilesActionTypes.IMPORT: {
      if (!payload || (payload && !payload.length)) {
        return state;
      }

      // verify integrity...
      if (
        !payload.every(
          (profile: any) =>
            profile.name &&
            profile.billing &&
            profile.shipping &&
            profile.payment
        )
      ) {
        return state;
      }

      return [
        ...state,
        ...payload.map((p: any) => {
          const newProfile = { ...p };

          let id: string;
          const checker = (p: any) => p.id === id;
          do {
            id = uuidv4();
          } while (state.some(checker));

          newProfile.id = id;

          // determine card type...
          const validator: any = valid.number(newProfile.payment.card);
          newProfile.payment.type = validator?.card?.type;

          ipcRenderer.send(IPCKeys.AddProfiles, newProfile);

          return newProfile;
        })
      ];
    }

    case profilesActionTypes.SAVE: {
      if (!payload) {
        return state;
      }

      if (payload.matches) {
        payload.billing = { ...payload.shipping };
      }

      // updating existing profile...
      if (payload.id) {
        return state.map(p => {
          if (p.id === payload.id) {
            // determine card type...
            const validator: any = valid.number(payload.payment.card);
            payload.payment.type = validator?.card?.type;

            const newProfile = { ...p, ...payload };
            ipcRenderer.send(IPCKeys.AddProfiles, newProfile);

            return newProfile;
          }
          return p;
        });
      }

      // creating new profile...
      let id: string;
      const checker = (p: any) => p.id === id;
      do {
        id = uuidv4();
      } while (state.some(checker));

      payload.id = id;

      // determine card type...
      const validator: any = valid.number(payload.payment.card);
      payload.payment.type = validator?.card?.type;

      ipcRenderer.send(IPCKeys.AddProfiles, payload);

      return [...state, payload];
    }

    case profilesActionTypes.DUPLICATE: {
      if (!payload) {
        return state;
      }

      const newProfile = { ...payload };

      let id: string;
      const checker = (p: any) => p.id === id;
      do {
        id = uuidv4();
      } while (state.some(checker));

      newProfile.id = id;
      newProfile.name = `${newProfile.name} Copy`;

      ipcRenderer.send(IPCKeys.AddProfiles, newProfile);

      return [...state, newProfile];
    }

    case profilesActionTypes.DELETE: {
      if (!payload) {
        return state;
      }

      ipcRenderer.send(IPCKeys.RemoveProfiles, payload);
      return state.filter(p => p.id !== payload.id);
    }

    case profilesActionTypes.DELETE_ALL: {
      ipcRenderer.send(IPCKeys.RemoveProfiles, state);

      return [...initialState];
    }

    default:
      return state;
  }
}
