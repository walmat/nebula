import { PURGE } from 'redux-persist';

import { accountsActionTypes } from '../actions';

export type CurrentAccount = {
  id: null | string;
  name: string;
  username: string;
  password: string;
};

type Action = {
  type: string;
  payload?: any;
};

export const currentAccountInitialState: CurrentAccount = {
  id: null,
  name: '',
  username: '',
  password: ''
};

export function CurrentAccount(
  state = currentAccountInitialState,
  action: Action
) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return { ...currentAccountInitialState };

    case accountsActionTypes.EDIT_ACCOUNT: {
      const { field, value } = payload;

      if (!field) {
        return state;
      }

      return { ...state, [field]: value };
    }

    case accountsActionTypes.DELETE_ACCOUNT: {
      if (
        !payload ||
        (payload && !payload.id) ||
        (payload && payload.id !== state.id)
      ) {
        return state;
      }

      return { ...currentAccountInitialState };
    }

    case accountsActionTypes.SELECT_ACCOUNT: {
      if (payload === null) {
        return { ...currentAccountInitialState };
      }

      if (!payload || (payload && payload.id === state.id)) {
        return state;
      }
      return payload;
    }

    case accountsActionTypes.SAVE_ACCOUNT: {
      if (
        !payload ||
        (payload && (!payload.name || !payload.username || !payload.password))
      ) {
        return state;
      }

      return { ...currentAccountInitialState };
    }

    default:
      return state;
  }
}
