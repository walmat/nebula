import React from 'react';
import { useTime } from 'react-timer-hook';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { styles } from '../../styles/tableToolbar';

const useStyles = makeStyles(styles);

function Clock() {
  const styles = useStyles();

  const { seconds, minutes, hours, ampm } = useTime({ format: '12-hour' });

  const hh = hours > 9 ? hours : `0${hours}`;
  const mm = minutes > 9 ? minutes : `0${minutes}`;
  const ss = seconds > 9 ? seconds : `0${seconds}`;

  return (
    <>
      <Typography
        className={styles.title}
        style={{ marginLeft: 16, width: 60 }}
        variant="subtitle1"
        id="tableTitle"
      >
        Time:
      </Typography>
      <div className={styles.longInput}>
        {hh}:{mm}:{ss} {ampm}
      </div>
    </>
  );
}

export default Clock;
