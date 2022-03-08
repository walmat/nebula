import prefixer from '../../utils/reducerPrefixer';

const appPrefix = '@@App';
const appActionTypesList = [
  'REQ_LOAD',
  'RES_LOAD',
  'FAIL_LOAD',
  'LOGOUT',
  'SET_THEME',
  'IMPORT_STATE'
];

export const globalActions = appActionTypesList.map(a => `${appPrefix}/${a}`);
export const globalActionTypes = prefixer(appPrefix, appActionTypesList);

export function setTheme(theme: number) {
  return {
    type: globalActionTypes.SET_THEME,
    payload: theme
  };
}

export function importAll(state: any) {
  return {
    type: globalActionTypes.IMPORT_STATE,
    payload: state
  };
}

export function reqLoadApp() {
  return {
    type: globalActionTypes.REQ_LOAD
  };
}
export function resLoadApp() {
  return {
    type: globalActionTypes.RES_LOAD
  };
}

export function failLoadApp(e: any) {
  return {
    type: globalActionTypes.FAIL_LOAD,
    payload: {
      error: e
    }
  };
}

const userPrefix = '@@User';
const userActionTypesList = ['SET_USER'];

export const userActions = userActionTypesList.map(a => `${userPrefix}/${a}`);
export const userActionTypes = prefixer(userPrefix, userActionTypesList);

export function setUser(user: any) {
  return (dispatch: any) => {
    dispatch({
      type: userActionTypes.SET_USER,
      payload: user
    });
  };
}

const storesPrefix = '@@Stores';
const storesActionTypesList = ['ADD_STORE', 'SET_STORES'];

export const storesActions = storesActionTypesList.map(
  a => `${storesPrefix}/${a}`
);
export const storesActionTypes = prefixer(storesPrefix, storesActionTypesList);

export function addStore(newStore: any) {
  return {
    type: storesActionTypes.ADD_STORE,
    payload: newStore
  };
}

export function setStores(stores: any[]) {
  return {
    type: storesActionTypes.SET_STORES,
    payload: stores
  };
}
