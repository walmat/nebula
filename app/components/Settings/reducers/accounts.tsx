import uuidv4 from 'uuidv4';
import { PURGE } from 'redux-persist';

import { CurrentAccount } from './currentAccount';
import { accountsActionTypes } from '../actions';

import regexes from '../../../constants/regexes';

type Action = {
  type: string;
  payload?: any;
};

export type Accounts = CurrentAccount[];

export const accountsInitialState: Accounts = [];

export function Accounts(state = accountsInitialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return [...accountsInitialState];

    case accountsActionTypes.SAVE_ACCOUNT: {
      // new account...
      if (!payload.id) {
        let newId: string;
        const idCheck = (acc: any) => acc.id === newId;
        do {
          newId = uuidv4();
        } while (state.some(idCheck));

        payload.id = newId;
        return [...state, payload];
      }

      // existing account...
      return state.map(acc => {
        if (acc.id === payload.id) {
          return payload;
        }
        return acc;
      });
    }

    case accountsActionTypes.UPLOAD_ACCOUNTS: {
      if (!payload || (payload && !payload.length)) {
        return state;
      }

      return [
        ...state,
        ...payload
          .map(([username, password]: [string, string]) => {
            const newAccount: any = { username, password };

            if (!regexes.email.test(username) || !password) {
              return null;
            }

            let id: string;
            const checker = (p: any) => p.id === id;
            do {
              id = uuidv4();
            } while (state.some(checker));

            newAccount.id = id;
            newAccount.name = username;

            return newAccount;
          })
          .filter(Boolean)
      ];
    }

    case accountsActionTypes.IMPORT: {
      if (!payload || (payload && !payload.length)) {
        return state;
      }

      // verify integrity...
      if (
        !payload.every(
          (account: any) => account.name && account.username && account.password
        )
      ) {
        return state;
      }

      return [
        ...state,
        ...payload.map((a: any) => {
          const newAccount: any = { ...a };

          let id: string;
          const checker = (p: any) => p.id === id;
          do {
            id = uuidv4();
          } while (state.some(checker));

          newAccount.id = id;

          return newAccount;
        })
      ];
    }

    case accountsActionTypes.DELETE_ACCOUNT: {
      if (!payload || (payload && !payload.id)) {
        return state;
      }
      return state.filter(acc => acc.id !== payload.id);
    }

    default:
      return state;
  }
}
