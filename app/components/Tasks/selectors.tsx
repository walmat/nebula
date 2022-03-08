import { createSelector } from 'reselect';
import { CurrentTask, Tasks, EditTask, Delays } from './reducers';

import { RootState } from '../../store/reducers';

const tasksSelector = (state: RootState) => state.Tasks;
const currentTaskSelector = (state: RootState) => state.CurrentTask;
const editTaskSelector = (state: RootState) => state.EditTask;
const delaysSelector = (state: RootState) => state.Delays;

export const makeTasks = createSelector(tasksSelector, state => state || Tasks);

export const makeCurrentTask = createSelector(
  currentTaskSelector,
  state => state || CurrentTask
);

export const makeEditTask = createSelector(
  editTaskSelector,
  state => state || EditTask
);

export const makeDelays = createSelector(
  delaysSelector,
  state => state || Delays
);

export const makeSelectedTasksGroup = createSelector(tasksSelector, state =>
  Object.values(state).find((t: any) => t.selected)
);
