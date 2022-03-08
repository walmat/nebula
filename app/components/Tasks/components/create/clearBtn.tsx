import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import { styles } from '../../styles/createDialog';
import { clearInputs } from '../../actions';

const useStyles = makeStyles(styles);

const ClearBtn = ({ isEditing = false }: { isEditing?: boolean }) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const clearDialog = useCallback(() => {
    dispatch(clearInputs(isEditing));
  }, []);

  return (
    <Button
      onClick={clearDialog}
      color="primary"
      className={classNames(styles.clearBtn)}
    >
      Clear
    </Button>
  );
};

ClearBtn.defaultProps = {
  isEditing: false
};

export default ClearBtn;
