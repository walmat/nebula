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
  minPrice: any;
};
const MinimumPriceField = ({ onChange, isEditing, task, minPrice }: Props) => {
  const styles = useStyles();

  const handleChange = (value: string) => {
    onChange({
      id: task.id,
      field: TASK_FIELDS.MIN_PRICE,
      value
    });
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroup}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          Minimum Price (Whole Dollar)
        </Typography>

        <DebouncedInput
          properties={{
            required: true,
            disableUnderline: true,
            key: 'tasks--min_price',
            placeholder: isEditing ? 'No change' : '50',
            className: styles.input
          }}
          text={minPrice}
          InputComponent={Input}
          updateText={handleChange}
        />
      </FormGroup>
    </div>
  );
};

export default MinimumPriceField;
