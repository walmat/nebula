import { combineReducers } from 'redux';
import { filterActions } from 'redux-ignore';

import { User, Stores, Theme } from '../components/App/reducers';
import {
  globalActions,
  userActions,
  storesActions
} from '../components/App/actions';

import { Checkouts, News } from '../components/Analytics/reducers';
import { checkoutActions, newsActions } from '../components/Analytics/actions';

import { Captchas } from '../components/Captchas/reducers';
import { captchasActions } from '../components/Captchas/actions';

import {
  Tasks,
  EditTask,
  CurrentTask,
  Delays
} from '../components/Tasks/reducers';
import { taskActions, delayActions } from '../components/Tasks/actions';

import {
  Settings,
  Accounts,
  CurrentAccount,
  Webhooks,
  CurrentWebhook,
  Rates,
  Defaults
} from '../components/Settings/reducers';
import {
  accountsActions,
  settingsActions,
  webhookActions,
  ratesActions,
  defaultsActions
} from '../components/Settings/actions';

import { CurrentProfile, Profiles } from '../components/Profiles/reducers';
import { profilesActions } from '../components/Profiles/actions';

import { CurrentProxies, Proxies } from '../components/Proxies/reducers';
import { proxiesActions } from '../components/Proxies/actions';

export type RootState = {
  User: User;
  Stores: Stores;
  Accounts: Accounts;
  CurrentAccount: CurrentAccount;
  Checkouts: Checkouts;
  News: News;
  Captchas: Captchas;
  Delays: Delays;
  Tasks: Tasks;
  EditTask: EditTask;
  CurrentTask: CurrentTask;
  Profiles: Profiles;
  CurrentProfile: CurrentProfile;
  Proxies: Proxies;
  CurrentProxies: CurrentProxies;
  Settings: Settings;
  CurrentWebhook: CurrentWebhook;
  Webhooks: Webhooks;
  Rates: Rates;
  Defaults: Defaults;
  Theme: Theme;
};

const combiner = combineReducers({
  User: filterActions(User, [...globalActions, ...userActions]),
  Stores: filterActions(Stores, [...globalActions, ...storesActions]),
  Accounts: filterActions(Accounts, [...globalActions, ...accountsActions]),
  CurrentAccount: filterActions(CurrentAccount, [
    ...globalActions,
    ...accountsActions
  ]),
  Checkouts: filterActions(Checkouts, [...globalActions, ...checkoutActions]),
  News: filterActions(News, [...globalActions, ...newsActions]),
  Captchas: filterActions(Captchas, [...globalActions, ...captchasActions]),
  Delays: filterActions(Delays, [...globalActions, ...delayActions]),
  Tasks: filterActions(Tasks, [
    ...globalActions,
    ...taskActions,
    ...profilesActions,
    ...accountsActions,
    ...proxiesActions
  ]),
  EditTask: filterActions(EditTask, [...globalActions, ...taskActions]),
  CurrentTask: filterActions(CurrentTask, [
    ...globalActions,
    ...taskActions,
    ...profilesActions,
    ...accountsActions,
    ...proxiesActions
  ]),
  Profiles: filterActions(Profiles, [...globalActions, ...profilesActions]),
  CurrentProfile: filterActions(CurrentProfile, [
    ...globalActions,
    ...profilesActions
  ]),
  Proxies: filterActions(Proxies, [...globalActions, ...proxiesActions]),
  CurrentProxies: filterActions(CurrentProxies, [
    ...globalActions,
    ...proxiesActions
  ]),
  Settings: filterActions(Settings, [...globalActions, ...settingsActions]),
  CurrentWebhook: filterActions(CurrentWebhook, [
    ...globalActions,
    ...webhookActions
  ]),
  Webhooks: filterActions(Webhooks, [...globalActions, ...webhookActions]),
  Rates: filterActions(Rates, [...globalActions, ...ratesActions]),
  Defaults: filterActions(Defaults, [...globalActions, ...defaultsActions]),
  Theme: filterActions(Theme, [...globalActions])
});

const stateSanityChecks = (payload: any) => {
  const entries = [
    'Accounts',
    'Captchas',
    'CurrentAccount',
    'CurrentProfile',
    'CurrentProxies',
    'CurrentTask',
    'CurrentWebhook',
    'Defaults',
    'Delays',
    'EditTask',
    'Profiles',
    'Proxies',
    'Rates',
    'Settings',
    'Tasks',
    'Theme',
    'Webhooks'
  ];

  return entries.every(key => typeof payload[key] !== 'undefined');
};

const rootReducer = (state: any, action: any) => {
  if (action.type === '@@App/IMPORT_STATE') {
    const { payload } = action;

    if (!payload) {
      return state;
    }

    const check = stateSanityChecks(payload);
    if (!check) {
      return state;
    }

    return {
      ...state,
      ...payload
    };
  }

  return combiner(state, action);
};

export default rootReducer;
