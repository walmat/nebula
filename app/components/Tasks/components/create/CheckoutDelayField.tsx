import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup, Input } from '@material-ui/core';

import DebouncedInput from '../../../DebouncedInput/DebouncedInput';
import { styles } from '../../styles/createDialog';
import { TASK_FIELDS } from '../../actions';

const useStyles = makeStyles(styles);

type Props = {
  onChange: Function;
  isEditing: boolean;
  task: any;
  checkoutDelay: any;
};
const CheckoutDelayField = ({
  onChange,
  isEditing,
  task,
  checkoutDelay
}: Props) => {
  const styles = useStyles();

  const handleChange = (value: string) => {
    onChange({
      id: task.id,
      field: TASK_FIELDS.CHECKOUT_DELAY,
      value
    });
  };

  return (
    <FormGroup className={classNames(styles.formGroupOne)}>
      <Typography variant="subtitle2" className={styles.subtitle}>
        Checkout Delay
      </Typography>

      <DebouncedInput
        properties={{
          required: true,
          disableUnderline: true,
          key: 'tasks--checkout_delay',
          placeholder: isEditing ? 'No change' : '2750',
          className: styles.input
        }}
        text={checkoutDelay}
        InputComponent={Input}
        updateText={handleChange}
      />
    </FormGroup>
  );
};

export default CheckoutDelayField;
