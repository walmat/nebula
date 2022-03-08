import { createSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { initialState, initialStoresState } from './reducers';

const selectUser = (state: RootState) => state.User;
const selectStores = (state: RootState) => state.Stores;

export const makeUser = createSelector(
  selectUser,
  state => state || initialState
);

export const makeStores = createSelector(
  selectStores,
  state => state || initialStoresState
);
