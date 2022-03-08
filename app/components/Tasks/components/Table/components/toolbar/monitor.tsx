import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Typography, Input } from '@material-ui/core';
import { styles } from '../../styles/tableToolbar';

import { changeDelay, TASK_FIELDS } from '../../../../actions';

import DebouncedInput from '../../../../../DebouncedInput/DebouncedInput';

import { makeSelectedTasksGroup } from '../../../../selectors';
import { RootState } from '../../../../../../store/reducers';

const useStyles = makeStyles(styles);

const getSelected = (selectedGroup: any) => {
  if (!selectedGroup) {
    return [];
  }

  return selectedGroup.tasks.filter((t: any) => t.selected);
};

const MonitorDelay = ({ all }: { all: boolean }) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const groups = useSelector((state: RootState) => state.Tasks);
  const monitor = useSelector((state: RootState) => state.Delays.monitor);
  const selectedTaskGroup: any = useSelector(makeSelectedTasksGroup);
  const selected = getSelected(selectedTaskGroup);

  const handleChangeDelay = useMemo(
    () => (value: any, field: string) => {
      if (all) {
        return Object.values(groups).map(group => {
          const current = getSelected(group);

          return dispatch(changeDelay(group.id, value, field, current));
        });
      }
      return dispatch(
        changeDelay(selectedTaskGroup?.id, value, field, selected)
      );
    },
    [selectedTaskGroup?.id, all, selected.length]
  );

  return (
    <>
      <Typography
        className={classNames(styles.monitor, styles.title)}
        variant="subtitle1"
        id="tableTitle"
      >
        Monitor:
      </Typography>
      <DebouncedInput
        properties={{
          required: true,
          type: 'number',
          disableUnderline: true,
          key: 'delays--monitor',
          placeholder: '0',
          className: styles.input
        }}
        text={monitor}
        InputComponent={Input}
        updateText={value => handleChangeDelay(value, TASK_FIELDS.MONITOR)}
      />
    </>
  );
};

export default MonitorDelay;
