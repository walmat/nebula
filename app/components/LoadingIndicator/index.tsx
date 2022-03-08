import React from 'react';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { styles } from './styles';

const useStyles = makeStyles(styles);

const LoadingIndicator = ({ size = 50 }) => {
  const styles = useStyles();

  return (
    <CircularProgress color="primary" className={styles.root} size={size} />
  );
};

export default LoadingIndicator;
