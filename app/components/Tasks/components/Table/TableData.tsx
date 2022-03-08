import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  FormControlLabel,
  Switch,
  Tooltip
} from '@material-ui/core';

import { styles } from './styles';

import { makeSelectedTasksGroup } from '../../selectors';
import { RootState } from '../../../../store/reducers';
import { States } from '../../../../constants';

const useStyles = makeStyles(styles);

const TableData = ({ all, toggleAll }: { all: boolean; toggleAll: any }) => {
  const styles = useStyles();

  const tasks = useSelector((state: RootState) => state.Tasks);

  const selectedTaskGroup: any = useSelector(makeSelectedTasksGroup);
  let numTasks = 0;
  let selected = 0;
  let running = 0;

  if (all) {
    numTasks = Object.values(tasks).reduce(
      (prev, { tasks }) => prev + tasks.length,
      0
    );

    selected = Object.values(tasks).reduce(
      (prev, { tasks }) => prev + tasks.filter((t: any) => t.selected).length,
      0
    );

    running = Object.values(tasks).reduce(
      (prev, { tasks }) =>
        prev + tasks.filter((t: any) => t.state === States.Running).length,
      0
    );
  } else if (selectedTaskGroup) {
    numTasks = selectedTaskGroup.tasks.length;
    selected = selectedTaskGroup.tasks.filter((t: any) => t.selected).length;
    running = selectedTaskGroup.tasks.filter(
      (t: any) => t.state === States.Running
    ).length;
  }

  return useMemo(
    () => (
      <div className={styles.flex}>
        <Typography className={styles.numTasks} variant="h2" id="numTasks">
          <span className={styles.emphasizedNumber}>{numTasks} </span> Tasks
        </Typography>
        <Typography
          className={styles.numSelected}
          variant="h2"
          id="numSelected"
        >
          <span className={styles.emphasizedNumber}>{selected} </span>
          Selected
        </Typography>
        <Typography className={styles.numSelected} variant="h2" id="numRunning">
          <span className={styles.emphasizedNumber}>{running} </span> Running
        </Typography>
        <Tooltip title="Select all groups">
          <FormControlLabel
            className={styles.control}
            control={
              <Switch
                className={styles.switch}
                checked={all}
                color="primary"
                onChange={toggleAll}
              />
            }
            label={all ? `All groups` : `${selectedTaskGroup?.name || 'None'}`}
          />
        </Tooltip>
      </div>
    ),
    [running, selected, numTasks, all, selectedTaskGroup?.name, styles]
  );
};

export default TableData;
