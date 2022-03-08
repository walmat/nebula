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
  maxPrice: any;
};
const MaximumPriceField = ({ onChange, isEditing, task, maxPrice }: Props) => {
  const styles = useStyles();

  const handleChange = (value: string) => {
    onChange({
      id: task.id,
      field: TASK_FIELDS.MAX_PRICE,
      value
    });
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroup}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          Maximum Price (Whole Dollar)
        </Typography>

        <DebouncedInput
          properties={{
            required: true,
            disableUnderline: true,
            key: 'tasks--min_price',
            placeholder: isEditing ? 'No change' : '100',
            className: styles.input
          }}
          text={maxPrice}
          InputComponent={Input}
          updateText={handleChange}
        />
      </FormGroup>
    </div>
  );
};

export default MaximumPriceField;
