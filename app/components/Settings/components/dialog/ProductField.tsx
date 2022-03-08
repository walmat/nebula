import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup, Input } from '@material-ui/core';
import DebouncedInput from '../../../DebouncedInput/DebouncedInput';
import { styles } from '../../../Tasks/styles/createDialog';

const useStyles = makeStyles(styles);

type Props = {
  label: any;
  onChange: Function;
  product: any;
};
const ProductField = ({ label, onChange, product }: Props) => {
  const styles = useStyles();

  const handleChange = (value: string) => {
    onChange({ value });
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroup}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          {label}
        </Typography>

        <DebouncedInput
          properties={{
            required: true,
            disableUnderline: true,
            key: 'rates--product',
            placeholder: '+yeezy, +350, -td',
            className: styles.input
          }}
          text={product?.raw || ''}
          InputComponent={Input}
          updateText={value => handleChange(value)}
        />
      </FormGroup>
    </div>
  );
};

export default ProductField;
