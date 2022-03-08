/* eslint-disable no-unused-vars */

import prefixer from '../../../utils/reducerPrefixer';
import { toggleField, SETTINGS_FIELDS } from '../../Settings/actions';

const prefix = '@@Proxies';
const proxiesTypesList = [
  'EDIT',
  'RESET_STATUS',
  'UPDATE_STATUS',
  'SET_SELECTED',
  'SET_ALL_SELECTED',
  'LOAD',
  'SELECT',
  'CREATE',
  'SET_LOADING',
  'DELETE_GROUP',
  'DELETE_PROXY',
  'UPDATE_SPEED',
  'REMOVE_FAILED'
];

export const proxiesActions = proxiesTypesList.map(a => `${prefix}/${a}`);
export const proxiesActionTypes = prefixer(prefix, proxiesTypesList);

export function deleteProxies(group) {
  return dispatch => {
    dispatch({
      type: proxiesActionTypes.DELETE_GROUP,
      payload: group
    });
  };
}

export function deleteProxy(group, proxy) {
  return dispatch => {
    dispatch({
      type: proxiesActionTypes.DELETE_PROXY,
      payload: { group, proxy }
    });
  };
}

export function removeFailed(group) {
  return dispatch => {
    dispatch({
      type: proxiesActionTypes.REMOVE_FAILED,
      payload: group
    });
  };
}

export function resetProxiesStatus() {
  return dispatch => {
    dispatch({
      type: proxiesActionTypes.RESET_STATUS
    });
  };
}

export function loadProxies(proxies) {
  return dispatch => {
    dispatch({
      type: proxiesActionTypes.LOAD,
      payload: proxies
    });
    dispatch(toggleField(SETTINGS_FIELDS.CREATE_PROXIES));
  };
}

export function selectProxies(selected) {
  return {
    type: proxiesActionTypes.SELECT,
    payload: selected
  };
}

export const createProxies = proxy => {
  return dispatch => {
    dispatch({
      type: proxiesActionTypes.CREATE,
      payload: proxy
    });
  };
};

export const updateProxyStatus = (groupId, proxy, status) => {
  return dispatch => {
    dispatch({
      type: proxiesActionTypes.UPDATE_STATUS,
      payload: {
        groupId,
        proxy,
        status
      }
    });
  };
};

export function setLoading(proxies) {
  return {
    type: proxiesActionTypes.SET_LOADING,
    payload: proxies
  };
}

export function setSelected(selected) {
  return {
    type: proxiesActionTypes.SET_SELECTED,
    payload: selected
  };
}

export function setAllSelected() {
  return {
    type: proxiesActionTypes.SET_ALL_SELECTED
  };
}

export const editProxies = ({ id, field, value }) => ({
  type: proxiesActionTypes.EDIT,
  payload: {
    id,
    field,
    value
  }
});

export const PROXY_FIELDS = {
  NAME: 'name',
  PROXIES: 'proxies'
};

export const proxyUpdateSpeed = (group: string, results: any) => ({
  type: proxiesActionTypes.UPDATE_SPEED,
  payload: {
    group,
    results
  }
});
