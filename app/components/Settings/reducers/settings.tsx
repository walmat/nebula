import { ipcRenderer } from 'electron';
import { PURGE } from 'redux-persist';

import { settingsActionTypes } from '../actions';
import { Groups, VIEWS } from '../../../constants';

import { settingsStorage } from '../../../utils/storageHelper';
import { IPCKeys } from '../../../constants/ipc';

type AutoSolve = {
  accessToken: string;
  apiKey: string;
};

type Store = {
  name: string;
  url: string;
};

export type Settings = {
  collapsed: boolean;
  autoSolve: AutoSolve;
  autoSolveConnected: boolean;
  proxySite: null | Store;
  expensesView: string;
  statsView: string;
  tasksGroup: string;
  toggleCreateProxies: boolean;
  toggleCreateProfile: boolean;
  toggleEditTask: boolean;
  toggleCreateTask: boolean;
  enableAutoRestart: boolean;
  enableNotifications: boolean;
  enablePerformance: boolean;
  stagger: number;
  analyticsFile: string;
};

export const settingsInitialState: Settings = {
  collapsed: false,
  autoSolve: {
    accessToken: '',
    apiKey: ''
  },
  proxySite: null,
  autoSolveConnected: false,
  expensesView: VIEWS.Weekly,
  statsView: VIEWS.Weekly,
  tasksGroup: Groups.None,
  toggleCreateProxies: false,
  toggleCreateProfile: false,
  toggleEditTask: false,
  toggleCreateTask: false,
  enableAutoRestart: false,
  enableNotifications: false,
  enablePerformance: false,
  stagger: 1,
  analyticsFile: ''
};

type Action = {
  type: string;
  payload?: any;
};

export function Settings(state = settingsInitialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return { ...settingsInitialState };

    // togglers
    case settingsActionTypes.TOGGLE_FIELD: {
      const { field } = payload;

      if (!field) {
        return state;
      }

      const value = !state[field] || false;

      settingsStorage.set(field, value);

      return { ...state, [field]: value };
    }

    // setters
    case settingsActionTypes.SET_FIELD: {
      if (!payload) {
        return state;
      }

      const { field, value } = payload;

      if (!field) {
        return state;
      }

      return { ...state, [field]: value };
    }

    case settingsActionTypes.EDIT_AUTOSOLVE: {
      const { field, value } = payload;

      if (!field) {
        return state;
      }

      return { ...state, autoSolve: { ...state.autoSolve, [field]: value } };
    }

    case settingsActionTypes.EDIT_STAGGER: {
      ipcRenderer.send(IPCKeys.ChangeStagger, payload || 1);

      return {
        ...state,
        stagger: payload || 1
      };
    }

    case settingsActionTypes.SET_ANALYTICS_FILE: {
      const { field, value } = payload;

      if (!field) {
        return state;
      }

      if (!value) {
        ipcRenderer.send(IPCKeys.RemoveAnalyticsFile);
      } else {
        ipcRenderer.send(IPCKeys.AddAnalyticsFile, value);
      }

      return { ...state, [field]: value };
    }

    case settingsActionTypes.COPY_JSON_FILE_TO_SETTINGS:
      return {
        ...state,
        ...payload,
        autoSolve: {
          ...payload.autoSolve,
          ...state.autoSolve
        }
      };

    default:
      return state;
  }
}
