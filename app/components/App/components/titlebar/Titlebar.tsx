import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useLocation } from 'react-router-dom';
import { styles } from '../../styles/Titlebar';

const useStyles = makeStyles(styles);

const Titlebar = () => {
  const styles = useStyles();
  const { pathname } = useLocation();
  return /progressbar/i.test(pathname) ? null : <div className={styles.root} />;
};

export default Titlebar;
