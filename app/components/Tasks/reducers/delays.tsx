import { PURGE } from 'redux-persist';

import { delayActionTypes } from '../actions';

type Action = {
  type: string;
  payload?: any;
};

export type Delays = {
  monitor: number;
  retry: number;
};

export const initialState: Delays = {
  monitor: 3500,
  retry: 3500
};

export function Delays(state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return { ...initialState };

    case delayActionTypes.CHANGE_DELAY: {
      const { field, delay } = payload;
      return {
        ...state,
        [field]: delay
      };
    }

    default:
      return state;
  }
}
