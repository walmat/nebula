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
  paypal: boolean;
};
const PaypalField = ({
  label,
  title = 'Enable this to use PayPal checkout',
  onChange,
  task,
  paypal
}: Props) => {
  const styles = useStyles();

  const handleChange = (event: any) => {
    const { checked } = event.target;

    onChange({
      id: task.id,
      field: TASK_FIELDS.PAYPAL,
      value: checked
    });
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroupCondensed}>
        <Tooltip title={title}>
          <FormControlLabel
            control={
              <Checkbox
                checked={paypal}
                onChange={handleChange}
                value={paypal ? 'true' : 'false'}
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

PaypalField.defaultProps = {
  title: 'Enable this to use PayPal checkout'
};

export default PaypalField;
