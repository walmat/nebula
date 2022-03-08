import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup, Input } from '@material-ui/core';
import { TASK_FIELDS } from '../../actions';
import DebouncedInput from '../../../DebouncedInput/DebouncedInput';
import { styles } from '../../styles/createDialog';

import { Platforms } from '../../../../constants';

const useStyles = makeStyles(styles);

type Props = {
  label: any;
  task: any;
  isEditing: boolean;
  useMassVariants?: boolean;
  onChange: Function;
  stores: any;
  product: any;
};
const ProductField = ({
  label,
  task,
  isEditing,
  useMassVariants = false,
  onChange,
  stores,
  product
}: Props) => {
  const styles = useStyles();

  const { platform } = task;

  const handleChange = (value: string) => {
    onChange({
      id: task?.id,
      field: TASK_FIELDS.PRODUCT,
      value,
      stores
    });
  };

  let placeholder = '+yeezy, +350, -gs';
  switch (platform) {
    case Platforms.Shopify: {
      if (useMassVariants) {
        placeholder = '483874363591231';
      }
      break;
    }

    case Platforms.Supreme: {
      placeholder = '+hanes, +tee';
      break;
    }

    case Platforms.YeezySupply: {
      placeholder = 'FY5158';
      break;
    }

    case Platforms.Footsites: {
      placeholder = '622013';
      break;
    }

    case Platforms.NewBalance: {
      placeholder = 'https://www.newbalance.com/pd/...';
      break;
    }

    case Platforms.Pokemon: {
      placeholder = '290-80545';
      break;
    }

    case Platforms.Walmart: {
      placeholder = 'https://www.walmart.com/ip/~/...';
      break;
    }

    default:
  }

  if (isEditing) {
    placeholder = 'No change';
  }

  if (platform === Platforms.Shopify) {
    return (
      <FormGroup className={classNames(styles.formGroupOne, styles.flexOne)}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          {label}
        </Typography>

        <DebouncedInput
          properties={{
            required: true,
            rows: 1,
            multiline: useMassVariants,
            disableUnderline: true,
            key: 'tasks--product',
            placeholder,
            className: styles.input
          }}
          text={product?.raw || ''}
          InputComponent={Input}
          updateText={value => handleChange(value)}
        />
      </FormGroup>
    );
  }

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
            key: 'tasks--product',
            placeholder,
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

ProductField.defaultProps = {
  useMassVariants: false
};

export default ProductField;
