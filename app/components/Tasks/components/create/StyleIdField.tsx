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
  styleId: any;
};
const StyleIdField = ({ onChange, isEditing, task, styleId }: Props) => {
  const styles = useStyles();

  const handleChange = (value: string) => {
    onChange({
      id: task.id,
      field: TASK_FIELDS.STYLE_ID,
      value
    });
  };

  return (
    <FormGroup className={styles.formGroupTwo}>
      <Typography variant="subtitle2" className={styles.subtitle}>
        Style ID
      </Typography>

      <DebouncedInput
        properties={{
          required: true,
          disableUnderline: true,
          key: 'tasks--styleId',
          placeholder: isEditing ? 'No change' : 'example',
          className: styles.input
        }}
        text={styleId}
        InputComponent={Input}
        updateText={handleChange}
      />
    </FormGroup>
  );
};

export default StyleIdField;
