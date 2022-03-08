import React, { useCallback, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import TaskList from './components/Table/TaskList';
import ActionBar from './components/actionBar/actionBar';
import TaskCreateDialog from './components/create/TaskCreateDialog';
import TaskEditDialog from './components/edits/TaskEditDialog';

import { styles } from './styles';

const useStyles = makeStyles(styles);

const Tasks = () => {
  const styles = useStyles();

  const [all, setAll] = useState(false);

  const toggleAll = useCallback(() => {
    setAll(prev => !prev);
  }, []);

  return useMemo(
    () => (
      <div className={styles.root}>
        <div className={styles.grid}>
          <div className={styles.table}>
            <TaskList all={all} toggleAll={toggleAll} />
          </div>
          <ActionBar all={all} />
          <TaskCreateDialog />
          <TaskEditDialog />
        </div>
      </div>
    ),
    [all, styles]
  );
};

export default Tasks;
