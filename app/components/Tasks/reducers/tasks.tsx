import moment from 'moment';
import { ipcRenderer } from 'electron';
import { omit, isEmpty, merge } from 'lodash';
import { PURGE } from 'redux-persist';

import { proxiesActionTypes } from '../../Proxies/actions';
import { accountsActionTypes } from '../../Settings/actions';
import { profilesActionTypes } from '../../Profiles/actions';
import { taskActionTypes } from '../actions';
import { trimFat } from '../../../utils/trimFat';
import { _getId, parseProduct, Platforms, States } from '../../../constants';
import { IPCKeys } from '../../../constants/ipc';
import { IS_DEV } from '../../../constants/env';

import { CurrentTask } from './current';

const getLast = (obj: any) => Object.keys(obj)[Object.keys(obj).length - 1];
const getFirst = (obj: any) => Object.keys(obj)[0];

const getElement = (items: Tasks, key: string, i: number) => {
  const keys = Object.keys(items);
  let index = keys.indexOf(key);
  if ((i === -1 && index > 0) || (i === 1 && index < keys.length - 1)) {
    index += i;
  }
  return keys[index];
};

const createTask = (task: CurrentTask) => {
  const parsedProduct = parseProduct(task.product, task.platform);
  if (!parsedProduct) {
    return null;
  }

  const newTask = { ...task };
  newTask.product = parsedProduct;

  // trim some fat off the task object per platform..
  const slimTask = trimFat(newTask);

  slimTask.message = 'Idle';

  if (
    slimTask.startTime &&
    moment(slimTask.startTime).diff(moment(), 'seconds') > 0
  ) {
    slimTask.message = `Starting at ${moment(slimTask.startTime).format(
      'h:mm:ss A'
    )}`;
  }

  return newTask;
};

type Task = {
  name: string;
  id: string;
  tasks: CurrentTask[];
  selected: boolean;
};

export type Tasks = {
  [key: string]: Task;
};

