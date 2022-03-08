/* eslint-disable no-console */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';
import { groupBy } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Typography, Grid, Select, MenuItem } from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';
import { RootState } from '../../../store/reducers';
import {
  EXPENSES_OPTIONS_LIGHT,
  EXPENSES_OPTIONS_DARK,
  VIEWS
} from '../../../constants';
import { makeExpensesView } from '../../Settings/selectors';
import { setField, SETTINGS_FIELDS } from '../../Settings/actions';
import { styles } from '../styles/expenses';

const useStyles = makeStyles(styles);

const group = (data: any) =>
  groupBy(data, ({ date }) => moment(Number(date)).day());

const strip = (currency: string | number) =>
  Number(currency?.toString().replace(/[^0-9.-]+/g, ''));

const buildData = (success: any[]) => {
  const successData = group(success);

  const data = [];
  // loop over each day of the week...
  for (let i = 0; i < 7; i += 1) {
    if (successData[i]) {
      data.push(
        Number(
          successData[i].reduce(
            (prev, curr) => prev + strip(curr.amount || curr.product?.price),
            0
          )
        ).toFixed(2)
      );
    } else {
      data.push(0);
    }
  }

  return data;
};

const ExpensesComponent = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const expensesView = useSelector(makeExpensesView);
  const theme = useSelector((state: RootState) => state.Theme);

  const checkouts = useSelector((state: RootState) =>
    state.Checkouts.filter((checkout: any) => checkout.success).filter(
      (checkout: any) =>
        moment(Number(checkout.date)).unix() >=
        moment().subtract(expensesView, 'days').unix()
    )
  );

  const total = checkouts.reduce(
    (prev: any, curr: any) =>
      prev + strip(curr?.amount || curr?.product?.price),
    0
  );
  const seriesOptions =
    theme === 0 ? EXPENSES_OPTIONS_LIGHT : EXPENSES_OPTIONS_DARK;
  const series = [{ name: '', data: buildData(checkouts) }];

  return (
    <Grid className={styles.gridItem} item xs={6}>
      <div className={styles.root}>
        <Grid container direction="row" className={styles.colContainer}>
          <Grid container direction="column" className={styles.firstCol}>
            <Typography className={styles.header} variant="h6">
              Money Spent
            </Typography>
            <Typography className={styles.subtext} variant="h6">
              in USD
            </Typography>
          </Grid>
          <Grid item className={styles.secondCol}>
            <Typography className={styles.totalText} variant="h6">
              ${new Intl.NumberFormat('en-US').format(total)} Total
            </Typography>
          </Grid>
          <Grid item className={styles.thirdCol}>
            <Typography className={styles.subselect} variant="h6">
              <Select
                value={expensesView}
                disableUnderline
                onChange={(e: any) =>
                  dispatch(
                    setField(
                      SETTINGS_FIELDS.EXPENSES_VIEW,
                      e.target.value || ''
                    )
                  )
                }
                className={styles.selectPeriod}
                SelectDisplayProps={{
                  style: {
                    paddingTop: 7,
                    fontWeight: 400
                  }
                }}
                inputProps={{
                  classes: {
                    icon: styles.dropdownIcon
                  }
                }}
                IconComponent={ExpandMoreIcon}
                MenuProps={{
                  MenuListProps: {
                    classes: {
                      root: styles.menuList
                    }
                  },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left'
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left'
                  },
                  getContentAnchorEl: null
                }}
              >
                <MenuItem value={VIEWS.Weekly} className={styles.menuItem}>
                  Last 7 Days
                </MenuItem>
                <MenuItem value={VIEWS.Monthly} className={styles.menuItem}>
                  Last 30 Days
                </MenuItem>
                <MenuItem value={VIEWS.Yearly} className={styles.menuItem}>
                  Last 365 Days
                </MenuItem>
              </Select>
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          className={classNames(styles.colContainer, styles.chartContainer)}
        >
          <ReactApexChart
            options={seriesOptions}
            series={series}
            type="bar"
            width="400px"
            height="150px"
          />
        </Grid>
      </div>
    </Grid>
  );
};

export default ExpensesComponent;
