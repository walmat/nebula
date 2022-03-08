import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WindowedSelect from 'react-windowed-select';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  DialogContent,
  Input,
  FormControlLabel,
  FormGroup,
  Checkbox
} from '@material-ui/core';
import { colorStyles, IndicatorSeparator } from '../../../../styles/select';
import {
  buildCountryOptions,
  buildProvinceOptions,
  isProvinceDisabled
} from '../../../../constants';

import DebouncedInput from '../../../DebouncedInput/DebouncedInput';

import { styles } from '../../styles/createDialog';
import { editProfile, LOCATION_FIELDS, PROFILE_FIELDS } from '../../actions';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

const ShippingFields = ({
  id,
  type,
  matches,
  location
}: {
  id: string;
  type: string;
  matches: boolean;
  location: any;
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const theme = useSelector((state: RootState) => state.Theme);

  const editHandler = (field: string, value: any) => {
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
      <div className={styles.fieldset}>
        <div className={styles.block}>
          <FormGroup className={styles.formGroup}>
            <Typography variant="subtitle2" className={styles.subtitle}>
              Name
            </Typography>

            <DebouncedInput
              properties={{
                disableUnderline: true,
                autoFocus: true,
                required: true,
                autoCapitalize: 'words',
                key: `${type}--name`,
                placeholder: 'John Doe',
                className: styles.input
              }}
              text={location.name}
              InputComponent={Input}
              updateText={value => editHandler(LOCATION_FIELDS.NAME, value)}
            />
          </FormGroup>
        </div>
        <div className={styles.block}>
          <FormGroup className={styles.formGroup}>
            <Typography variant="subtitle2" className={styles.subtitle}>
              Address
            </Typography>

            <DebouncedInput
              properties={{
                disableUnderline: true,
                required: true,
                autoCapitalize: 'words',
                key: `${type}--address`,
                placeholder: '123 Test Street',
                className: styles.input
              }}
              text={location.address}
              InputComponent={Input}
              updateText={value => editHandler(LOCATION_FIELDS.ADDRESS, value)}
            />
          </FormGroup>
        </div>
        <div className={styles.block}>
          <FormGroup className={styles.formGroup}>
            <Typography variant="subtitle2" className={styles.subtitle}>
              Address 2
            </Typography>

            <DebouncedInput
              properties={{
                disableUnderline: true,
                required: true,
                autoCapitalize: 'words',
                key: `${type}--apt`,
                placeholder: 'Apt / Unit',
                className: styles.input
              }}
              text={location.apt}
              InputComponent={Input}
              updateText={value => editHandler(LOCATION_FIELDS.APT, value)}
            />
          </FormGroup>
        </div>
        <div className={styles.flex}>
          <FormGroup
            className={classNames(styles.formGroupOne, styles.flexOne)}
          >
            <Typography variant="subtitle2" className={styles.subtitle}>
              City
            </Typography>

            <DebouncedInput
              properties={{
                disableUnderline: true,
                required: true,
                autoCapitalize: 'words',
                key: `${type}--city`,
                placeholder: 'New York',
                className: styles.input
              }}
              text={location.city}
              InputComponent={Input}
              updateText={value => editHandler(LOCATION_FIELDS.CITY, value)}
            />
          </FormGroup>
          <FormGroup
            className={classNames(styles.formGroupTwo, styles.flexOne)}
          >
            <Typography variant="subtitle2" className={styles.subtitle}>
              State
            </Typography>

            <WindowedSelect
              required
              menuPlacement="top"
              classNamePrefix="select"
              placeholder="No Province"
              components={{
                IndicatorSeparator
              }}
              value={location.province}
              options={buildProvinceOptions(location.country)}
              key={`${type}--province`}
              styles={colorStyles(theme)}
              isDisabled={isProvinceDisabled(location.country)}
              onChange={(e: any) => editHandler(LOCATION_FIELDS.PROVINCE, e)}
            />
          </FormGroup>
        </div>
        <div className={styles.flex}>
          <FormGroup
            className={classNames(styles.formGroupOne, styles.flexOne)}
          >
            <Typography variant="subtitle2" className={styles.subtitle}>
              Country
            </Typography>

            <WindowedSelect
              required
              menuPlacement="top"
              classNamePrefix="select"
              placeholder="United States"
              components={{
                IndicatorSeparator
              }}
              value={location.country}
              options={buildCountryOptions()}
              key={`${type}--country`}
              styles={colorStyles(theme)}
              onChange={(e: any) => editHandler(LOCATION_FIELDS.COUNTRY, e)}
            />
          </FormGroup>
          <FormGroup
            className={classNames(styles.formGroupTwo, styles.flexNone)}
          >
            <Typography variant="subtitle2" className={styles.subtitle}>
              Zip
            </Typography>

            <DebouncedInput
              properties={{
                disableUnderline: true,
                required: true,
                autoCapitalize: 'words',
                key: `${type}--zip`,
                placeholder: '12345',
                className: styles.input
              }}
              text={location.zip}
              InputComponent={Input}
              updateText={value => editHandler(LOCATION_FIELDS.ZIP, value)}
            />
          </FormGroup>
        </div>
      </div>
      <div className={styles.fieldset}>
        <div className={styles.block}>
          <FormGroup className={styles.formGroup}>
            <Typography variant="subtitle2" className={styles.subtitle}>
              Email
            </Typography>

            <DebouncedInput
              properties={{
                disableUnderline: true,
                required: true,
                key: `${type}--email`,
                placeholder: 'johnsmith@gmail.com',
                className: styles.input
              }}
              text={location.email}
              InputComponent={Input}
              updateText={value => editHandler(LOCATION_FIELDS.EMAIL, value)}
            />
          </FormGroup>
        </div>
        <div className={styles.block}>
          <FormGroup className={styles.formGroup}>
            <Typography variant="subtitle2" className={styles.subtitle}>
              Phone Number
            </Typography>

            <DebouncedInput
              properties={{
                disableUnderline: true,
                required: true,
                type: 'tel',
                key: `${type}--phone`,
                placeholder: '5555555555',
                className: styles.input
              }}
              isNumerical
              text={location.phone}
              InputComponent={Input}
              updateText={value => editHandler(LOCATION_FIELDS.PHONE, value)}
            />
          </FormGroup>
        </div>
        <div className={styles.block}>
          <FormGroup className={styles.formGroupCenter}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={matches}
                  onChange={() =>
                    dispatch(
                      editProfile({ id, type: PROFILE_FIELDS.TOGGLE_MATCHES })
                    )
                  }
                  value={matches ? 'true' : 'false'}
                  color="primary"
                />
              }
              label={
                <Typography variant="subtitle2" className={styles.subtitle}>
                  Same Billing Information
                </Typography>
              }
            />
          </FormGroup>
        </div>
      </div>
    </DialogContent>
  );
};

export default ShippingFields;
