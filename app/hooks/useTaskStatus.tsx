import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useDispatch } from 'react-redux';
import { IPCKeys } from '../constants/ipc';
import { status } from '../components/Tasks/actions';

// hook to update tasks based on IPC
export const useTaskStatus = () => {
  const dispatch = useDispatch();

  const handleTaskStatus = (_: any, group: string, messages: object) => {
    dispatch(status(group, messages));
  };

  useEffect(() => {
    ipcRenderer.on(IPCKeys.TaskStatus, handleTaskStatus);

    return () => {
      ipcRenderer.removeListener(IPCKeys.TaskStatus, handleTaskStatus);
    };
  });
};
