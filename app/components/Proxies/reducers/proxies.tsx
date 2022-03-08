import { PURGE } from 'redux-persist';

import { ipcRenderer } from 'electron';
import { proxiesActionTypes } from '../actions';
import { _getId } from '../../../constants';
import { IPCKeys } from '../../../constants/ipc';

import { CurrentProxies } from './current';

export type Proxies = CurrentProxies[];

export const initialState: Proxies = [];

type Action = {
  type: string;
  payload?: any;
};

export function Proxies(state = initialState, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return [...initialState];

    case proxiesActionTypes.RESET_STATUS: {
      return state.map(group => ({
        ...group,
        proxies: group.proxies.map((proxy: any) => ({ ...proxy, inUse: false }))
      }));
    }

    case proxiesActionTypes.UPDATE_STATUS: {
      if (!payload) {
        return state;
      }

      return state.map(group => {
        if (group.id === payload.groupId) {
          return {
            ...group,
            proxies: group.proxies.map((proxy: any) => {
              if (proxy.ip === payload.proxy) {
                return {
                  ...proxy,
                  inUse: payload.status
                };
              }
              return proxy;
            })
          };
        }
        return group;
      });
    }

    case proxiesActionTypes.UPDATE_SPEED: {
      const { group, results } = payload;

      const proxyGroup = state.find(({ id }) => id === group);
      if (!proxyGroup) {
        return state;
      }

      return state.map(g => {
        if (g.id !== group) {
          return g;
        }

        return {
          ...g,
          proxies: proxyGroup.proxies.map(p => ({
            ...p,
            ...results[p.ip]
          }))
        };
      });
    }

    case proxiesActionTypes.REMOVE_FAILED: {
      if (!payload) {
        return state;
      }

      return state.map(group => {
        if (group.id === payload.id) {
          const newGroup = {
            ...group,
            proxies: group.proxies.filter(
              ({ speed }: { speed: string | null }) => {
                if (speed && /failed/i.test(speed)) {
                  return false;
                }

                return true;
              }
            )
          };

          ipcRenderer.send(IPCKeys.AddProxies, newGroup);

          return newGroup;
        }
        return group;
      });
    }

    case proxiesActionTypes.CREATE: {
      if (!payload) {
        return state;
      }

      // updating existing list...
      if (payload.id) {
        return state.map(p => {
          if (p.id === payload.id) {
            ipcRenderer.send(IPCKeys.AddProxies, payload);

            return payload;
          }
          return p;
        });
      }

      const { id } = _getId(state);

      const newGroup = { ...payload, id };

      ipcRenderer.send(IPCKeys.AddProxies, newGroup);

      return [...state, newGroup];
    }

    case proxiesActionTypes.DELETE_GROUP: {
      if (!payload) {
        return state;
      }

      ipcRenderer.send(IPCKeys.RemoveProxies, payload);

      return state.filter(t => !t.selected);
    }

    case proxiesActionTypes.DELETE_PROXY: {
      if (!payload) {
        return state;
      }

      return state.map(group => {
        if (group.id === payload.group) {
          const newGroup = {
            ...group,
            proxies: group.proxies.filter(({ ip }: { ip: string }) => {
              if (ip === payload.proxy) {
                return false;
              }

              return true;
            })
          };

          ipcRenderer.send(IPCKeys.AddProxies, newGroup);
          return newGroup;
        }
        return group;
      });
    }

    case proxiesActionTypes.SET_LOADING: {
      if (!payload) {
        return state;
      }

      return state.map(groups => {
        if (groups.selected) {
          return {
            ...groups,
            proxies: groups.proxies.map(p => {
              if (p.selected) {
                return {
                  ...p,
                  speed: null,
                  isLoading: true
                };
              }
              return p;
            })
          };
        }
        return groups;
      });
    }

    case proxiesActionTypes.SET_SELECTED: {
      if (!payload && payload !== 0) {
        return state;
      }

      return state.map(groups => {
        if (groups.selected) {
          return {
            ...groups,
            proxies: groups.proxies.map((p: any, i: number) => {
              if (i === payload) {
                return {
                  ...p,
                  selected: !p.selected
                };
              }
              return p;
            })
          };
        }
        return groups;
      });
    }

    case proxiesActionTypes.SET_ALL_SELECTED: {
      return state.map(group => {
        if (group.selected) {
          if (group.proxies.every((p: any) => p.selected)) {
            return {
              ...group,
              proxies: group.proxies.map((p: any) => ({
                ...p,
                selected: false
              }))
            };
          }
          return {
            ...group,
            proxies: group.proxies.map((p: any) => ({ ...p, selected: true }))
          };
        }
        return group;
      });
    }

    case proxiesActionTypes.SELECT: {
      return state.map(t => {
        if (t.id === payload) {
          return {
            ...t,
            selected: !t.selected
          };
        }
        return {
          ...t,
          selected: false
        };
      });
    }
    default:
      return state;
  }
}
