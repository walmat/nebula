import { createSelector } from 'reselect';
import { Profiles, CurrentProfile } from './reducers';

import { RootState } from '../../store/reducers';

const selectProfiles = (state: RootState) => state.Profiles;
const selectCurrentProfile = (state: RootState) => state.CurrentProfile;

export const makeProfiles = createSelector(
  selectProfiles,
  state => state || Profiles
);

export const makeCurrentProfile = createSelector(
  selectCurrentProfile,
  state => state || CurrentProfile
);
