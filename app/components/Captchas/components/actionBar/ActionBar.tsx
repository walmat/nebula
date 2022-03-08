import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Create from '@material-ui/icons/Add';
import { styles } from '../../styles/actionBar';

type Props = {
  onCreate: () => void;
};

const useStyles = makeStyles(styles);

const ActionBarComponent = ({ onCreate }: Props) => {
  const styles = useStyles();

  return (
    <Grid container direction="row" className={styles.root}>
      <Grid item xs={12} className={styles.background}>
        <Grid item xs={12} className={styles.alignCenter}>
          <Grid item className={styles.center}>
            <Create className={styles.actionIcon} onClick={onCreate} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ActionBarComponent;
