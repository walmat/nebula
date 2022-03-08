import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid } from '@material-ui/core';
import { styles } from './styles';

const useStyles = makeStyles(styles);

const NoChildrenComponent = ({
  label,
  variant
}: {
  label: string;
  variant: any;
}) => {
  const styles = useStyles();

  return (
    <Grid container direction="row" className={styles.root}>
      <Grid item xs={12} className={styles.background}>
        <Grid item xs={12} className={styles.alignCenter}>
          <Grid item className={styles.center}>
            <Typography variant={variant} className={styles.text}>
              {label}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NoChildrenComponent;
