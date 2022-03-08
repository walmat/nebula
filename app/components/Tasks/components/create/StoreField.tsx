import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup } from '@material-ui/core';
import { TASK_FIELDS } from '../../actions';
import { colorStyles, IndicatorSeparator } from '../../../../styles/select';
import { createStore } from '../../../../constants';

import { addStore } from '../../../App/actions';
import { IS_PROD } from '../../../../constants/env';

import { styles } from '../../styles/createDialog';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

type Props = {
  store: any;
  stores: any[];
  isEditing: boolean;
  onChange: Function;
  task: any;
};

const StoreField = ({ store, stores, isEditing, onChange, task }: Props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.Theme);

  const newTaskStoreValue =
    store?.name != null
      ? {
          value: store.url,
          label: store.name
        }
      : null;

  const handleCreateStore = async (event: any) => {
    const newStore = createStore(event);

    if (!newStore) {
      return null;
    }

    dispatch(addStore(newStore));

    return onChange({
      id: task?.id,
      field: TASK_FIELDS.STORE,
      value: newStore,
      stores
    });
  };

  const handleChange = (e: any) => {
    const value = e
      ? {
          name: e.label,
          url: e.value
        }
      : null;

    return onChange({
      id: task?.id,
      field: TASK_FIELDS.STORE,
      value,
      stores
    });
  };

  return (
    <div className={styles.flex}>
      <FormGroup className={styles.formGroup}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          Store
        </Typography>
        <CreatableSelect
          components={{ IndicatorSeparator }}
          autoFocus
          required
          isClearable
          menuPortalTarget={document.body}
          placeholder={isEditing ? 'No change' : 'None'}
          styles={colorStyles(theme)}
          value={newTaskStoreValue}
          isOptionDisabled={option =>
            IS_PROD
              ? !option.supported && option.supported !== undefined
              : false
          }
          options={stores}
          onCreateOption={handleCreateStore}
          key="tasks--store"
          onChange={handleChange}
        />
      </FormGroup>
    </div>
  );
};

export default StoreField;
