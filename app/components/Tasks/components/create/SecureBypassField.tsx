import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  FormGroup,
  Tooltip,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';

import { styles } from '../../styles/createDialog';
import { TASK_FIELDS } from '../../actions';

const useStyles = makeStyles(styles);

type Props = {
  onChange: Function;
  task: any;
  secureBypass: any;
};
const SecureBypassField = ({ onChange, task, secureBypass }: Props) => {
  const styles = useStyles();

  const handleChange = (event: any) => {
    const { checked } = event?.target;

    onChange({
      id: task.id,
      field: TASK_FIELDS.SECURE_BYPASS,
      value: checked
    });
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroup}>
        <Tooltip title="Enable this to bypass 3DSecure (EU only)">
          <FormControlLabel
            control={
              <Checkbox
                checked={secureBypass}
                onChange={e => handleChange(e)}
                value={secureBypass ? 'true' : 'false'}
                color="primary"
              />
            }
            label={
              <Typography variant="subtitle2" className={styles.subtitle}>
                Bypass 3DS
              </Typography>
            }
          />
        </Tooltip>
      </FormGroup>
    </div>
  );
};

export default SecureBypassField;
