import { createSelector } from 'reselect';
import { CurrentProxies, Proxies } from './reducers';

import { RootState } from '../../store/reducers';

const selectProxies = (state: RootState) => state.Proxies;
const selectCurrentProxies = (state: RootState) => state.CurrentProxies;

export const makeProxies = createSelector(
  selectProxies,
  state => state || Proxies
);

export const makeSelectedProxyGroup = createSelector(selectProxies, state =>
  state.find((p: any) => p.selected)
);

export const makeSelectedProxies = createSelector(
  makeSelectedProxyGroup,
  state => state?.proxies.filter(p => p.selected)
);

export const makeCurrentProxies = createSelector(
  selectCurrentProxies,
  state => state || CurrentProxies
);
