import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';
import { Grid, Tooltip, Fade } from '@material-ui/core';
import Duplicate from '@material-ui/icons/Assignment';
import { styles } from '../../styles/actionBar';
import { log } from '../../../../utils/log';

import { copyTasks } from '../../actions';

import { makeSelectedTasksGroup } from '../../selectors';

const useStyles = makeStyles(styles);

const stopBtn = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const selectedTaskGroup: any = useSelector(makeSelectedTasksGroup);

  const copyHandler = (e: any) => {
    try {
      e.stopPropagation();

      if (!selectedTaskGroup) {
        return;
      }

      const toCopy = selectedTaskGroup.tasks.filter((t: any) => t.selected);
      if (!toCopy.length) {
        return;
      }

      dispatch(copyTasks(selectedTaskGroup.id, toCopy));
    } catch (err) {
      if (err) {
        log.error(err, 'Tasks -> Copy');
      }
    }
  };

  return (
    <Grid item xs={2} className={styles.alignCenter}>
      <Grid item className={styles.center}>
        <Tooltip
          TransitionComponent={Fade}
          placement="top"
          title="Copy Task(s)"
        >
          <Duplicate className={styles.actionIcon} onClick={copyHandler} />
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default stopBtn;
