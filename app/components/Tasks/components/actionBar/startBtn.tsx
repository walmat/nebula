import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Grid, Tooltip, Fade } from '@material-ui/core';
import Start from '@material-ui/icons/PlayArrow';
import { log } from '../../../../utils/log';
import { styles } from '../../styles/actionBar';

import { startTasks } from '../../actions';
import { makeSelectedTasksGroup, makeDelays, makeTasks } from '../../selectors';

const useStyles = makeStyles(styles);

const startBtn = ({ all }: { all: boolean }) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const groups = useSelector(makeTasks);
  const selectedTaskGroup: any = useSelector(makeSelectedTasksGroup);
  const { monitor, retry } = useSelector(makeDelays);

  const startHandler = async (e: any) => {
    try {
      e.stopPropagation();

      if (all) {
        return Object.values(groups).map(({ id: group, tasks }) => {
          const current = tasks.filter((t: any) => t.selected);

          if (!current.length) {
            return null;
          }

          return dispatch(startTasks(group, current, { monitor, retry }));
        });
      }

      if (!selectedTaskGroup) {
        return null;
      }

      const toStart = selectedTaskGroup.tasks.filter((t: any) => t.selected);
      if (!toStart.length) {
        return null;
      }

      return dispatch(
        startTasks(selectedTaskGroup.id, toStart, { monitor, retry })
      );
    } catch (err) {
      if (err) {
        log.error(err, 'Tasks -> Start');
      }
      return null;
    }
  };

  return (
    <Grid item xs={2} className={styles.alignCenter}>
      <Grid item className={styles.center}>
        <Tooltip
          TransitionComponent={Fade}
          placement="top"
          title="Start Task(s)"
        >
          <Start className={styles.actionIcon} onClick={startHandler} />
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default startBtn;
