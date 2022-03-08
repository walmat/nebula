/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { groupBy } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Typography, Grid, Select, MenuItem } from '@material-ui/core';
import { createSelector } from 'reselect';

import { makeStyles } from '@material-ui/styles';
import { RootState } from '../../../store/reducers';
import {
  STATS_OPTIONS_LIGHT,
  STATS_OPTIONS_DARK,
  VIEWS
} from '../../../constants';
import { setField, SETTINGS_FIELDS } from '../../Settings/actions';
import { styles } from '../styles/stats';

const group = (data: any) =>
  groupBy(data, ({ date }) => moment(Number(date)).startOf('day').unix());

const useStyles = makeStyles(styles);

const getCheckouts = (state: any) => state.Checkouts;
const getStatsView = (state: any) => state.Settings.statsView;

const getCheckoutsForStatsView = createSelector(
  [getCheckouts, getStatsView],
  (checkouts, statsView) => {
    return checkouts.filter(
      (checkout: any) =>
        moment(Number(checkout.date)).unix() >=
        moment().subtract(Number(statsView), 'days').unix()
    );
  }
);

const extractSuccessData = (success: any[], statsView: string) => {
  const successData = Array.from(Array(Number(statsView)), () => 0);
  for (const [time, checkouts] of Object.entries(group(success))) {
    if (checkouts?.length) {
      successData[daysFrom(now, Number(time)) - 1] = checkouts.length;
    }
  }

  return successData.reverse();
};

const extractFailedData = (failed: any[], statsView: string) => {
  const failedData = Array.from(Array(Number(statsView)), () => 0);
  for (const [time, checkouts] of Object.entries(group(failed))) {
    if (checkouts?.length) {
      failedData[daysFrom(now, Number(time)) - 1] = checkouts.length;
    }
  }

  return failedData.reverse();
};

const daysFrom = (start: number, end: number) =>
  Math.ceil(
    moment.duration(moment.unix(start).diff(moment.unix(end))).asDays()
  );

const now = moment().unix();

const StatsComponent = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const theme = useSelector((state: RootState) => state.Theme);
  const statsView = useSelector((state: RootState) => state.Settings.statsView);

  const checkouts = useSelector(getCheckoutsForStatsView);
  const failed = checkouts.filter((checkout: any) => !checkout.success);
  const success = checkouts.filter((checkout: any) => checkout.success);

  const successData = useCallback(extractSuccessData(success, statsView), [
    success.length,
    statsView
  ]);
  const failedData = useCallback(extractFailedData(failed, statsView), [
    failed.length,
    statsView
  ]);

  const seriesOptions = theme === 0 ? STATS_OPTIONS_LIGHT : STATS_OPTIONS_DARK;
  const series = [
    {
      name: 'Success',
      data: successData
    },
    {
      name: 'Failed',
      data: failedData
    }
  ];

  const _setStatsView = (option: string) => {
    dispatch(setField(SETTINGS_FIELDS.STATS_VIEW, option));
  };

  return (
    <Grid className={styles.gridItem} item xs={6}>
      <div className={styles.root}>
        <Grid container direction="row" className={styles.colContainer}>
          <Grid item className={styles.firstCol}>
            <Typography className={styles.header} variant="h6">
              Checkout Statistics
            </Typography>
          </Grid>
          <Grid item className={styles.thirdCol}>
            <Typography className={styles.subselect} variant="h6">
              <Select
                value={statsView}
                disableUnderline
                onChange={({ target }: { target: any }) =>
                  _setStatsView(target.value)
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
        <Grid container direction="row" className={styles.colContainer}>
          <ReactApexChart
            options={seriesOptions}
            series={series}
            type="area"
            height="170px"
            width="407px"
          />
        </Grid>
      </div>
    </Grid>
  );
};

export default StatsComponent;
