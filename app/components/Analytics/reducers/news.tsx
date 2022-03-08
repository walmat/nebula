import { PURGE } from 'redux-persist';

import { newsActionTypes } from '../actions';

type Action = {
  type: string;
  payload?: any;
};

export type NewsObject = {};

export type News = NewsObject[];

export const newsInitialState: News = [];

export function News(state = newsInitialState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case PURGE:
      return [...newsInitialState];

    case newsActionTypes.ADD: {
      if (!payload) {
        return state;
      }

      return payload;
    }
    default:
      return state;
  }
}
