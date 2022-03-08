import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { Typography, Button, Dialog, DialogActions } from '@material-ui/core';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import ClearBtn from '../create/clearBtn';

import { toggleField, SETTINGS_FIELDS } from '../../../Settings/actions';
import { styles } from '../../styles/createDialog';
import { cancelUpdate, updateTasks } from '../../actions';
import { makeEditTask as makeToggleEditTask } from '../../../Settings/selectors';
import { makeEditTask, makeSelectedTasksGroup } from '../../selectors';

import { getPlatformComponent } from '../create/TaskForm';

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
            Edit Details
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
            Edit Details
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

const TaskEditDialog = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const task: any = useSelector(makeEditTask);
  const selectedTaskGroup: any = useSelector(makeSelectedTasksGroup);
  const open = useSelector(makeToggleEditTask);

  const [activeStep, setActiveStep] = useState(0);
  const [useMassVariants, setUseMassVariants] = useState(false);

  const TaskForm = getPlatformComponent(task.platform);

  const closeDialog = () => {
    dispatch(toggleField(SETTINGS_FIELDS.EDIT_TASK));
    setActiveStep(0);
  };

  const handleCancelEdits = () => {
    dispatch(cancelUpdate());
    return closeDialog();
  };

  const handleEditTask = () => {
    dispatch(updateTasks(selectedTaskGroup.id, task));
    return closeDialog();
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
        isEditing
        activeStep={activeStep}
        setUseMassVariants={setUseMassVariants}
        useMassVariants={useMassVariants}
      />
      <DialogActions className={styles.bottomRow}>
        <ClearBtn isEditing />
        <Button
          onClick={handleCancelEdits}
          color="primary"
          className={classNames(styles.btnEnd)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleEditTask}
          color="primary"
          className={classNames(styles.btnStart)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskEditDialog;
