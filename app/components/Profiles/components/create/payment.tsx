import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Cards from 'react-credit-cards';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/styles';
import { Typography, DialogContent, Input, FormGroup } from '@material-ui/core';

import DebouncedInput from '../../../DebouncedInput/DebouncedInput';

import { styles } from '../../styles/createDialog';
import { editProfile, PROFILE_FIELDS, PAYMENT_FIELDS } from '../../actions';

const useStyles = makeStyles(styles);

const PaymentFields = ({
  id,
  name,
  payment
}: {
  id: string;
  name: string;
  payment: any;
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [focus, setFocus] = useState(undefined);

  const handleSetFocus = (e: any) => {
    setFocus(e.target.name);
  };

  const editHandler = ({
    field,
    value,
    type = PROFILE_FIELDS.EDIT_PAYMENT
  }: {
    field?: string;
    value?: any;
    type?: string;
  }) => {
    dispatch(
      editProfile({
        id,
        type,
        field,
        value
      })
    );
  };

  return (
    <DialogContent className={styles.dialogContent}>
      <Cards
        cvc={payment.cvv}
        focused={focus}
        expiry={payment.exp}
        name={payment.holder}
        number={payment.card}
        placeholders={{
          name: 'John Doe'
        }}
      />
      <div className={styles.fieldsetFull}>
        <div className={styles.block}>
          <FormGroup className={styles.formGroup}>
            <Typography variant="subtitle2" className={styles.subtitle}>
              Name
            </Typography>

            <DebouncedInput
              properties={{
                disableUnderline: true,
                autoFocus: true,
                name: 'name',
                placeholder: 'John Doe',
                className: styles.input,
                onFocus: handleSetFocus
              }}
              text={payment.holder}
              InputComponent={Input}
              updateText={value =>
                editHandler({ field: PAYMENT_FIELDS.HOLDER, value })
              }
            />
          </FormGroup>
        </div>
        <div className={styles.block}>
          <FormGroup className={styles.formGroup}>
            <Typography variant="subtitle2" className={styles.subtitle}>
              Card Number
            </Typography>

            <DebouncedInput
              properties={{
                name: 'number',
                placeholder: '4242 4242 4242 4242',
                className: styles.input,
                onFocus: handleSetFocus,
                format: '#### #### #### ####'
              }}
              text={payment.card}
              InputComponent={NumberFormat}
              updateText={value =>
                editHandler({
                  field: PAYMENT_FIELDS.CARD,
                  value: value.replace(/\s/g, '')
                })
              }
            />
          </FormGroup>
        </div>
        <div className={styles.flex}>
          <FormGroup className={styles.formGroupOne}>
            <Typography variant="subtitle2" className={styles.subtitle}>
              Exp.
            </Typography>

            <DebouncedInput
              properties={{
                name: 'expiry',
                placeholder: 'MM/YY',
                className: styles.input,
                onFocus: handleSetFocus,
                format: '##/##',
                mask: ['M', 'M', 'Y', 'Y']
              }}
              text={payment.exp}
              InputComponent={NumberFormat}
              updateText={value =>
                editHandler({ field: PAYMENT_FIELDS.EXP, value })
              }
            />
          </FormGroup>
          <FormGroup className={styles.formGroupTwo}>
            <Typography variant="subtitle2" className={styles.subtitle}>
              CVC
            </Typography>

            <DebouncedInput
              properties={{
                disableUnderline: true,
                name: 'cvc',
                placeholder: '123',
                className: styles.input,
                onFocus: handleSetFocus
              }}
              text={payment.cvv}
              InputComponent={Input}
              updateText={value =>
                editHandler({ field: PAYMENT_FIELDS.CVV, value })
              }
            />
          </FormGroup>
        </div>
        <div className={styles.block}>
          <FormGroup className={styles.formGroup}>
            <Typography variant="subtitle2" className={styles.subtitle}>
              Profile Name
            </Typography>

            <DebouncedInput
              properties={{
                disableUnderline: true,
                name: 'profile',
                placeholder: 'Profile 1',
                className: styles.input,
                onFocus: handleSetFocus
              }}
              text={name}
              InputComponent={Input}
              updateText={value =>
                editHandler({ type: PROFILE_FIELDS.EDIT_NAME, value })
              }
            />
          </FormGroup>
        </div>
      </div>
    </DialogContent>
  );
};

export default PaymentFields;
