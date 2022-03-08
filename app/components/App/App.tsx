import React, { useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';
import { CssBaseline } from '@material-ui/core';
import { ConfirmProvider } from 'material-ui-confirm';
import { makeStyles } from '@material-ui/styles';

import { log } from '../../utils/log';
import { styles } from './styles';
import ToolbarAreaPane from './components/toolbar/area';
import Titlebar from './components/titlebar/Titlebar';
import Sidebar from '../Sidebar/Sidebar';
import ErrorBoundary from '../ErrorBoundary';
import ClientRouter from '../../routing/ClientRouter';
import { bootLoader } from '../../utils/bootHelper';
import { IPCKeys } from '../../constants/ipc';

import { useProxiesStatus } from '../../hooks/useProxiesStatus';
import { useTaskStatus } from '../../hooks/useTaskStatus';
import { useAnalyticsFile } from '../../hooks/useAnalyticsFile';
import { useQuickTaskLifecycle } from '../../hooks/useQuickTaskLifecycle';
import { useTaskLifecycle } from '../../hooks/useTaskLifecycle';
import { useUpdateProxies } from '../../hooks/useUpdateProxies';
import { useUpdateStagger } from '../../hooks/useUpdateStagger';
import { useUpdateWebhooks } from '../../hooks/useUpdateWebhooks';
import { useUpdateProfiles } from '../../hooks/useUpdateProfiles';
import { useAutoSolveLifecycle } from '../../hooks/useAutoSolveLifecycle';
import { useAutoUpdaterLifecycle } from '../../hooks/useAutoUpdateLifecycle';
import { useNotificationLifecycle } from '../../hooks/useNotificationLifecycle';

const useStyles = makeStyles(styles);

const App = () => {
  const styles = useStyles();

  useProxiesStatus();
  useTaskStatus();
  useAnalyticsFile();
  useQuickTaskLifecycle();
  useTaskLifecycle();
  useAutoSolveLifecycle();
  useAutoUpdaterLifecycle();
  useNotificationLifecycle();
  useUpdateProxies();
  useUpdateWebhooks();
  useUpdateProfiles();
  useUpdateStagger();

  const setup = useCallback(() => {
    try {
      window.addEventListener('beforeunload', _cleanup);

      ipcRenderer.setMaxListeners(Infinity);
      bootLoader.cleanRotationFiles();
    } catch (e) {
      log.error(e, `App -> setup`);
    }
  }, []);

  const _cleanup = useCallback(() => {
    [...Object.values(IPCKeys)].map(key => ipcRenderer.removeAllListeners(key));

    window.removeEventListener('beforeunload', _cleanup);
  }, []);

  useEffect(() => {
    setup();
    return () => {
      _cleanup();
    };
  }, []);

  return (
    <div className={styles.root}>
      <CssBaseline>
        <ConfirmProvider
          defaultOptions={{ confirmationButtonProps: { autoFocus: true } }}
        >
          <Titlebar />
          <ErrorBoundary>
            <ToolbarAreaPane showMenu />
            <div className={styles.row}>
              <Sidebar />
              <ClientRouter />
            </div>
          </ErrorBoundary>
        </ConfirmProvider>
      </CssBaseline>
    </div>
  );
};

export default App;
