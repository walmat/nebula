import React, { useCallback } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { styles } from '../../styles/tableToolbar';

import { setField, SETTINGS_FIELDS } from '../../../../../Settings/actions';
import { RootState } from '../../../../../../store/reducers';

import {
  basicStyles,
  IndicatorSeparator
} from '../../../../../../styles/select';

import { Groups } from '../../../../../../constants';

const useStyles = makeStyles(styles);

const groupByOptions = [
  { label: 'None', value: Groups.None },
  { label: 'Store', value: Groups.Store },
  { label: 'Product', value: Groups.Product },
  { label: 'Profile', value: Groups.Profile }
];

const Filter = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const theme = useSelector((state: RootState) => state.Theme);

  const groupBy = useSelector(
    ({ Settings }: { Settings: any }) => Settings.tasksGroup
  );

  const handleSetTaskGroup = useCallback((event: any) => {
    dispatch(setField(SETTINGS_FIELDS.TASKS_GROUP, event.value));
  }, []);

  return (
    <>
      <Typography
        className={styles.title}
        style={{ marginLeft: 16 }}
        variant="subtitle1"
        id="tableTitle"
      >
        Group By:
      </Typography>
      <Select
        isDisabled
        isMulti={false}
        options={groupByOptions}
        defaultValue={{ label: 'None', value: Groups.None }}
        placeholder="None"
        onChange={handleSetTaskGroup}
        components={{ IndicatorSeparator }}
        styles={basicStyles(theme)}
        className={styles.selectPeriod}
        value={{ label: groupBy, value: groupBy }}
      />
    </>
  );
};

export default Filter;
