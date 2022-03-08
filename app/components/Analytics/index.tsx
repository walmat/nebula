import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { styles } from './styles';

// first row
import WelcomeComponent from './components/welcome';
import CheckoutsComponent from './components/checkouts';
import OrrdersComponent from './components/orders';

// second row
import ExpensesComponent from './components/expenses';

const useStyles = makeStyles(styles);

const Analytics = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Grid className={styles.row} container>
        <Grid container item xs={12} className={styles.grid}>
          <WelcomeComponent />
          <CheckoutsComponent />
          <OrrdersComponent />
        </Grid>
        <Grid container item xs={12} className={styles.grid}>
          <ExpensesComponent />
        </Grid>
      </Grid>
    </div>
  );
};

export default Analytics;
