import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { Typography, Button, Dialog, DialogActions } from '@material-ui/core';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

import Generics from './generics';
import Accounts from './accounts';
import Rates from './rates';
import Webhooks from './webhooks';
import Defaults from './defaults';

import { IPCKeys } from '../../../../constants/ipc';
import { styles } from '../../styles';

import { openExternalUrl } from '../../../../utils/url';

const useStyles = makeStyles(styles);

const DialogContent = ({ activeStep }: { activeStep: number }) => {
  switch (activeStep) {
    case 0:
      return <Generics />;
    case 1:
      return <Accounts />;
    case 2:
      return <Rates />;
    case 3:
      return <Webhooks />;
    case 4:
      return <Defaults />;
    default:
      return <Generics />;
  }
};

const DialogTitle = ({
  activeStep,
  handleNext,
  handleBack
}: {
  activeStep: number;
  handleNext: any;
  handleBack: any;
}) => {
  const styles = useStyles();

  switch (activeStep) {
    case 0: {
      return (
        <>
          <Typography
            variant="h5"
            className={classNames(styles.title, styles.pushRight)}
          >
            Settings
          </Typography>
          <Typography
            variant="body1"
            onClick={handleNext}
            className={styles.subheading}
          >
            Accounts
            <ArrowForwardIosIcon
              className={styles.nextIcon}
              width={16}
              height={16}
            />
          </Typography>
        </>
      );
    }
    case 1: {
      return (
        <>
          <Typography
            variant="h5"
            onClick={handleBack}
            className={classNames(
              styles.title,
              styles.pointer,
              styles.pushRight
            )}
          >
            <ArrowBackIos
              className={styles.previousIcon}
              width={16}
              height={16}
            />
            Accounts
          </Typography>
          <Typography
            variant="body1"
            onClick={handleNext}
            className={styles.subheading}
          >
            Shipping Rates
            <ArrowForwardIosIcon
              className={styles.nextIcon}
              width={16}
              height={16}
            />
          </Typography>
        </>
      );
    }
    case 2: {
      return (
        <>
          <Typography
            variant="h5"
            onClick={handleBack}
            className={classNames(
              styles.title,
              styles.pointer,
              styles.pushRight
            )}
          >
            <ArrowBackIos
              className={styles.previousIcon}
              width={16}
              height={16}
            />
            Shipping Rates
          </Typography>
          <Typography
            variant="body1"
            onClick={handleNext}
            className={styles.subheading}
          >
            Webhooks
            <ArrowForwardIosIcon
              className={styles.nextIcon}
              width={16}
              height={16}
            />
          </Typography>
        </>
      );
    }
    case 3: {
      return (
        <>
          <Typography
            variant="h5"
            onClick={handleBack}
            className={classNames(
              styles.title,
              styles.pointer,
              styles.pushRight
            )}
          >
            <ArrowBackIos
              className={styles.previousIcon}
              width={16}
              height={16}
            />
            Webhooks
          </Typography>
          <Typography
            variant="body1"
            onClick={handleNext}
            className={styles.subheading}
          >
            Defaults
            <ArrowForwardIosIcon
              className={styles.nextIcon}
              width={16}
              height={16}
            />
          </Typography>
        </>
      );
    }
    case 4: {
      return (
        <>
          <Typography
            variant="h5"
            onClick={handleBack}
            className={classNames(
              styles.title,
              styles.pointer,
              styles.pushRight
            )}
          >
            <ArrowBackIos
              className={styles.previousIcon}
              width={16}
              height={16}
            />
            Defaults
          </Typography>
        </>
      );
    }
    default: {
      return (
        <>
          <Typography
            variant="h5"
            className={classNames(styles.title, styles.pushRight)}
          >
            Settings
          </Typography>
          <Typography
            variant="body1"
            onClick={handleNext}
            className={styles.subheading}
          >
            Accounts
            <ArrowForwardIosIcon
              className={styles.nextIcon}
              width={16}
              height={16}
            />
          </Typography>
        </>
      );
    }
  }
};

const SettingsDialog = ({
  open,
  onDialogBoxCloseBtnClick
}: {
  open: boolean;
  onDialogBoxCloseBtnClick: any;
}) => {
  const [version, setVersion] = useState('');
  const styles = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  useEffect(() => {
    const getVersion = async () => {
      const v = await ipcRenderer.invoke(IPCKeys.GetVersion);
      setVersion(v);
    };

    getVersion();
  }, []);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      aria-labelledby="settings-dialogbox"
      disableEscapeKeyDown={false}
      onEscapeKeyDown={() => {
        setActiveStep(0);
        onDialogBoxCloseBtnClick({
          confirm: false
        });
      }}
    >
      <div className={styles.topRow}>
        <DialogTitle
          activeStep={activeStep}
          handleBack={handleBack}
          handleNext={handleNext}
        />
      </div>
      <DialogContent activeStep={activeStep} />
      <DialogActions className={styles.bottomRow}>
        <Typography variant="caption" className={styles.textCol}>
          <a
            onClick={() => ipcRenderer.send(IPCKeys.RequestCheckForUpdates)}
            className={styles.a}
          >
            Version {version || 'N/A'}
          </a>
          &#9;
          <a
            className={styles.aLight}
            onClick={() =>
              openExternalUrl({
                url: 'https://nebulabots.com/privacy',
                isRenderer: true
              })
            }
          >
            Privacy Policy
          </a>
          &nbsp;
          <a
            className={styles.aLight}
            onClick={() =>
              openExternalUrl({
                url: 'https://nebulabots.com/terms',
                isRenderer: true
              })
            }
          >
            Terms of Service
          </a>
        </Typography>
        <Button
          onClick={() => {
            setActiveStep(0);
            onDialogBoxCloseBtnClick({
              confirm: false
            });
          }}
          color="primary"
          className={classNames(styles.btnPositive)}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
