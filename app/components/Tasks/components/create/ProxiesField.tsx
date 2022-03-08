import React from 'react';
import { useSelector } from 'react-redux';
import WindowedSelect from 'react-windowed-select';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup } from '@material-ui/core';
import { colorStyles, IndicatorSeparator } from '../../../../styles/select';
import { buildProxiesOptions } from '../../../../constants';
import { styles } from '../../styles/createDialog';
import { TASK_FIELDS } from '../../actions';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

type Props = {
  proxies: any;
  proxyList: any;
  isEditing: boolean;
  onChange: Function;
  task: any;
};
const ProxiesField = ({
  proxies,
  proxyList,
  isEditing,
  onChange,
  task
}: Props) => {
  const styles = useStyles();
  const theme = useSelector((state: RootState) => state.Theme);

  const proxiesValue = proxies
    ? {
        value: proxies.id,
        label: proxies.name
      }
    : null;

  const handleChangeProxies = (event: any) => {
    if (!event) {
      return onChange({
        id: task.id,
        field: TASK_FIELDS.PROXIES,
        value: event
      });
    }

    if (event.value === 'None') {
      return onChange({
        id: task.id,
        field: TASK_FIELDS.PROXIES,
        value: {
          id: event.value,
          name: event.label
        }
      });
    }

    return onChange({
      id: task.id,
      field: TASK_FIELDS.PROXIES,
      value: { id: event.value, name: event.label }
    });
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroup}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          Proxies
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
          value={proxiesValue}
          options={buildProxiesOptions(proxyList, isEditing)}
          key="tasks--proxies"
          styles={colorStyles(theme)}
          onChange={(e: any) => handleChangeProxies(e)}
        />
      </FormGroup>
    </div>
  );
};

export default ProxiesField;
