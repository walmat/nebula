import React from 'react';
import { useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { WindowedMenuList } from 'react-windowed-select';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup } from '@material-ui/core';
import { colorStyles, IndicatorSeparator } from '../../../../styles/select';
import { createStore } from '../../../../constants';

import { styles } from '../../../Tasks/styles/createDialog';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

type Props = {
  store: any;
  stores: any[];
  onChange: Function;
};

const StoreField = ({ store, stores, onChange }: Props) => {
  const styles = useStyles();
  const theme = useSelector((state: RootState) => state.Theme);

  const newStoreValue =
    store?.name != null
      ? {
          value: store.url,
          label: store.name
        }
      : null;

  const handleCreateStore = (event: any) => {
    const newStore = createStore(event);

    if (!newStore) {
      return null;
    }

    return onChange({
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
      value,
      stores
    });
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroup}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          Store
        </Typography>

        <CreatableSelect
          components={{ MenuList: WindowedMenuList, IndicatorSeparator }}
          autoFocus
          required
          isClearable
          menuPortalTarget={document.body}
          placeholder="None"
          styles={colorStyles(theme)}
          value={newStoreValue}
          options={stores}
          onCreateOption={e => handleCreateStore(e)}
          key="tasks--store"
          onChange={e => handleChange(e)}
        />
      </FormGroup>
    </div>
  );
};

export default StoreField;
