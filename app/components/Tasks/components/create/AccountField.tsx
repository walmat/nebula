import React from 'react';
import { useSelector } from 'react-redux';
import WindowedSelect from 'react-windowed-select';
import { Typography, FormGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { TASK_FIELDS } from '../../actions';
import { colorStyles, IndicatorSeparator } from '../../../../styles/select';

import { buildAccountListOptions } from '../../../../constants';
import { styles } from '../../styles/createDialog';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

type Props = {
  account: any;
  accounts: any;
  isEditing: boolean;
  task: any;
  onChange: Function;
};

const AccountField = ({
  account,
  accounts,
  isEditing,
  onChange,
  task
}: Props) => {
  const styles = useStyles();
  const theme = useSelector((state: RootState) => state.Theme);

  const accountValue = account
    ? {
        label: account.name,
        value: {
          id: account.id,
          name: account.name,
          username: account.username,
          password: account.password
        }
      }
    : null;

  const handleChangeAccount = (event: any) => {
    if (!event) {
      return onChange({
        id: task.id,
        field: TASK_FIELDS.ACCOUNT,
        value: event
      });
    }

    if (event.value === 'None') {
      return onChange({
        id: task.id,
        field: TASK_FIELDS.ACCOUNT,
        value: {
          name: event.label,
          value: {
            id: event.value
          }
        }
      });
    }

    const account = accounts.find((acc: any) => acc.id === event.value);
    return onChange({
      id: task.id,
      field: TASK_FIELDS.ACCOUNT,
      value: account
    });
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroup}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          Account (optional)
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
          value={accountValue}
          options={buildAccountListOptions(accounts, isEditing)}
          key="tasks--account"
          styles={colorStyles(theme)}
          onChange={(e: any) => handleChangeAccount(e)}
        />
      </FormGroup>
    </div>
  );
};

export default AccountField;
