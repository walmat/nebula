import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useConfirm } from 'material-ui-confirm';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Create from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import { log } from '../../../../utils/log';
import { deleteProfiles } from '../../actions';
import { makeProfiles } from '../../selectors';
import { toggleField, SETTINGS_FIELDS } from '../../../Settings/actions';
import { styles } from '../../styles/actionBar';

const useStyles = makeStyles(styles);

const ActionBarComponent = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const profiles = useSelector(makeProfiles);

  const createHandler = async (e: any) => {
    e.stopPropagation();

    dispatch(toggleField(SETTINGS_FIELDS.CREATE_PROFILE));
  };

  const deleteHandler = async (e: any) => {
    e.stopPropagation();

    if (!profiles.length) {
      return;
    }
    try {
      await confirm({
        title: `Are you sure you want to remove all profiles?`,
        description: 'This action cannot be undone.',
        confirmationText: 'Yes',
        cancellationText: 'No',
        confirmationButtonProps: {
          color: 'primary',
          style: {
            width: 105,
            height: 35,
            background:
              'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
            color: '#fff'
          }
        },
        cancellationButtonProps: {
          color: 'primary',
          style: {
            width: 105,
            height: 35
          }
        }
      });

      dispatch(deleteProfiles());
    } catch (e) {
      if (!e) {
        return;
      }

      log.error(e, 'Profiles -> Remove');
    }
  };

  return (
    <Grid container direction="row" className={styles.root}>
      <Grid item xs={12} className={styles.background}>
        <Grid item xs={12} className={styles.alignCenter}>
          <Grid item className={styles.center}>
            <Create className={styles.actionIcon} onClick={createHandler} />
          </Grid>
        </Grid>
        <Grid item xs={12} className={styles.alignCenter}>
          <Grid item className={styles.center}>
            <Delete className={styles.actionIcon} onClick={deleteHandler} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ActionBarComponent;
