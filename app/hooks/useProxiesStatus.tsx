import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useDispatch } from 'react-redux';
import { IPCKeys } from '../constants/ipc';
import { proxyUpdateSpeed } from '../components/Proxies/actions';

// hook to update proxies based on IPC
export const useProxiesStatus = () => {
  const dispatch = useDispatch();

  const handleProxiesStatus = (_: any, group: string, results: any) => {
    dispatch(proxyUpdateSpeed(group, results));
  };

  useEffect(() => {
    ipcRenderer.on(IPCKeys.ResponseTestProxy, handleProxiesStatus);

    return () => {
      ipcRenderer.removeListener(
        IPCKeys.ResponseTestProxy,
        handleProxiesStatus
      );
    };
  });
};
