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
  task: any;
  isEditing: boolean;
  variation: any;
};
const VariationField = ({ onChange, isEditing, task, variation }: Props) => {
  const styles = useStyles();

  const handleChange = (value: string) => {
    onChange({
      id: task.id,
      field: TASK_FIELDS.VARIATION,
      value
    });
  };

  return (
    <FormGroup className={classNames(styles.formGroupTwo)}>
      <Typography variant="subtitle2" className={styles.subtitle}>
        Variation
      </Typography>

      <DebouncedInput
        properties={{
          required: true,
          disableUnderline: true,
          key: 'tasks--variation',
          placeholder: isEditing ? 'No change' : 'random',
          className: styles.input
        }}
        text={variation}
        InputComponent={Input}
        updateText={handleChange}
      />
    </FormGroup>
  );
};

export default VariationField;
