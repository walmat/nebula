import prefixer from '../../utils/reducerPrefixer';
import { HookTypes } from '../../constants';

const settingsPrefix = '@@Settings';
const settingsTypesList = [
  'SET_FIELD',
  'TOGGLE_FIELD',
  'COPY_JSON_FILE_TO_SETTINGS',
  'EDIT_AUTOSOLVE',
  'SET_ANALYTICS_FILE',
  'EDIT_STAGGER'
];

const accountsPrefix = '@@Accounts';
const accountsTypesList = [
  'EDIT_ACCOUNT',
  'SELECT_ACCOUNT',
  'DELETE_ACCOUNT',
  'SAVE_ACCOUNT',
  'UPLOAD_ACCOUNTS',
  'IMPORT',
  'EXPORT'
];

const webhookPrefix = '@@Webhook';
const webhookTypesList = [
  'EDIT_WEBHOOK',
  'SELECT_WEBHOOK',
  'DELETE_WEBHOOK',
  'SAVE_WEBHOOK'
];

const defaultsPrefix = '@@Defaults';
const defaultsTypesList = ['SELECT'];

export const settingsActions = settingsTypesList.map(
  a => `${settingsPrefix}/${a}`
);
export const accountsActions = accountsTypesList.map(
  a => `${accountsPrefix}/${a}`
);
export const webhookActions = webhookTypesList.map(
  a => `${webhookPrefix}/${a}`
);
export const defaultsActions = defaultsTypesList.map(
  a => `${defaultsPrefix}/${a}`
);

const prefix = '@@Rates';
const ratessTypesList = ['ADD_RATES', 'REMOVE_RATES'];

export const ratesActions = ratessTypesList.map(a => `${prefix}/${a}`);
export const ratesActionTypes = prefixer(prefix, ratessTypesList);

export function addRates(data: any) {
  return {
    type: ratesActionTypes.ADD_RATES,
    payload: data
  };
}

export function removeRates(data: any) {
  return {
    type: ratesActionTypes.REMOVE_RATES,
    payload: data
  };
}

const getWebhookType = (url: string) => {
  if (url && /https:\/\/webhooks\.aycd\.io/i.test(url)) {
    return HookTypes.aycd;
  }

  if (
    url &&
    /https:\/\/hooks\.slack\.com\/services\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\/[a-zA-Z-0-9]*/.test(
      url
    )
  ) {
    return HookTypes.slack;
  }

  if (
    url &&
    /https:\/\/(discord|discordapp).com\/api\/webhooks\/[0-9]+\/[_a-zA-Z-0-9]*/.test(
      url
    )
  ) {
    return HookTypes.discord;
  }

  return null;
};

export const settingsActionTypes = prefixer(settingsPrefix, settingsTypesList);
export const accountsActionTypes = prefixer(accountsPrefix, accountsTypesList);
export const webhookActionTypes = prefixer(webhookPrefix, webhookTypesList);
export const defaultsActionTypes = prefixer(defaultsPrefix, defaultsTypesList);

export function uploadAccounts(accounts: any[]) {
  return {
    type: accountsActionTypes.UPLOAD_ACCOUNTS,
    payload: accounts.map((account: any) => account.split(':'))
  };
}

export function importAccounts(accounts: any[]) {
  return {
    type: accountsActionTypes.IMPORT,
    payload: accounts
  };
}

export function setField(field: string, value: string) {
  return {
    type: settingsActionTypes.SET_FIELD,
    payload: {
      field,
      value
    }
  };
}

export function toggleField(field: string) {
  return {
    type: settingsActionTypes.TOGGLE_FIELD,
    payload: { field }
  };
}

export function toggleStagger(value: string) {
  return {
    type: settingsActionTypes.EDIT_STAGGER,
    payload: value
  };
}

export function editAutoSolve(field: string, value: string) {
  return {
    type: settingsActionTypes.EDIT_AUTOSOLVE,
    payload: {
      field,
      value
    }
  };
}

