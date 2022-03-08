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
  quantity: any;
};
const NumberOfTasksField = ({ onChange, isEditing, task, quantity }: Props) => {
  const styles = useStyles();

  const handleChange = (value: string) => {
    onChange({
      id: task.id,
      field: TASK_FIELDS.QUANTITY,
      value
    });
  };

  return (
    <FormGroup className={styles.formGroupTwo}>
      <Typography variant="subtitle2" className={styles.subtitle}>
        Product Quantity
      </Typography>

      <DebouncedInput
        properties={{
          required: true,
          disableUnderline: true,
          key: 'tasks--quantity',
          placeholder: isEditing ? 'No change' : '1',
          className: styles.input
        }}
        text={quantity}
        InputComponent={Input}
        updateText={handleChange}
      />
    </FormGroup>
  );
};

export default NumberOfTasksField;
