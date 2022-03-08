/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { ipcRenderer } from 'electron';

import prefixer from '../../../utils/reducerPrefixer';

import { States } from '../../../constants';
import { IPCKeys } from '../../../constants/ipc';

const taskPrefix = '@@Tasks';
const taskTypesList = [
  // Individual task actions
  'EDIT', // couples as editing create and edit dialog
  'STATUS',
  // Mass override link
  'INJECT_URL',

  'CLEAR_DIALOG',
  'NOTIFICATION',
  'CREATE_TASKS',
  'UPDATE_TASKS',
  'CANCEL_UPDATE',
  'DELETE_TASKS',
  'SELECT_TASKS',
  'COPY_TASKS',
  'START_TASKS',
  'STOP_TASKS',

  // Group task actions
  'CREATE_GROUP',
  'SELECT_GROUP',
  'UPDATE_GROUP',
  'DELETE_GROUP',
  'COPY_GROUP',

  // I/O Operations
  'IMPORT_TASKS'
];

const delayPrefix = '@@Delays';
const delayTypesList = ['CHANGE_DELAY'];

export const taskActions = taskTypesList.map(a => `${taskPrefix}/${a}`);
export const taskActionTypes = prefixer(taskPrefix, taskTypesList);

export const delayActions = delayTypesList.map(a => `${delayPrefix}/${a}`);
export const delayActionTypes = prefixer(delayPrefix, delayTypesList);

export const editTask = ({
  isEditing,
  field,
  value,
  stores = []
}: {
  isEditing: boolean;
  field: string;
  value: string;
  stores?: any[];
}) => ({
  type: taskActionTypes.EDIT,
  payload: {
    isEditing,
    field,
    value,
    stores
  }
});

export const status = (group: string, buffer: object) => ({
  type: taskActionTypes.STATUS,
  payload: {
    group,
    buffer
  }
});

export const injectUrl = (group: string, tasks: any[], url: string) => {
  const mixin = tasks.map(t => ({
    ...t,
    product: {
      raw: url,
      url
    }
  }));

  return {
    type: taskActionTypes.INJECT_URL,
    payload: {
      group,
      tasks: mixin
    }
  };
};

export function notification(group: string, id: string, type: string) {
  return {
    type: taskActionTypes.NOTIFICATION,
    payload: { group, id, type }
  };
}

export const clearInputs = (isEditing = false) => {
  return {
    type: taskActionTypes.CLEAR_DIALOG,
    payload: {
      isEditing
    }
  };
};

export const createTasks = (group: string, task: any) => {
  return {
    type: taskActionTypes.CREATE_TASKS,
    payload: {
      group,
      task
    }
  };
};

export const updateTasks = (group: string, task: any) => {
  return {
    type: taskActionTypes.UPDATE_TASKS,
    payload: {
      group,
      task
    }
  };
};

export const cancelUpdate = () => {
  return {
    type: taskActionTypes.CANCEL_UPDATE
  };
};

export function deleteTasks(group: string, tasks: any[], useTasks = false) {
  const toStop = tasks.filter(t => t.state === States.Running);

  ipcRenderer.send(IPCKeys.StopTasks, { group, tasks: toStop });

  const payload: any = { group };

  if (useTasks) {
    payload.tasks = tasks;
  }

  return {
    type: taskActionTypes.DELETE_TASKS,
    payload
  };
}

export function selectTasks({
  type = 'All',
  isRangeSelecting = false,
  group,
  id
}: {
  type?: string;
  isRangeSelecting?: boolean;
  group: string;
  id?: string;
}) {
  return {
    type: taskActionTypes.SELECT_TASKS,
    payload: {
      type,
      isRangeSelecting,
      group,
      id
    }
  };
}

