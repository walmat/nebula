import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Grid, Tooltip, Fade } from '@material-ui/core';
import Stop from '@material-ui/icons/Pause';
import { log } from '../../../../utils/log';
import { styles } from '../../styles/actionBar';

import { stopTasks } from '../../actions';
import { makeSelectedTasksGroup, makeTasks } from '../../selectors';

const useStyles = makeStyles(styles);

const stopBtn = ({ all }: { all: boolean }) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const groups = useSelector(makeTasks);
  const selectedTaskGroup: any = useSelector(makeSelectedTasksGroup);

  const stopHandler = async (e: any) => {
    try {
      e.stopPropagation();

      if (all) {
        return Object.values(groups).map(({ id: group, tasks }) => {
          const current = tasks.filter((t: any) => t.selected);

          if (!current.length) {
            return null;
          }

          return dispatch(stopTasks(group, current));
        });
      }

      if (!selectedTaskGroup) {
        return null;
      }

      const toStop = selectedTaskGroup.tasks.filter((t: any) => t.selected);
      if (!toStop.length) {
        return null;
      }

      return dispatch(stopTasks(selectedTaskGroup.id, toStop));
    } catch (err) {
      if (err) {
        log.error(err, 'Tasks -> Stop');
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
          title="Stop Task(s)"
        >
          <Stop className={styles.actionIcon} onClick={stopHandler} />
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default stopBtn;
