import React from 'react';
import { PURGE } from 'redux-persist';
import { useSelector, useDispatch } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import { Typography, Button, Grid } from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import { makeStyles } from '@material-ui/styles';

import { log } from '../../../utils/log';
import { quit } from '../../../utils/createWindows';
import { makeUser } from '../../App/selectors';
import { styles } from '../styles/welcome';

const useStyles = makeStyles(styles);

const AnimatedWelcomeText = () => {
  const styles = useStyles();
  const { name } = useSelector(makeUser);

  const props = useSpring({
    delay: 500,
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 850 }
  });

  return (
    <animated.div style={props}>
      <Typography className={styles.welcome} variant="h4">
        Welcome Back,
        <span className={styles.bold}> {name}</span>
      </Typography>
    </animated.div>
  );
};

const AnimatedActionButtons = () => {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 850 }
  });

  const styles = useStyles();
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const deactivateHandler = async (e: any) => {
    e.stopPropagation();

    try {
      await confirm({
        title: `Are you sure you want to deactivate?`,
        description:
          'Your data will persist, but you will need to authenticate on next launch.',
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
    } catch (e) {
      if (!e) {
        return;
      }
      log.error(e, 'Welcome -> Deactivate');
    }
  };

  const handleReset = async () => {
    try {
      await confirm({
        title: `Are you sure you want to reset application data?`,
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

      dispatch({
        type: PURGE,
        key: 'root',
        result: () => null
      });

      setTimeout(() => quit(), 2500);
    } catch (e) {
      if (!e) {
        return;
      }
      log.error(e, 'Tasks -> Reset All Data');
    }
  };

  return (
    <animated.div style={props}>
      <Button
        color="secondary"
        onClick={deactivateHandler}
        className={styles.unbindBtn}
      >
        Deactivate
      </Button>
      <Button
        color="secondary"
        onClick={handleReset}
        className={styles.joinDiscordBtn}
      >
        Reset All Data
      </Button>
    </animated.div>
  );
};

const WelcomeComponent = () => {
  const styles = useStyles();

  return (
    <Grid className={styles.gridItem} item xs={6}>
      <div className={styles.root}>
        <div className={styles.background}>
          <AnimatedWelcomeText />
          <div className={styles.row}>
            <AnimatedActionButtons />
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default WelcomeComponent;
