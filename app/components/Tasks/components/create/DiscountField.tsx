import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup, Input } from '@material-ui/core';

import DebouncedInput from '../../../DebouncedInput/DebouncedInput';
import { styles } from '../../styles/createDialog';
import { TASK_FIELDS } from '../../actions';

const useStyles = makeStyles(styles);

type Props = {
  onChange: Function;
  task: any;
  isEditing: boolean;
  discount: any;
};
const DiscountField = ({ onChange, isEditing, task, discount }: Props) => {
  const styles = useStyles();

  const handleChange = (value: string) => {
    onChange({
      id: task.id,
      field: TASK_FIELDS.DISCOUNT,
      value
    });
  };

  return (
    <FormGroup className={styles.formFieldTwo}>
      <Typography variant="subtitle2" className={styles.subtitle}>
        Discount Code
      </Typography>

      <DebouncedInput
        properties={{
          required: true,
          disableUnderline: true,
          key: 'tasks--discount',
          placeholder: isEditing ? 'No change' : 'example123',
          className: styles.input
        }}
        text={discount}
        InputComponent={Input}
        updateText={handleChange}
      />
    </FormGroup>
  );
};

export default DiscountField;
