/* eslint-disable no-restricted-syntax */
import { useEffect, useRef } from 'react';
import moment from 'moment';
import { useStore, useDispatch } from 'react-redux';
import { makeTasks, makeDelays } from '../components/Tasks/selectors';
import { stopTasks, startTasks } from '../components/Tasks/actions';
import { States } from '../constants';

export const useTaskLifecycle = () => {
  const startTasksInterval: any = useRef();
  const stopTasksInterval: any = useRef();
  // we use store instead of tasks to avoid rerender when tasks changes
  const store = useStore();
  const dispatch = useDispatch();

  const timeChecker = (now: any) => {
    const diff = moment(now).diff(moment(), 'seconds');
    // if the tasks are more than 10s overdue, don't start them...
    return diff <= 0 && diff > -10;
  };

  const _stopTasks = () => {
    const state = store.getState();
    const tasks = makeTasks(state);
    const taskGroups = Object.values(tasks)
      .map(({ id, tasks }: { id: string; tasks: any[] }) => ({ id, tasks }))
      .flat();

    if (taskGroups?.length) {
      try {
        Promise.all(
          taskGroups?.map(({ id, tasks }: { id: string; tasks: any[] }) => {
            const tasksToStop = tasks.filter((t: any) => {
              return (
                t.endTime &&
                timeChecker(t.endTime) &&
                t.state === States.Running
              );
            });

            if (tasksToStop?.length) {
              return dispatch(stopTasks(id, tasksToStop));
            }
            return null;
          })
        ).catch(() => {});
      } catch (e) {
        // noop...
      }
    }
  };

  const _startTasks = () => {
    const state = store.getState();
    const tasks = makeTasks(state);
    const { monitor, retry } = makeDelays(state);

    const taskGroups = Object.values(
      tasks
    ).map(({ id, tasks }: { id: string; tasks: any[] }) => ({ id, tasks }));

    if (taskGroups?.length) {
      try {
        Promise.all(
          taskGroups?.map(({ id, tasks }: { id: string; tasks: any[] }) => {
            const tasksToStart = tasks.filter((t: any) => {
              return (
                t.startTime &&
                timeChecker(t.startTime) &&
                t.state !== States.Running
              );
            });

            if (tasksToStart?.length) {
              return dispatch(startTasks(id, tasksToStart, { monitor, retry }));
            }
            return null;
          })
        ).catch(() => {});
      } catch (e) {
        // noop...
      }
    }
  };

  useEffect(() => {
    startTasksInterval.current = setInterval(_startTasks, 1000);
    stopTasksInterval.current = setInterval(_stopTasks, 1000);

    // called on unmount
    return () => {
      if (startTasksInterval.current) {
        clearInterval(startTasksInterval.current);
        startTasksInterval.current = null;
      }

      if (stopTasksInterval.current) {
        clearInterval(stopTasksInterval.current);
        stopTasksInterval.current = null;
      }
    };
  }, []);
};
