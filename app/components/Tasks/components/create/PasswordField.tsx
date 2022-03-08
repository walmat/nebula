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
  password: string;
};

const PasswordField = ({ onChange, isEditing, task, password }: Props) => {
  const styles = useStyles();

  const handleChange = (value: string) => {
    onChange({
      id: task.id,
      field: TASK_FIELDS.PASSWORD,
      value
    });
  };

  return (
    <FormGroup className={styles.formGroupOne}>
      <Typography variant="subtitle2" className={styles.subtitle}>
        Store Password
      </Typography>

      <DebouncedInput
        properties={{
          required: true,
          disableUnderline: true,
          key: 'tasks--password',
          placeholder: isEditing ? 'No change' : 'None',
          className: styles.input
        }}
        text={password}
        InputComponent={Input}
        updateText={handleChange}
      />
    </FormGroup>
  );
};

export default PasswordField;
