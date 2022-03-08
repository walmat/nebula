import React from 'react';
import { useSelector } from 'react-redux';

import WindowedSelect from 'react-windowed-select';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup } from '@material-ui/core';
import { TASK_FIELDS } from '../../actions';
import { colorStyles, IndicatorSeparator } from '../../../../styles/select';

import { styles } from '../../styles/createDialog';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

type Props = {
  task: any;
  isEditing: boolean;
  onChange: Function;
  rate: any;
};
const RatesField = ({ task, isEditing, onChange, rate }: Props) => {
  const styles = useStyles();
  const ratesList = useSelector((state: RootState) => state.Rates);
  const theme = useSelector((state: RootState) => state.Theme);

  const handleChangeRate = (event: any) => {
    if (!event) {
      return onChange({
        id: task.id,
        field: TASK_FIELDS.SHIPPING_RATE,
        value: event
      });
    }

    return onChange({
      id: task.id,
      field: TASK_FIELDS.SHIPPING_RATE,
      value: event.value
    });
  };

  function extractRatesOptions() {
    if (!task.store) {
      return [];
    }

    const { url } = task.store;
    const ratesForStore = ratesList[url];
    if (!ratesForStore) {
      return [];
    }

    return ratesForStore.map(({ id, name, price }) => ({
      label: name,
      value: { id, name, price }
    }));
  }

  function getRateValue() {
    if (rate) {
      return {
        value: rate.id,
        label: rate.name
      };
    }

    return null;
  }

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroup}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          Shipping Rate
        </Typography>

        <WindowedSelect
          required
          isClearable
          menuPortalTarget={document.body}
          menuPlacement="auto"
          classNamePrefix="select"
          placeholder={isEditing ? 'No change' : 'None'}
          components={{
            IndicatorSeparator
          }}
          value={getRateValue()}
          options={extractRatesOptions()}
          key="tasks--rate"
          styles={colorStyles(theme)}
          onChange={handleChangeRate}
        />
      </FormGroup>
    </div>
  );
};

export default RatesField;
