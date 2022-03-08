import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  FormGroup,
  Tooltip,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';

import { styles } from '../../styles/createDialog';
import { TASK_FIELDS } from '../../actions';

const useStyles = makeStyles(styles);

type Props = {
  label: any;
  title?: string;
  onChange: Function;
  task: any;
  oneCheckout: any;
};
const OneCheckoutField = ({
  label,
  title = 'Enable this for one checkout per profile',
  onChange,
  task,
  oneCheckout
}: Props) => {
  const styles = useStyles();

  const handleChange = (event: any) => {
    const { checked } = event.target;

    onChange({
      id: task.id,
      field: TASK_FIELDS.ONE_CHECKOUT,
      value: checked
    });
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroupCondensed}>
        <Tooltip title={title}>
          <FormControlLabel
            control={
              <Checkbox
                checked={oneCheckout}
                onChange={handleChange}
                value={oneCheckout ? 'true' : 'false'}
                color="primary"
              />
            }
            label={
              <Typography variant="subtitle2" className={styles.subtitle}>
                {label}
              </Typography>
            }
          />
        </Tooltip>
      </FormGroup>
    </div>
  );
};

OneCheckoutField.defaultProps = {
  title: 'Enable this for one checkout per profile'
};

export default OneCheckoutField;
