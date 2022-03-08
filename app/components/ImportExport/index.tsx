import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { Typography, Button } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from './components/dialog';
import { styles } from './styles';

const useStyles = makeStyles(styles);

const ImportExportDialog = ({
  show,
  toggleState
}: {
  show: boolean;
  toggleState: any;
}) => {
  const styles = useStyles();

  return useMemo(
    () => (
      <Dialog
        open={show}
        fullWidth
        maxWidth="sm"
        aria-labelledby="state-dialogbox"
        disableEscapeKeyDown={false}
        onEscapeKeyDown={toggleState}
      >
        <div className={styles.topRow}>
          <Typography
            variant="h5"
            className={classNames(styles.title, styles.pushRight)}
          >
            Application State
          </Typography>
        </div>
        <DialogContent />
        <DialogActions className={styles.bottomRow}>
          <Button
            onClick={toggleState}
            color="primary"
            className={classNames(styles.btnPositive)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    ),
    [show]
  );
};

export default ImportExportDialog;
