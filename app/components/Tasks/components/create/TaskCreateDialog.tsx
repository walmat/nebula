import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { Typography, Dialog, DialogActions } from '@material-ui/core';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

import { MockToggle } from './MockToggle';
import { styles } from '../../styles/createDialog';
import { makeCreateTask } from '../../../Settings/selectors';
import { makeCurrentTask } from '../../selectors';

import CloseBtn from './closeBtn';
import CreateBtn from './createBtn';
import ClearBtn from './clearBtn';
import { getPlatformComponent } from './TaskForm';

import { toggleField, SETTINGS_FIELDS } from '../../../Settings/actions';

import { IS_DEV } from '../../../../constants/env';

const useStyles = makeStyles(styles);

const handleNext = (setActiveStep: Function) => {
  setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
};

const handleBack = (setActiveStep: Function) => {
  setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
};

const DialogTitle = ({
  activeStep,
  setActiveStep,
  styles
}: {
  activeStep: number;
  setActiveStep: Function;
  styles: any;
}) => {
  switch (activeStep) {
    case 0:
      return (
        <>
          <Typography
            variant="h5"
            className={classNames(styles.title, styles.pushRight)}
          >
            Task Details
          </Typography>
          <Typography
            variant="body1"
            onClick={() => handleNext(setActiveStep)}
            className={styles.subheading}
          >
            Advanced
            <ArrowForwardIosIcon
              className={styles.nextIcon}
              width={16}
              height={16}
            />
          </Typography>
        </>
      );
    case 1:
      return (
        <>
          <Typography
            variant="body1"
            onClick={() => handleBack(setActiveStep)}
            className={styles.subheadingLeft}
          >
            <ArrowBackIos
              className={styles.previousIcon}
              width={16}
              height={16}
            />
            Back
          </Typography>
          <Typography
            variant="h5"
            className={classNames(styles.titleLeft, styles.pushLeft)}
          >
            Advanced Details
          </Typography>
        </>
      );
    default:
      return (
        <>
          <Typography
            variant="h5"
            className={classNames(styles.title, styles.pushRight)}
          >
            Task Details
          </Typography>
          <Typography
            variant="body1"
            onClick={() => handleNext(setActiveStep)}
            className={styles.subheading}
          >
            Advanced
            <ArrowForwardIosIcon
              className={styles.nextIcon}
              width={16}
              height={16}
            />
          </Typography>
        </>
      );
  }
};

const TaskCreateDialog = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const { platform } = useSelector(makeCurrentTask);
  const open = useSelector(makeCreateTask);

  const [activeStep, setActiveStep] = useState<number>(0);
  const [useMassVariants, setUseMassVariants] = useState<boolean>(false);
  const [useMocks, setUseMocks] = useState<boolean>(false);

  const TaskForm = useMemo(() => getPlatformComponent(platform), [
    platform,
    useMassVariants
  ]);

  const closeDialog = () => {
    dispatch(toggleField(SETTINGS_FIELDS.CREATE_TASK));
    setActiveStep(0);
  };

  return (
    <Dialog
      open={open}
      fullWidth
      aria-labelledby="tasks-create"
      disableEscapeKeyDown={false}
      onEscapeKeyDown={closeDialog}
      classes={{
        paper: styles.root
      }}
    >
      <div className={styles.topRow}>
        <DialogTitle
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          styles={styles}
        />
      </div>
      <TaskForm
        isEditing={false}
        activeStep={activeStep}
        setUseMassVariants={setUseMassVariants}
        useMassVariants={useMassVariants}
      />
      <DialogActions className={styles.bottomRow}>
        <ClearBtn />
        <CloseBtn setActiveStep={setActiveStep} />
        <CreateBtn useMassVariants={useMassVariants} useMocks={useMocks} />
        {IS_DEV ? (
          <MockToggle useMocks={useMocks} setUseMocks={setUseMocks} />
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

export default TaskCreateDialog;
