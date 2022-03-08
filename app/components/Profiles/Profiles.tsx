import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import ActionBar from './components/actionBar';
import CreateDialog from './components/create/ProfileCreateDialog';
import ProfileGrid from './components/grid';
import { styles } from './styles';

const useStyles = makeStyles(styles);

const ProfilesPrimitve = () => {
  const styles = useStyles();

  return (
    <Grid container direction="row" className={styles.root}>
      <ActionBar />
      <CreateDialog />
      <ProfileGrid />
    </Grid>
  );
};

export default ProfilesPrimitve;
