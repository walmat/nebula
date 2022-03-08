import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Typography, Input } from '@material-ui/core';
import { styles } from '../../styles/tableToolbar';

import DebouncedInput from '../../../../../DebouncedInput/DebouncedInput';

import { toggleStagger } from '../../../../../Settings/actions';

import { RootState } from '../../../../../../store/reducers';

const useStyles = makeStyles(styles);

const StaggerAmount = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const stagger = useSelector((state: RootState) => state.Settings.stagger);
  const staggerTasks = (value: string) => dispatch(toggleStagger(value));

  return (
    <>
      <Typography
        className={styles.title}
        style={{ marginLeft: 16, width: 60 }}
        variant="subtitle1"
        id="tableTitle"
      >
        Batch:
      </Typography>
      <DebouncedInput
        properties={{
          required: true,
          type: 'number',
          disableUnderline: true,
          key: 'delays--stagger',
          placeholder: '1',
          className: styles.input
        }}
        text={stagger || 1}
        InputComponent={Input}
        updateText={value => staggerTasks(value)}
      />
    </>
  );
};

export default StaggerAmount;
