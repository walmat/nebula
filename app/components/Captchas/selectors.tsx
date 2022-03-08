import { createSelector } from 'reselect';
import { Captchas } from './reducers';

import { RootState } from '../../store/reducers';

const selectCaptchas = (state: RootState) => state.Captchas;

export const makeHarvesters = createSelector(
  selectCaptchas,
  state => state || Captchas
);
