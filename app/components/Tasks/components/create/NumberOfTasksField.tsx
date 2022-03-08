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
  amount: any;
  isEditing: boolean;
};
const NumberOfTasksField = ({ onChange, task, isEditing, amount }: Props) => {
  const styles = useStyles();

  const handleChange = (value: string) => {
    onChange({
      id: task.id,
      field: TASK_FIELDS.AMOUNT,
      value
    });
  };

  return (
    <FormGroup className={styles.formFieldOne}>
      <Typography variant="subtitle2" className={styles.subtitle}>
        Number of Tasks
      </Typography>

      <DebouncedInput
        properties={{
          required: !isEditing,
          disabled: isEditing,
          disableUnderline: true,
          key: 'tasks--amount',
          placeholder: isEditing ? 'Disabled' : '1',
          className: styles.input
        }}
        text={amount}
        InputComponent={Input}
        updateText={handleChange}
      />
    </FormGroup>
  );
};

export default NumberOfTasksField;
