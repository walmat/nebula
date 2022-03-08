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
  label: any;
  title?: string;
  onChange: Function;
  task: any;
  captcha: any;
};
const ForceCaptchaField = ({
  label,
  title = 'Enable this to force a captcha solve',
  onChange,
  task,
  captcha
}: Props) => {
  const styles = useStyles();

  const handleChange = (event: any) => {
    const { checked } = event.target;

    onChange({
      id: task.id,
      field: TASK_FIELDS.CAPTCHA,
      value: checked
    });
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroup}>
        <Tooltip title={title}>
          <FormControlLabel
            control={
              <Checkbox
                checked={captcha}
                onChange={handleChange}
                value={captcha ? 'true' : 'false'}
                color="primary"
              />
            }
            label={
              <Typography variant="subtitle2" className={styles.subtitle}>
                {label}
              </Typography>
            }
          />
        </Tooltip>
      </FormGroup>
    </div>
  );
};

ForceCaptchaField.defaultProps = {
  title: 'Enable this to force a captcha solve'
};

export default ForceCaptchaField;