export const initialState: Tasks = {
  default: {
    name: 'Default',
    id: 'default',
    tasks: [],
    selected: true
  }
};
export function Tasks(state = initialState, action: any) {
  const { type, payload } = action;
  switch (type) {
    case PURGE:
      return { ...initialState };

    case taskActionTypes.CREATE_GROUP: {
      if (payload === 'default' && !state.default) {
        return {
          ...state,
          default: {
            name: 'Default',
            id: 'default',
            tasks: [],
            selected: false
          }
        };
      }

      const { id } = _getId(state);
      return {
        ...state,
        [id]: {
          id,
          name: payload,
          tasks: [],
          selected: false
        }
      };
    }

    case taskActionTypes.SELECT_GROUP: {
      const lastElement = getLast(state);
      const firstElement = getFirst(state);

      if (payload === 'previous') {
        // if first === last, we only have one element, toggle it
        if (lastElement === firstElement) {
          // note, it doesn't matter what element we change here since
          // both are the same
          return {
            ...state,
            [firstElement]: {
              ...state[firstElement],
              selected: !state[firstElement].selected
            }
          };
        }

        // if there is no group selected, select the last group
        if (!Object.values(state).some((group: any) => group.selected)) {
          return {
            ...state,
            [lastElement]: {
              ...state[lastElement],
              selected: true
            }
          };
        }

        // if the first is selected, let's unselect it and select the last group
        if (state[firstElement]?.selected) {
          return {
            ...state,
            [firstElement]: {
              ...state[firstElement],
              selected: false
            },
            [lastElement]: {
              ...state[lastElement],
              selected: true
            }
          };
        }

        const selected: any = Object.values(state).find(
          (group: any) => group.selected
        );
        const previous = getElement(state, selected.id, -1);

        return {
          ...state,
          [selected.id]: {
            ...state[selected.id],
            selected: false
          },
          [previous]: {
            ...state[previous],
            selected: true
          }
        };
      }

      if (payload === 'next') {
        // if first === last, we only have one element, toggle it
        if (lastElement === firstElement) {
          // note, it doesn't matter what element we change here since
          // both are the same
          return {
            ...state,
            [firstElement]: {
              ...state[firstElement],
              selected: !state[firstElement].selected
            }
          };
        }

        // if there is no group selected, default to select the first group
        if (!Object.values(state).some((group: any) => group.selected)) {
          return {
            ...state,
            [firstElement]: {
              ...state[firstElement],
              selected: true
            }
          };
        }

        // if the last is selected, let's unselect it and select the first group
        if (state[lastElement]?.selected) {
          return {
            ...state,
            [lastElement]: {
              ...state[lastElement],
              selected: false
            },
            [firstElement]: {
              ...state[firstElement],
              selected: true
            }
          };
        }

        const selected: any = Object.values(state).find(
          (group: any) => group.selected
        );
        const next = getElement(state, selected.id, +1);

        return {
          ...state,
          [selected.id]: {
            ...state[selected.id],
            selected: false
          },
          [next]: {
            ...state[next],
            selected: true
          }
        };
      }

      return Object.keys(state).reduce(
        (acc, id) => ({
          ...acc,
          [id]: { ...state[id], selected: id === payload || false }
        }),
        {}
      );
    }

    case taskActionTypes.DELETE_GROUP: {
      if (!payload) {
        return state;
      }

      return omit(state, payload);
    }

    case taskActionTypes.INJECT_URL: {
      const { group, tasks } = payload;

      if (!group) {
        return state;
      }

      const tasksGroup = state[group];
      if (!tasksGroup) {
        return state;
      }

      ipcRenderer.send(IPCKeys.UpdateTasks, { group, tasks });

      return {
        ...state,
        [tasksGroup.id]: {
          ...tasksGroup,
          tasks: tasksGroup.tasks.map(
            (t: any) => tasks.find((task: any) => task.id === t.id) || t
          )
        }
      };
    }

    case taskActionTypes.NOTIFICATION: {
      const { group, id, type } = payload;

      if (!group) {
        return state;
      }

      const tasksGroup = state[group];
      if (!tasksGroup) {
        return state;
      }

      return {
        ...state,
        [tasksGroup.id]: {
          ...tasksGroup,
          tasks: tasksGroup.tasks.map((t: any) => {
            if (t.id === id) {
              return {
                ...t,
                [type]: false
              };
            }
            return t;
          })
        }
      };
    }

    case taskActionTypes.UPDATE_TASKS: {
      const { group, task } = payload;

      if (!group) {
        return state;
      }

      const tasksGroup = state[group];
      if (!tasksGroup || !tasksGroup.tasks.some((t: any) => t.selected)) {
        return state;
      }

      return {
        ...state,
        [tasksGroup.id]: {
          ...tasksGroup,
          tasks: tasksGroup.tasks.map((t: CurrentTask) => {
            // only change selected tasks...
            if (t.selected) {
              const changes = { ...task };

              if (changes.product) {
                const parsedProduct = parseProduct(changes.product, t.platform);
                changes.product = parsedProduct;
              }

              if (changes.mode) {
                changes.backupMode = changes.mode;
              }

              if (changes.profile) {
                changes.profile = {
                  id: task.profile.value,
                  name: task.profile.label
                };
              }

              if (changes.proxies?.id === 'None') {
                changes.proxies = null;
              }

              if (changes.account?.value?.id === 'None') {
                changes.account = null;
              }

              const slimTask = trimFat(changes);

              if (
                slimTask.startTime &&
                moment(slimTask.startTime).diff(moment(), 'seconds') > 0
              ) {
                slimTask.message = `Starting at ${moment(
                  slimTask.startTime
                ).format('h:mm:ss A')}`;
              }

              const newTask = { ...t, ...slimTask };
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { startTime, endTime, ...tasks } = newTask;

              ipcRenderer.send(IPCKeys.UpdateTasks, {
                group,
                tasks
              });

              return newTask;
            }
            return t;
          })
        }
      };
    }

    case taskActionTypes.CREATE_TASKS: {
      const { group, task } = payload;

      switch (task.platform) {
        case Platforms.Supreme:
          if (!task.variation) {
            task.variation = 'random';
          }

          if (
            !task?.store ||
            !task?.profile ||
            !task?.sizes ||
            !task?.product?.raw ||
            !task?.category ||
            !task?.variation ||
            !task?.mode
          ) {
            return state;
          }
          break;
        case Platforms.Shopify:
        case Platforms.YeezySupply:
          if (
            !task?.store ||
            !task?.profile ||
            !task?.sizes ||
            !task?.product?.raw ||
            !task?.mode
          ) {
            return state;
          }
          break;

        default:
          break;
      }

      const slimTask = createTask(task);
      if (!slimTask) {
        return state;
      }

      if (!IS_DEV) {
        slimTask.useMocks = false;
      }

      if (slimTask.platform === Platforms.Supreme) {
        slimTask.captcha = true;
      } else {
        slimTask.captcha = false;
      }

      // NOTE: Uncomment to test mocks in prod
      // slimTask.useMocks = true;

      const { amount, quicktask } = task;
      delete slimTask.amount;

      const tasksGroup = state[group];
      if (!tasksGroup) {
        return state;
      }

      const newTasks = [...Array(amount)].map(() => {
        const { id } = _getId([]);
        return { ...slimTask, id };
      });

      // if we're quicktasking, let's kick off the tasks from here...
      if (quicktask) {
        ipcRenderer.send(IPCKeys.StartTasks, { group, tasks: newTasks });
      }

      return {
        ...state,
        [tasksGroup.id]: {
          ...tasksGroup,
          tasks: [...tasksGroup.tasks, ...newTasks]
        }
      };
    }

    case taskActionTypes.DELETE_TASKS: {
      const { group, tasks = [] } = payload;

      if (!group) {
        return state;
      }

      const tasksGroup = state[group];
      if (!tasksGroup) {
        return state;
      }

      if (tasks.length) {
        return {
          ...state,
          [tasksGroup.id]: {
            ...tasksGroup,
            tasks: tasksGroup.tasks.filter(
              t => !tasks.some(task => task.id === t.id)
            )
          }
        };
      }

      return {
        ...state,
        [tasksGroup.id]: {
          ...tasksGroup,
          tasks: tasksGroup.tasks.filter((t: any) => !t.selected)
        }
      };
    }

    case taskActionTypes.COPY_TASKS: {
      const { group, tasks } = payload;

      if (!group || !tasks?.length) {
        return state;
      }

      const tasksGroup = state[group];
      if (!tasksGroup) {
        return state;
      }

      return {
        ...state,
        [tasksGroup.id]: {
          ...tasksGroup,
          tasks: [
            ...tasksGroup.tasks,
            ...tasks.map((task: any) => {
              const { id } = _getId(state);
              return {
                ...task,
                id,
                selected: false,
                message: 'Idle',
                state: States.Stopped
              };
            })
          ]
        }
      };
    }

    case taskActionTypes.STATUS: {
      const { group, buffer } = payload;

      const tasksGroup = state[group];
      if (!tasksGroup) {
        return state;
      }

      return {
        ...state,
        [tasksGroup.id]: {
          ...tasksGroup,
          tasks: tasksGroup.tasks.map((t: any) => {
            if (t.state === States.Running) {
              return {
                ...t,
                ...buffer[t.id]
              };
            }
            return t;
          })
        }
      };
    }

    case taskActionTypes.SELECT_TASKS: {
      const { type, isRangeSelecting, group, id } = payload;

      if (!group) {
        return state;
      }

      const tasksGroup = state[group];
      if (!tasksGroup) {
        return state;
      }

      if (type === 'All') {
        // if some task is not selected, we're toggling all on...
        if (tasksGroup.tasks.some((t: any) => !t.selected)) {
          return {
            ...state,
            [tasksGroup.id]: {
              ...tasksGroup,
              tasks: tasksGroup.tasks.map((t: any) => ({
                ...t,
                selected: true,
                lastSelected: false
              }))
            }
          };
        }

        // otherwise, toggle all off...
        return {
          ...state,
          [tasksGroup.id]: {
            ...tasksGroup,
            tasks: tasksGroup.tasks.map((t: any) => ({
              ...t,
              selected: false,
              lastSelected: false
            }))
          }
        };
      }

      const lastSelected = tasksGroup.tasks.findIndex(
        (t: any) => t.lastSelected
      );

      if (isRangeSelecting) {
        const selected = tasksGroup.tasks.findIndex((t: any) => t.id === id);

        // we're just toggling the same task here...
        if (lastSelected === -1 || lastSelected === selected) {
          return {
            ...state,
            [tasksGroup.id]: {
              ...tasksGroup,
              tasks: tasksGroup.tasks.map((t: any) => {
                if (t.id === id) {
                  return {
                    ...t,
                    selected: !t.selected,
                    lastSelected: true
                  };
                }
                return t;
              })
            }
          };
        }

        // we moved bottom to top in the task list, let's select the range
        if (lastSelected > selected) {
          const toggleSelected = tasksGroup.tasks
            .slice(selected, lastSelected)
            .some((t: any) => !t.selected);

          return {
            ...state,
            [tasksGroup.id]: {
              ...tasksGroup,
              tasks: tasksGroup.tasks.map((t: any, index: number) => {
                // bound check to set the new last selected
                if (index === selected) {
                  return {
                    ...t,
                    selected: toggleSelected,
                    lastSelected: true
                  };
                }

                if (index >= selected && index <= lastSelected) {
                  return {
                    ...t,
                    selected: toggleSelected,
                    lastSelected: false
                  };
                }

                return t;
              })
            }
          };
        }

        // we moved top to bottom in the task list, let's select the range
        if (lastSelected < selected) {
          const toggleSelected = tasksGroup.tasks
            .slice(lastSelected, selected + 1)
            .some((t: any) => !t.selected);

          return {
            ...state,
            [tasksGroup.id]: {
              ...tasksGroup,
              tasks: tasksGroup.tasks.map((t: any, index: number) => {
                if (index === selected) {
                  return {
                    ...t,
                    selected: toggleSelected,
                    lastSelected: true
                  };
                }

                if (index >= lastSelected && index <= selected) {
                  return {
                    ...t,
                    selected: toggleSelected,
                    lastSelected: false
                  };
                }

                return t;
              })
            }
          };
        }
      }

      // if we're just selecting a single task, toggle it
      return {
        ...state,
        [tasksGroup.id]: {
          ...tasksGroup,
          tasks: tasksGroup.tasks.map((t: any) => {
            if (t.id === id) {
              return {
                ...t,
                selected: !t.selected,
                lastSelected: !t.selected
              };
            }
            return t;
          })
        }
      };
    }

    case taskActionTypes.START_TASKS:
    case taskActionTypes.STOP_TASKS: {
      const { group, tasks } = payload;

      if (!group) {
        return state;
      }

      const tasksGroup = state[group];
      if (!tasksGroup || !tasks?.length) {
        return state;
      }

      return {
        ...state,
        [tasksGroup.id]: {
          ...tasksGroup,
          tasks: tasksGroup.tasks.map(
            (t: any) => tasks.find((task: any) => task.id === t.id) || t
          )
        }
      };
    }

    case taskActionTypes.IMPORT_TASKS: {
      if (!payload || isEmpty(payload)) {
        return state;
      }

      return merge({}, state, payload);
    }

    case profilesActionTypes.SAVE: {
      if (!payload || (payload && !payload.id)) {
        return state;
      }

      return Object.keys(state).reduce(
        (acc, id) => ({
          ...acc,
          [id]: {
            ...state[id],
            tasks: state[id].tasks.map((task: any) => {
              if (task.profile?.id === payload.id) {
                return { ...task, profile: payload };
              }
              return task;
            })
          }
        }),
        {}
      );
    }

    case profilesActionTypes.DELETE: {
      if (!payload || (payload && !payload.id)) {
        return state;
      }

      return Object.keys(state).reduce(
        (acc, id) => ({
          ...acc,
          [id]: {
            ...state[id],
            tasks: state[id].tasks.filter((task: any) => {
              if (task.profile?.id === payload.id) {
                ipcRenderer.send(IPCKeys.StopTasks, {
                  group: id,
                  tasks: task
                });
                return false;
              }
              return true;
            })
          }
        }),
        {}
      );
    }

    case profilesActionTypes.DELETE_ALL: {
      // we deleted ALL profiles, stop ALL tasks and remove them
      return Object.keys(state).reduce(
        (acc, id) => ({
          ...acc,
          [id]: {
            ...state[id],
            tasks: state[id].tasks.filter((task: any) => {
              ipcRenderer.send(IPCKeys.StopTasks, {
                group: id,
                tasks: task
              });

              return false;
            })
          }
        }),
        {}
      );
    }

    case accountsActionTypes.SAVE_ACCOUNT: {
      if (!payload || (payload && !payload.id)) {
        return state;
      }

      return Object.keys(state).reduce(
        (acc, id) => ({
          ...acc,
          [id]: {
            ...state[id],
            tasks: state[id].tasks.map((task: any) => {
              if (task.account?.id === payload.id) {
                return { ...task, account: payload };
              }
              return task;
            })
          }
        }),
        {}
      );
    }

    case accountsActionTypes.DELETE_ACCOUNT: {
      if (!payload || (payload && !payload.id)) {
        return state;
      }

      return Object.keys(state).reduce(
        (acc, id) => ({
          ...acc,
          [id]: {
            ...state[id],
            tasks: state[id].tasks.map((task: any) => {
              if (task.account?.id === payload.id) {
                return {
                  ...task,
                  account: null
                };
              }
              return task;
            })
          }
        }),
        {}
      );
    }

    case proxiesActionTypes.CREATE: {
      if (!payload || (payload && !payload.id)) {
        return state;
      }

      return Object.keys(state).reduce(
        (acc, id) => ({
          ...acc,
          [id]: {
            ...state[id],
            tasks: state[id].tasks.map((task: any) => {
              if (task.proxies?.id === payload.id) {
                return {
                  ...task,
                  proxies: payload
                };
              }
              return task;
            })
          }
        }),
        {}
      );
    }

    case proxiesActionTypes.DELETE: {
      if (!payload || (payload && !payload.id)) {
        return state;
      }

      return Object.keys(state).reduce(
        (acc, id) => ({
          ...acc,
          [id]: {
            ...state[id],
            tasks: state[id].tasks.map((task: any) => {
              if (task.proxies?.id === payload.id) {
                return {
                  ...task,
                  proxies: null
                };
              }
              return task;
            })
          }
        }),
        {}
      );
    }

    default:
      return state;
  }
}
