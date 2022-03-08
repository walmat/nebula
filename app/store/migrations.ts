/* eslint-disable @typescript-eslint/no-unused-vars */

import { ShopifyTypes } from '../constants';
import { RootState } from './reducers';

const updateTasksToIncludeNotification = (task: any) => ({
  ...task,
  splashNotification: true,
  successNotification: true
});

const restockModeToFastMode = (task: any) => ({
  ...task,
  mode: task.mode === ShopifyTypes.RESTOCK ? ShopifyTypes.FAST : task.mode
});

export default {
  0: (state: RootState) => {
    return {
      ...state,
      Settings: {
        ...state.Settings,
        autoSolve: {
          accessToken: '',
          apiKey: ''
        }
      }
    };
  },
  1: (state: RootState) => {
    return {
      ...state,
      Captchas: []
    };
  },
  2: (state: RootState) => ({
    ...state,
    Tasks: Object.values(state.Tasks).map(updateTasksToIncludeNotification)
  }),
  3: (state: RootState) => ({
    ...state,
    Tasks: Object.values(state.Tasks).map(
      ({ quantity, ...t }: { quantity: string }) => t
    )
  }),
  4: (state: RootState) => ({
    ...state,
    CurrentTask: {
      ...state.CurrentTask,
      quantity: 1
    }
  }),
  5: (state: RootState) => ({
    ...state,
    Tasks: Object.values(state.Tasks).map(restockModeToFastMode),
    CurrentTask: {
      ...state.CurrentTask,
      mode:
        state.CurrentTask.mode === ShopifyTypes.RESTOCK
          ? ShopifyTypes.FAST
          : state.CurrentTask.mode
    }
  }),
  6: (state: any) => ({
    ...state,
    Tasks: state.Tasks.map((t: any) => ({ ...t, message: 'Idle' }))
  }),
  7: (state: RootState) => ({
    ...state,
    CurrentTask: {
      ...state.CurrentTask,
      profile: []
    },
    Settings: {
      ...state.Settings,
      toggleSettings: false,
      toggleState: false
    }
  }),
  8: (state: RootState) => {
    const { CurrentTask } = state;

    return {
      ...state,
      CurrentTask: {
        ...CurrentTask,
        rate: null
      }
    };
  },
  9: (state: RootState) => ({
    ...state,
    CurrentWebhook: {
      ...state.CurrentWebhook,
      declines: true
    },
    Webhooks: state.Webhooks.map((webhook: any) => ({
      ...webhook,
      declines: true,
      type: webhook.type || 'discord'
    }))
  }),
  10: (state: RootState) => ({
    ...state,
    Tasks: {},
    Rates: {}
  }),
  11: (state: RootState) => ({
    ...state,
    Tasks: {
      ...state.Tasks,
      default: {
        name: 'Default',
        id: 'default',
        tasks: [],
        selected: true
      }
    }
  }),
  12: (state: RootState) => {
    const hasDefault = Object.values(state.Tasks).some(
      (group: any) => group.id === 'default'
    );

    if (hasDefault) {
      return state;
    }

    // patch in the default group
    return {
      ...state,
      Tasks: {
        ...state.Tasks,
        default: {
          name: 'Default',
          id: 'default',
          tasks: [],
          selected: true
        }
      }
    };
  },
  13: (state: RootState) => {
    return {
      ...state,
      Tasks: {
        ...state.Tasks,
        default: {
          name: 'Default',
          id: 'default',
          tasks: [],
          selected: true
        }
      }
    };
  },
  14: (state: RootState) => {
    return {
      ...state,
      Tasks: Object.values(state.Tasks).reduce((next, entry) => {
        // eslint-disable-next-line no-param-reassign
        next[entry.id] = {
          ...entry,
          list: entry.tasks.map(task => {
            return {
              ...task,
              profile: {
                id: task.profile.id,
                name: task.profile.name
              }
            };
          })
        };
        return next;
      }, {})
    };
  },

  15: (state: RootState) => {
    return {
      ...state,
      Tasks: Object.values(state.Tasks).reduce((next, entry) => {
        // eslint-disable-next-line no-param-reassign
        next[entry.id] = {
          ...entry,
          tasks: entry.tasks.map(restockModeToFastMode)
        };
        return next;
      }, {})
    };
  },

  16: (state: RootState) => {
    const { CurrentCaptcha, ...rest } = state;

    return {
      ...rest,
      Captchas: []
    };
  }
};
