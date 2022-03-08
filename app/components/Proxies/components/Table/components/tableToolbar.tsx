import React from 'react';
import { ipcRenderer } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import CreatableSelect from 'react-select/creatable';
import { makeStyles } from '@material-ui/styles';
import { Toolbar, Typography, Button } from '@material-ui/core';
import {
  secondaryStyles,
  IndicatorSeparator
} from '../../../../../styles/select';
import { styles } from '../styles/tableToolbar';
import { makeStores } from '../../../../App/selectors';

import { removeFailed } from '../../../actions';
import {
  makeSelectedProxyGroup,
  makeSelectedProxies
} from '../../../selectors';

import { setField, SETTINGS_FIELDS } from '../../../../Settings/actions';
import { makeProxySite } from '../../../../Settings/selectors';
import { createStore } from '../../../../../constants';
import { IPCKeys } from '../../../../../constants/ipc';
import { IS_PROD } from '../../../../../constants/env';
import { RootState } from '../../../../../store/reducers';

const useStyles = makeStyles(styles);

type LabelValuePair = {
  value: string;
  label: string;
};

const EnhancedTableToolbar = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const store = useSelector(makeProxySite);
  const stores = useSelector(makeStores);
  const selectedList = useSelector(makeSelectedProxyGroup);
  const selectedProxies = useSelector(makeSelectedProxies);
  const theme = useSelector((state: RootState) => state.Theme);

  let newTaskStoreValue: LabelValuePair | null = null;
  if (store?.name) {
    newTaskStoreValue = {
      value: store.url,
      label: store.name
    };
  }

  const createStoreHandler = async (event: any) => {
    const newStore = createStore(event);

    if (!newStore) {
      return null;
    }

    return setProxySiteHandler({ label: newStore.name, value: newStore.url });
  };

  const setProxySiteHandler = (e: any) => {
    const value = e ? { name: e.label, url: e.value } : null;

    dispatch(setField(SETTINGS_FIELDS.PROXY_SITE, value));
  };

  const removeFailedHandler = () => {
    if (!selectedList) {
      return;
    }

    dispatch(removeFailed(selectedList));
  };

  const testRecaptchaHandler = () => {
    if (!selectedList) {
      return;
    }

    const { id, proxies } = selectedList;

    if (!id || !proxies?.length) {
      return;
    }

    ipcRenderer.send(
      IPCKeys.RequestTestProxy,
      id,
      'https://www.google.com/recaptcha/api.js',
      selectedProxies
    );
  };

  return (
    <Toolbar className={classnames(styles.root)}>
      <Typography className={styles.title} variant="subtitle1" id="tableTitle">
        Choose Site:
      </Typography>
      <CreatableSelect
        components={{ IndicatorSeparator }}
        autoFocus
        required
        isClearable
        menuPortalTarget={document.body}
        placeholder="None"
        styles={secondaryStyles(theme)}
        value={newTaskStoreValue}
        isOptionDisabled={(option: any) =>
          IS_PROD ? !option.supported && option.supported !== undefined : false
        }
        options={stores}
        onCreateOption={createStoreHandler}
        key="proxies--store"
        onChange={setProxySiteHandler}
      />
      <Button
        color="secondary"
        style={{
          marginLeft: 16,
          minHeight: 27,
          color: '#FFB15E',
          padding: `2px 8px`
        }}
        onClick={testRecaptchaHandler}
      >
        Test ReCAPTCHA
      </Button>
      <Button
        color="primary"
        style={{
          marginLeft: 16,
          minHeight: 27,
          color: '#C04949',
          padding: `2px 8px`
        }}
        onClick={removeFailedHandler}
      >
        Remove failed
      </Button>
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
