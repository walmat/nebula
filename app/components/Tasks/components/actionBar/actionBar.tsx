import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { styles } from '../../styles/actionBar';

import StartBtn from './startBtn';
import StopBtn from './stopBtn';
import DeleteBtn from './deleteBtn';
import CreateBtn from './createBtn';
import EditBtn from './editBtn';
import CopyBtn from './copyBtn';

const useStyles = makeStyles(styles);

const ActionBarComponent = ({ all }: { all: boolean }) => {
  const styles = useStyles();

  return (
    <Grid container direction="row" className={styles.root}>
      <Grid item xs={12} className={styles.background}>
        <StartBtn all={all} />
        <StopBtn all={all} />
        <DeleteBtn all={all} />
        <CreateBtn />
        <EditBtn />
        <CopyBtn />
      </Grid>
    </Grid>
  );
};

export default ActionBarComponent;
