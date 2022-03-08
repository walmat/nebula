import { unionBy } from 'lodash';
import { PURGE } from 'redux-persist';

import { ratesActionTypes } from '../actions';

export const ratesInitialState: Rates = {};

export type Rate = {
  name: string;
  price: string;
  id: string;
};

export type Rates = {
  [key: string]: Rate[];
};

type Action = {
  type: string;
  payload?: any;
};

export function Rates(state = ratesInitialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return { ...ratesInitialState };

    case ratesActionTypes.ADD_RATES: {
      const { store, rates } = payload;

      const previous = state[store];

      if (previous) {
        return {
          ...state,
          [store]: unionBy(rates, previous, 'id')
        };
      }

      return {
        ...state,
        [store]: rates
      };
    }

    case ratesActionTypes.REMOVE_RATES: {
      const { rate, store } = payload;

      const ratesObject = state[store];
      if (!ratesObject) {
        return state;
      }

      return {
        ...state,
        [store]: ratesObject.filter(({ id }) => id !== rate.id)
      };
    }

    default:
      return state;
  }
}
