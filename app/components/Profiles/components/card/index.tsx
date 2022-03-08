import React from 'react';
import { useDispatch } from 'react-redux';
import { useConfirm } from 'material-ui-confirm';
import { Grid, Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteProfile, loadProfile, duplicateProfile } from '../../actions';
import { imgsrc } from '../../../../utils/imgsrc';
import { log } from '../../../../utils/log';
import { styles } from '../../styles/card';

const useStyles = makeStyles(styles);

const CardComponent = ({ profile }: { profile: any }) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const closeHandler = async (event: any) => {
    event.stopPropagation();

    try {
      await confirm({
        title: `Remove Profile "${profile.name}"?`,
        description: 'This action cannot be undone.',
        confirmationText: 'Yes',
        cancellationText: 'No',
        dialogProps: {
          classes: {
            paper: styles.paperRoot
          }
        },
        confirmationButtonProps: {
          classes: {
            root: styles.confirmBtn
          },
          style: {
            width: 105,
            height: 35,
            background:
              'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
            color: '#fff'
          }
        },
        cancellationButtonProps: {
          classes: {
            root: styles.cancelBtn
          },
          style: {
            width: 105,
            height: 35
          }
        }
      });

      dispatch(deleteProfile(profile));
    } catch (e) {
      log.error(e, 'Profile -> Remove Profile Cancelled');
    }
  };

  const loadHandler = (event: any) => {
    event.stopPropagation();

    dispatch(loadProfile(profile));
  };

  const duplicateHandler = (event: any) => {
    event.stopPropagation();

    dispatch(duplicateProfile(profile));
  };

  return (
    <Grid item xs={4} md={4} lg={4} xl={4}>
      <div className={styles.root}>
        <div className={styles.background} onClick={loadHandler}>
          <Grid container className={styles.gridContainer} direction="row">
            <Typography variant="subtitle1" className={styles.cardHolder}>
              {profile.payment.holder}
            </Typography>
            <IconButton
              className={styles.actionIconWrapper}
              onClick={duplicateHandler}
            >
              <LibraryAddIcon className={styles.actionIcon} />
            </IconButton>
            <IconButton
              className={styles.actionIconWrapper}
              onClick={closeHandler}
            >
              <DeleteIcon className={styles.actionIcon} />
            </IconButton>
          </Grid>
          <Grid container className={styles.gridContainer} direction="row">
            <Typography variant="body1" className={styles.cardName}>
              {profile.name}
            </Typography>
          </Grid>
          <Grid container className={styles.gridContainerMid} direction="row">
            <Typography variant="h6" className={styles.dots}>
              • • • •
            </Typography>
            <Typography variant="h6" className={styles.dots}>
              • • • •
            </Typography>
            <Typography variant="h6" className={styles.dots}>
              • • • •
            </Typography>
            <Typography variant="h6" className={styles.cardNumber}>
              {profile.payment.card.substr(-4)}
            </Typography>
          </Grid>
          <Grid container className={styles.gridContainerEnd} direction="row">
            <img
              className={styles.cardTypeImg}
              src={imgsrc(`Profiles/${profile.payment.type}.png`, false)}
              alt=""
            />
          </Grid>
        </div>
      </div>
    </Grid>
  );
};

export default CardComponent;