export function setAutoSolveConnected(value: boolean) {
  return {
    type: settingsActionTypes.SET_FIELD,
    payload: {
      field: AUTOSOLVE_FIELDS.CONNECTED,
      value
    }
  };
}

export function setAnalyticsFile(value: string | null) {
  return {
    type: settingsActionTypes.SET_ANALYTICS_FILE,
    payload: {
      field: SETTINGS_FIELDS.ANALYTICS_FILE,
      value
    }
  };
}

export function editWebhook(field: string, value: string) {
  return {
    type: webhookActionTypes.EDIT_WEBHOOK,
    payload: { field, value }
  };
}

export function selectWebhook(webhook: any) {
  return {
    type: webhookActionTypes.SELECT_WEBHOOK,
    payload: webhook
  };
}

export function deleteWebhook(webhook: any) {
  return {
    type: webhookActionTypes.DELETE_WEBHOOK,
    payload: webhook
  };
}

export function saveWebhook(webhook: any) {
  return (dispatch: any) => {
    const newWebhook = { ...webhook };
    const hookType = getWebhookType(newWebhook.url);
    newWebhook.type = hookType;

    dispatch({
      type: webhookActionTypes.SAVE_WEBHOOK,
      payload: newWebhook
    });
  };
}

export function editAccount(field: string, value: string) {
  return (dispatch: any) => {
    dispatch({
      type: accountsActionTypes.EDIT_ACCOUNT,
      payload: {
        field,
        value
      }
    });
  };
}

export function selectAccount(account: any) {
  return (dispatch: any) => {
    dispatch({
      type: accountsActionTypes.SELECT_ACCOUNT,
      payload: account
    });
  };
}

export function deleteAccount(account: any) {
  return (dispatch: any) => {
    dispatch({
      type: accountsActionTypes.DELETE_ACCOUNT,
      payload: account
    });
  };
}

export function saveAccount(account: any) {
  return (dispatch: any) => {
    dispatch({
      type: accountsActionTypes.SAVE_ACCOUNT,
      payload: account
    });
  };
}

export function selectDefault(field: string, value: any) {
  return (dispatch: any) => {
    dispatch({
      type: defaultsActionTypes.SELECT,
      payload: {
        field,
        value
      }
    });
  };
}

export const DEFAULTS_FIELDS = {
  ACCOUNT: 'account',
  MODE: 'mode',
  PROXIES: 'proxies',
  PROFILE: 'profile',
  SIZES: 'sizes'
};

export const ACCOUNT_FIELDS = {
  NAME: 'name',
  USERNAME: 'username',
  PASSWORD: 'password'
};

export const WEBHOOK_FIELDS = {
  NAME: 'name',
  URL: 'url',
  DECLINES: 'declines'
};

export const AUTOSOLVE_FIELDS = {
  CONNECTED: 'autoSolveConnected',
  ACCESS_TOKEN: 'accessToken',
  API_KEY: 'apiKey'
};

export const SETTINGS_FIELDS = {
  PROXY_SITE: 'proxySite',
  COLLAPSED: 'collapsed',
  STATE: 'toggleState',
  SETTINGS: 'toggleSettings',
  CREATE_PROXIES: 'toggleCreateProxies',
  CREATE_PROFILE: 'toggleCreateProfile',
  EDIT_TASK: 'toggleEditTask',
  CREATE_TASK: 'toggleCreateTask',
  CREATE_CAPTCHA: 'toggleCreateCaptcha',
  AUTO_RESTART: 'enableAutoRestart',
  NOTIFICATIONS: 'enableNotifications',
  EDIT_STAGGER: 'stagger',
  PERFORMANCE: 'enablePerformance',
  EXPENSES_VIEW: 'expensesView',
  STATS_VIEW: 'statsView',
  TASKS_GROUP: 'tasksGroup',
  ANALYTICS_FILE: 'analyticsFile'
};
