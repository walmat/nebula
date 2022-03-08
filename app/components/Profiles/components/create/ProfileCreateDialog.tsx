import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Typography, Button, Dialog, MobileStepper } from '@material-ui/core';

import ShippingContent from './shipping';
import BillingContent from './billing';
import PaymentContent from './payment';

import { makeCreateProfile } from '../../../Settings/selectors';
import { styles } from '../../styles/createDialog';
import { saveProfile, loadProfile, PROFILE_FIELDS } from '../../actions';
import { makeCurrentProfile } from '../../selectors';

const useStyles = makeStyles(styles);

const DialogContent = ({
  activeStep,
  profile
}: {
  activeStep: number;
  profile: any;
}) => {
  switch (activeStep) {
    case 0:
      return (
        <ShippingContent
          id={profile.id}
          type={PROFILE_FIELDS.EDIT_SHIPPING}
          location={profile.shipping}
          matches={profile.matches}
        />
      );
    case 1:
      return (
        <BillingContent
          id={profile.id}
          location={profile.billing}
          type={PROFILE_FIELDS.EDIT_BILLING}
        />
      );
    case 2:
      return (
        <PaymentContent
          id={profile.id}
          payment={profile.payment}
          name={profile.name}
        />
      );
    default:
      return (
        <ShippingContent
          id={profile.id}
          type={PROFILE_FIELDS.EDIT_SHIPPING}
          location={profile.shipping}
          matches={profile.matches}
        />
      );
  }
};

const DialogTitle = ({
  activeStep,
  styles
}: {
  activeStep: number;
  styles: any;
}) => {
  switch (activeStep) {
    case 0: {
      return (
        <Typography variant="h6" className={styles.title}>
          Shipping Details
        </Typography>
      );
    }
    case 1: {
      return (
        <Typography variant="h6" className={styles.title}>
          Billing Details
        </Typography>
      );
    }
    case 2: {
      return (
        <Typography variant="h6" className={styles.title}>
          Payment Details
        </Typography>
      );
    }
    default: {
      return (
        <Typography variant="h6" className={styles.title}>
          Shipping Details
        </Typography>
      );
    }
  }
};

const CreateDialog = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const open = useSelector(makeCreateProfile);
  const profile = useSelector(makeCurrentProfile);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    const { matches } = profile;
    if (matches && activeStep === 0) {
      return setActiveStep(prevActiveStep => prevActiveStep + 2);
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    const { matches } = profile;
    if (matches && activeStep === 2) {
      return setActiveStep(prevActiveStep => prevActiveStep - 2);
    }
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleCloseModal = () => {
    dispatch(loadProfile(null));
    return setActiveStep(0);
  };

  const handleSaveProfile = () => {
    dispatch(saveProfile(profile));
    return handleCloseModal();
  };

  return (
    <Dialog
      open={open}
      fullWidth
      aria-labelledby="profiles-create"
      disableEscapeKeyDown={false}
      onEscapeKeyDown={handleCloseModal}
      classes={{
        paper: activeStep !== 2 ? styles.rootLg : styles.rootSm
      }}
    >
      <DialogTitle activeStep={activeStep} styles={styles} />
      <DialogContent activeStep={activeStep} profile={profile} />
      <MobileStepper
        variant="progress"
        steps={3}
        className={styles.stepperRoot}
        position="static"
        activeStep={activeStep}
        classes={{
          root: styles.bar,
          progress: styles.progressBar
        }}
        nextButton={
          activeStep === 2 ? (
            <Button color="primary" size="small" onClick={handleSaveProfile}>
              {profile.id ? 'Save' : 'Create'}
            </Button>
          ) : (
            <Button color="primary" size="small" onClick={handleNext}>
              Next
            </Button>
          )
        }
        backButton={
          activeStep === 0 ? (
            <Button color="primary" size="small" onClick={handleCloseModal}>
              Close
            </Button>
          ) : (
            <Button color="primary" size="small" onClick={handleBack}>
              Back
            </Button>
          )
        }
      />
    </Dialog>
  );
};

export default CreateDialog;
