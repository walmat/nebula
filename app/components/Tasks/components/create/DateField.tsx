import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { DateTimePicker } from '@material-ui/pickers';
import { Typography, FormGroup } from '@material-ui/core';

import { styles } from '../../styles/createDialog';

const useStyles = makeStyles(styles);

type Props = {
  label: string;
  value: string;
  isEditing: boolean;
  name: string;
  onChange: Function;
  task: any;
};
const DateField = (props: Props) => {
  const styles = useStyles();

  const { label, value, isEditing, name, onChange, task } = props;

  const getEmptyLabel = () => {
    if (props.emptyLabel) {
      return props.emptyLabel;
    }

    return isEditing ? 'No change' : 'No schedule';
  };

  const emptyLabel = getEmptyLabel();

  const handleChange = (event: any) => {
    return onChange({
      id: task?.id,
      field: name,
      value: event
    });
  };

  return (
    <FormGroup className={styles.formGroup}>
      <Typography variant="subtitle2" className={styles.subtitle}>
        {label}
      </Typography>

      <DateTimePicker
        autoOk={false}
        clearable
        disablePast
        hideTabs
        emptyLabel={emptyLabel}
        openTo="hours"
        format="MM/DD/YY hh:mm:ss a"
        InputProps={{ disableUnderline: true, style: { fontSize: 12 } }}
        key="tasks--schedule"
        className={styles.input}
        value={value || null}
        onChange={handleChange}
      />
    </FormGroup>
  );
};

export default DateField;
