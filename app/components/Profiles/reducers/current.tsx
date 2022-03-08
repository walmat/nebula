import { PURGE } from 'redux-persist';

import { profilesActionTypes, PROFILE_FIELDS } from '../actions';
import { locationReducer, shipping, billing, Address } from './location';
import { paymentReducer, payment, Payment } from './payment';

export const initialState: CurrentProfile = {
  id: null,
  name: '',
  matches: false,
  shipping: { ...shipping },
  billing: { ...billing },
  payment: { ...payment }
};

const profileReducer = (state: CurrentProfile, payload: any) => {
  const { type, field, value } = payload;

  if (type === PROFILE_FIELDS.EDIT_SHIPPING) {
    return {
      ...state,
      shipping: locationReducer(state.shipping, { field, value })
    };
  }

  if (type === PROFILE_FIELDS.EDIT_BILLING) {
    return {
      ...state,
      billing: locationReducer(state.billing, { field, value })
    };
  }

  if (type === PROFILE_FIELDS.EDIT_PAYMENT) {
    return {
      ...state,
      payment: paymentReducer(state.payment, { field, value })
    };
  }

  if (type === PROFILE_FIELDS.EDIT_NAME) {
    return { ...state, name: value };
  }

  if (type === PROFILE_FIELDS.TOGGLE_MATCHES) {
    return { ...state, matches: !state.matches };
  }

  return state;
};

type Action = {
  type: string;
  payload?: any;
};

export type CurrentProfile = {
  id: string | null;
  name: string;
  matches: boolean;
  shipping: Address;
  billing: Address;
  payment: Payment;
};

export function CurrentProfile(state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return { ...initialState };

    case profilesActionTypes.LOAD:
      if (payload === null) {
        return { ...initialState };
      }

      if (payload) {
        return payload;
      }
      return state;

    case profilesActionTypes.SAVE:
      if (!payload) {
        return state;
      }
      return { ...initialState };

    case profilesActionTypes.DELETE:
      if (payload && payload.id) {
        return { ...initialState };
      }
      return state;

    case profilesActionTypes.EDIT:
      return profileReducer(state, payload);

    default:
      return state;
  }
}
