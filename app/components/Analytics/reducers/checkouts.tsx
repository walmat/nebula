import { PURGE } from 'redux-persist';

import { checkoutActionTypes } from '../actions/checkouts';

type Action = {
  type: string;
  payload?: any;
};

export type Checkouts = [];

export const initialState: Checkouts = [];

export function Checkouts(state = initialState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case PURGE:
      return [...initialState];

    case checkoutActionTypes.ADD: {
      if (!payload) {
        return state;
      }

      return payload;
    }

    default:
      return state;
  }
}
