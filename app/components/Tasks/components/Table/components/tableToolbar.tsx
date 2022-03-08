import React, { useCallback, useMemo, useState } from 'react';
import { ipcRenderer } from 'electron';
import { makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import { Toolbar, Button } from '@material-ui/core';
import { styles } from '../styles/tableToolbar';

import TaskGroups from './toolbar/groups';
import MonitorDelay from './toolbar/monitor';
import RetryDelay from './toolbar/retry';
import StaggerAmount from './toolbar/stagger';
import Clock from './toolbar/clock';

import { IPCKeys } from '../../../../../constants/ipc';

const useStyles = makeStyles(styles);

const EnhancedTableToolbar = ({ all }: { all: boolean }) => {
  const styles = useStyles();
  const [isPurging, setIsPurging] = useState(false);
  const [purgeText, setPurgeText] = useState('Purge Cache');

  const handlePurge = useCallback(() => {
    if (!isPurging) {
      setIsPurging(true);
      ipcRenderer
        .invoke(IPCKeys.PurgeAnswers)
        .then(() => {
          setPurgeText('Purged');
          setTimeout(() => {
            setPurgeText('Purge Cache');
            setIsPurging(false);
          }, 750);
          return true;
        })
        .catch(() => {
          setPurgeText('Error');
          setTimeout(() => {
            setPurgeText('Purge Cache');
            setIsPurging(false);
          }, 750);
        });
    }
  }, [isPurging, purgeText]);

  return useMemo(
    () => (
      <Toolbar className={classnames(styles.root)}>
        <TaskGroups />
        <MonitorDelay all={all} />
        <RetryDelay all={all} />
        <StaggerAmount />
        <Clock />
        <Button className={styles.btnEnd} onClick={handlePurge}>
          {purgeText}
        </Button>
      </Toolbar>
    ),
    [all, purgeText, styles]
  );
};

export default EnhancedTableToolbar;
