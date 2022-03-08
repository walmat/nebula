import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import { styles } from '../../styles/createDialog';
import { toggleField, SETTINGS_FIELDS } from '../../../Settings/actions';

const useStyles = makeStyles(styles);

const CloseBtn = ({ setActiveStep }: { setActiveStep: Function }) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const closeDialog = useCallback(() => {
    dispatch(toggleField(SETTINGS_FIELDS.CREATE_TASK));
    setActiveStep(0);
  }, []);

  return (
    <Button
      onClick={closeDialog}
      color="primary"
      className={classNames(styles.btnEnd)}
    >
      Cancel
    </Button>
  );
};

export default CloseBtn;
