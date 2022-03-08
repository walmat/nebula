import { createSelector } from 'reselect';
import {
  accountsInitialState,
  currentAccountInitialState,
  webhooksInitialState,
  currentWebhookInitialState
} from './reducers';

import { RootState } from '../../store/reducers';

const selectDefaults = (state: RootState) => state.Defaults;
const selectSettings = (state: RootState) => state.Settings;
const selectAccounts = (state: RootState) => state.Accounts;
const selectCurrentAccount = (state: RootState) => state.CurrentAccount;
const selectCurrentWebhook = (state: RootState) => state.CurrentWebhook;
const selectWebhooks = (state: RootState) => state.Webhooks;

export const makeCreateTask = createSelector(
  selectSettings,
  state => state.toggleCreateTask
);

export const makeAnalyticsFile = createSelector(
  selectSettings,
  state => state.analyticsFile
);

export const makeEditTask = createSelector(
  selectSettings,
  state => state.toggleEditTask
);

export const makeCreateProxies = createSelector(
  selectSettings,
  state => state.toggleCreateProxies
);

export const makeCreateProfile = createSelector(
  selectSettings,
  state => state.toggleCreateProfile
);

export const makeProxySite = createSelector(
  selectSettings,
  state => state.proxySite
);

export const makeExpensesView = createSelector(
  selectSettings,
  state => state.expensesView
);

export const makeAutoSolve = createSelector(
  selectSettings,
  state => state.autoSolve
);

export const makeAutoSolveConnected = createSelector(
  selectSettings,
  state => state.autoSolveConnected
);

export const makeCurrentAccount = createSelector(
  selectCurrentAccount,
  state => state || currentAccountInitialState
);

export const makeAccountsList = createSelector(
  selectAccounts,
  state => state || accountsInitialState
);

export const makeCurrentWebhook = createSelector(
  selectCurrentWebhook,
  state => state || currentWebhookInitialState
);

export const makeWebhookList = createSelector(
  selectWebhooks,
  state => state || webhooksInitialState
);

export const makeDefaultAccount = createSelector(
  selectDefaults,
  state => state.account
);

export const makeDefaultMode = createSelector(
  selectDefaults,
  state => state.mode
);

export const makeDefaultProxies = createSelector(
  selectDefaults,
  state => state.proxies
);

export const makeDefaultProfile = createSelector(
  selectDefaults,
  state => state.profile
);

export const makeDefaultSizes = createSelector(
  selectDefaults,
  state => state.sizes
);
