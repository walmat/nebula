import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import ActionBar from './components/actionBar/ActionBar';
import { createCaptcha } from './actions';
import HarvesterGrid from './components/grid';
import { styles } from './styles';

const useStyles = makeStyles(styles);

const CaptchasPrimitive = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const handleCreate = () => dispatch(createCaptcha());

  return (
    <Grid container direction="row" className={styles.root}>
      <ActionBar onCreate={handleCreate} />
      <HarvesterGrid />
    </Grid>
  );
};

export default CaptchasPrimitive;
