import { parseURL } from 'whatwg-url';
import { useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';
import {
  injectUrl,
  selectGroup,
  selectTasks,
  startTasks,
  stopTasks
} from './actions';
import { States } from '../../constants';
import { makeUser } from '../App/selectors';
import { makeSelectedTasksGroup, makeDelays, makeTasks } from './selectors';

const getSelected = (selectedGroup: any) => {
  if (!selectedGroup) {
    return [];
  }

  return selectedGroup.tasks.filter((t: any) => t.selected);
};

export const useTaskKeyPress = (
  setIsRangeSelecting: Function,
  all: boolean
) => {
  const dispatch = useDispatch();
  const store = useStore();

  const _handleUnsetRangeSelecting = async ({
    ctrlKey,
    shiftKey,
    metaKey
  }: {
    ctrlKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
  }) => {
    if (!ctrlKey && !shiftKey && !metaKey) {
      setIsRangeSelecting(false);
    }
  };

  const _handleKeyPress = async ({
    keyCode,
    shiftKey,
    ctrlKey,
    metaKey
  }: {
    keyCode: number;
    shiftKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
  }) => {
    if (shiftKey || ctrlKey || metaKey) {
      setIsRangeSelecting(true);
    }

    switch (keyCode) {
      // left arrow key
      case 38: {
        if (!shiftKey && !metaKey) {
          return;
        }

        return dispatch(selectGroup('previous'));
      }

      case 40: {
        if (!shiftKey && !metaKey) {
          return;
        }

        return dispatch(selectGroup('next'));
      }
      // (ctrl || shift | cmd) + A
      case 65: {
        const state = store.getState();

        const isOpen =
          state.Settings.toggleCreateTask || state.Settings.toggleEditTask;
        if (isOpen) {
          return null;
        }

        if (all && (shiftKey || ctrlKey || metaKey)) {
          const groups = makeTasks(state);

          const needsSelected = Object.values(groups).find(group =>
            group.tasks.some(t => !t.selected)
          );

          if (needsSelected) {
            return Object.values(groups).map(({ id: group, tasks }) => {
              if (tasks.some(t => !t.selected)) {
                return dispatch(selectTasks({ group }));
              }

              return null;
            });
          }

          return Object.values(groups).map(({ id: group }) =>
            dispatch(selectTasks({ group }))
          );
        }

        const selectedTaskGroup = makeSelectedTasksGroup(state);
        if ((!shiftKey && !ctrlKey && !metaKey) || !selectedTaskGroup) {
          return null;
        }

        return dispatch(selectTasks({ group: selectedTaskGroup.id }));
      }
      // F1
      case 112: {
        const state = store.getState();
        const { id } = makeUser(state);
        const { monitor, retry } = makeDelays(state);

        if (all) {
          const groups = makeTasks(state);
          return Object.values(groups).map(group => {
            const selected = getSelected(group);

            if (!selected.length) {
              return null;
            }

            return dispatch(startTasks(group.id, selected, { monitor, retry }));
          });
        }

        const selectedTaskGroup = makeSelectedTasksGroup(state);
        const selected = getSelected(selectedTaskGroup);
        if (!selectedTaskGroup || !selected?.length || !id) {
          return null;
        }

        return dispatch(
          startTasks(selectedTaskGroup?.id, selected, {
            monitor,
            retry
          })
        );
      }
      // F2
      case 113: {
        const state = store.getState();

        if (all) {
          const groups = makeTasks(state);
          return Object.values(groups).map(group => {
            const selected = getSelected(group);

            if (!selected.length) {
              return null;
            }

            return dispatch(stopTasks(group.id, selected));
          });
        }

        const selectedTaskGroup = makeSelectedTasksGroup(state);
        const selected = getSelected(selectedTaskGroup);

        if (!selectedTaskGroup || !selected.length) {
          return null;
        }
        return dispatch(stopTasks(selectedTaskGroup.id, selected));
      }
      // F3
      case 114: {
        const url = await navigator.clipboard.readText();
        const URL = parseURL(url);

        if (!URL || !URL.host || (URL.path && !URL.path[0])) {
          return null;
        }

        const state = store.getState();

        if (all) {
          const groups = makeTasks(state);
          return Object.values(groups).map(group => {
            const tasksToChange = group.tasks.filter(
              (t: any) =>
                t.store.url.indexOf(URL.host) > -1 &&
                t.state === States.Running &&
                t.product.raw !== url // check raw cause url could be undefined...
            );

            return dispatch(injectUrl(group.id, tasksToChange, url));
          });
        }

        const selectedTaskGroup = makeSelectedTasksGroup(state);

        if (!selectedTaskGroup) {
          return null;
        }

        const tasksToChange = selectedTaskGroup.tasks.filter(
          (t: any) =>
            t.store.url.indexOf(URL.host) > -1 &&
            t.state === States.Running &&
            t.product.raw !== url // check raw cause url could be undefined...
        );

        return dispatch(injectUrl(selectedTaskGroup.id, tasksToChange, url));
      }
      default:
        return null;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', _handleKeyPress);
    window.addEventListener('keyup', _handleUnsetRangeSelecting);

    return () => {
      window.removeEventListener('keydown', _handleKeyPress);
      window.removeEventListener('keyup', _handleUnsetRangeSelecting);
    };
  }, [all]);
};
