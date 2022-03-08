import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';
import { Grid, Tooltip, Fade } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import { styles } from '../../styles/actionBar';
import { log } from '../../../../utils/log';

import { toggleField, SETTINGS_FIELDS } from '../../../Settings/actions';

import { makeSelectedTasksGroup } from '../../selectors';

const useStyles = makeStyles(styles);

const stopBtn = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const selectedTaskGroup: any = useSelector(makeSelectedTasksGroup);

  const editHandler = (e: any) => {
    try {
      e.stopPropagation();

      if (!selectedTaskGroup) {
        return;
      }

      const toEdit = selectedTaskGroup.tasks.filter((t: any) => t.selected);
      if (!toEdit.length) {
        return;
      }

      dispatch(toggleField(SETTINGS_FIELDS.EDIT_TASK));
    } catch (err) {
      if (err) {
        log.error(err, 'Tasks -> Edit');
      }
    }
  };

  return (
    <Grid item xs={2} className={styles.alignCenter}>
      <Grid item className={styles.center}>
        <Tooltip
          TransitionComponent={Fade}
          placement="top"
          title="Edit Task(s)"
        >
          <Edit className={styles.actionIcon} onClick={editHandler} />
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default stopBtn;