export function copyTasks(group: string, tasks: any[]) {
  const toCopy = tasks.map(
    ({
      productName,
      productImage,
      productImageHi,
      chosenSize,
      chosenProxy,
      monitor,
      retry,
      ...t
    }) => ({
      ...t,
      selected: false,
      lastSelected: false,
      splashNotification: true,
      successNotification: true,
      mode: t.backupMode || t.mode,
      state: States.Stopped,
      message: ''
    })
  );

  return {
    type: taskActionTypes.COPY_TASKS,
    payload: {
      group,
      tasks: toCopy
    }
  };
}

export function startTasks(group: string, tasks: any[], delays: any) {
  const newTasks = tasks.filter(t => t.state !== States.Running);

  const toStart = newTasks.map(t => ({
    ...t,
    ...delays,
    state: States.Running,
    message: 'Starting task'
  }));

  ipcRenderer.send(IPCKeys.StartTasks, {
    group,
    tasks: newTasks.map(({ startTime, endTime, ...t }) => ({
      ...t,
      ...delays
    }))
  });

  return {
    type: taskActionTypes.START_TASKS,
    payload: {
      group,
      tasks: toStart
    }
  };
}

export function stopTasks(group: string, tasks: any[]) {
  const newTasks = tasks.filter(t => t.state === States.Running);

  const toStop: any = newTasks.map(
    ({
      productName,
      productImage,
      productImageHi,
      chosenSize,
      chosenProxy,
      startTime,
      endTime,
      ...t
    }: {
      productName?: string;
      productImage?: string;
      productImageHi?: string;
      chosenSize?: string;
      chosenProxy?: string;
    }) => {
      return {
        ...t,
        mode: t.backupMode || t.mode,
        state: States.Stopped,
        splashNotification: true,
        successNotification: true,
        message: 'Idle'
      };
    }
  );

  ipcRenderer.send(IPCKeys.StopTasks, { group, tasks: toStop });

  return {
    type: taskActionTypes.STOP_TASKS,
    payload: {
      group,
      tasks: toStop
    }
  };
}

export function createGroup(value: string) {
  return {
    type: taskActionTypes.CREATE_GROUP,
    payload: value
  };
}

export function selectGroup(id: string | null) {
  return {
    type: taskActionTypes.SELECT_GROUP,
    payload: id
  };
}

export function deleteGroup(id: string) {
  return {
    type: taskActionTypes.DELETE_GROUP,
    payload: id
  };
}

export function importTasks(tasks: any) {
  return {
    type: taskActionTypes.IMPORT_TASKS,
    payload: tasks
  };
}

export const TASK_FIELDS = {
  RESTOCK_MODE: 'restockMode',
  ONE_CHECKOUT: 'oneCheckout',
  CHECKOUT_DELAY: 'checkoutDelay',
  SECURE_BYPASS: 'secureBypass',
  MAX_PRICE: 'maxPrice',
  MIN_PRICE: 'minPrice',
  PASSWORD: 'password',
  MONITOR: 'monitor',
  RETRY: 'retry',
  SHIPPING_RATE: 'rate',
  PRODUCT: 'product',
  PROXIES: 'proxies',
  ACCOUNT: 'account',
  CATEGORY: 'category',
  VARIATION: 'variation',
  STYLE_ID: 'styleId',
  STORE: 'store',
  PROFILE: 'profile',
  START_TIME: 'startTime',
  END_TIME: 'endTime',
  SIZES: 'sizes',
  ROTATE: 'rotate',
  QUANTITY: 'quantity',
  DISCOUNT: 'discount',
  AMOUNT: 'amount',
  PAYPAL: 'paypal',
  CAPTCHA: 'captcha',
  USE_MOCKS: 'USE_MOCKS', // DEV ONLY
  MODE: 'mode'
};

export function changeDelay(
  group: string,
  num: string,
  field: string,
  tasks: any[]
) {
  const delay = Number(num || '0');
  if (Number.isNaN(delay)) {
    return;
  }

  ipcRenderer.send(IPCKeys.ChangeDelay, group, delay, field, tasks);

  return {
    type: delayActionTypes.CHANGE_DELAY,
    payload: {
      field,
      delay
    }
  };
}
