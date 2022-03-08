import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Grid, Tooltip, Fade } from '@material-ui/core';
import Create from '@material-ui/icons/Add';
import { styles } from '../../styles/actionBar';

import { toggleField, SETTINGS_FIELDS } from '../../../Settings/actions';

const useStyles = makeStyles(styles);

const stopBtn = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const createHandler = (e: any) => {
    e.stopPropagation();
    dispatch(toggleField(SETTINGS_FIELDS.CREATE_TASK));
  };

  return (
    <Grid item xs={2} className={styles.alignCenter}>
      <Grid item className={styles.center}>
        <Tooltip
          TransitionComponent={Fade}
          placement="top"
          title="Create Task(s)"
        >
          <Create className={styles.actionIcon} onClick={createHandler} />
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default stopBtn;
