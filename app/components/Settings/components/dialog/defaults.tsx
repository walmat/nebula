import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import WindowedSelect from 'react-windowed-select';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  DialogContent,
  FormControl,
  FormGroup,
  Fade
} from '@material-ui/core';

import {
  colorStyles,
  fullWidthStyles,
  IndicatorSeparator
} from '../../../../styles/select';
import { selectDefault, DEFAULTS_FIELDS } from '../../actions';
import {
  makeAccountsList,
  makeDefaultAccount,
  makeDefaultMode,
  makeDefaultProxies,
  makeDefaultProfile,
  makeDefaultSizes
} from '../../selectors';
import { styles } from '../../styles';

import {
  buildAccountListOptions,
  buildProfileOptions,
  buildProxiesOptions,
  buildShopifyTaskModeOptions,
  createSize,
  getAllSizes
} from '../../../../constants';

import { makeProfiles } from '../../../Profiles/selectors';
import { makeProxies } from '../../../Proxies/selectors';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

const getDefaultAccountValue = (account: any) => {
  if (!account) {
    return null;
  }

  return {
    label: account.name,
    value: { ...account }
  };
};

const getDefaultModeValue = (mode: any) => {
  if (!mode) {
    return null;
  }

  return {
    label: mode,
    value: mode
  };
};

const getDefaultProxiesValue = (proxies: any) => {
  if (!proxies) {
    return null;
  }

  return {
    label: proxies.name,
    value: proxies.id
  };
};

const getDefaultProfileValue = (profile: any) => {
  if (!profile) {
    return null;
  }

  return profile;
};

const getDefaultSizesValue = (sizes: any) => {
  if (!sizes) {
    return null;
  }

  return sizes.map((size: any) => ({ label: size, value: size }));
};

const DefaultsSettingsDialog = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const theme = useSelector((state: RootState) => state.Theme);

  const accounts = useSelector(makeAccountsList);
  const profiles = useSelector(makeProfiles);
  const proxies = useSelector(makeProxies);

  const defaultAccount = useSelector(makeDefaultAccount);
  const defaultMode = useSelector(makeDefaultMode);
  const defaultProxies = useSelector(makeDefaultProxies);
  const defaultProfile = useSelector(makeDefaultProfile);
  const defaultSizes = useSelector(makeDefaultSizes);

  const accountValue = getDefaultAccountValue(defaultAccount);
  const modeValue = getDefaultModeValue(defaultMode);
  const proxiesValue = getDefaultProxiesValue(defaultProxies);
  const profileValue = getDefaultProfileValue(defaultProfile);
  const sizesValue = getDefaultSizesValue(defaultSizes);

  const chooseAccount = (event: any) => {
    if (!event) {
      return dispatch(selectDefault(DEFAULTS_FIELDS.ACCOUNT, null));
    }

    const account = accounts.find((a: any) => a.id === event.value);
    return dispatch(selectDefault(DEFAULTS_FIELDS.ACCOUNT, account));
  };

  const chooseMode = (event: any) => {
    if (!event) {
      return dispatch(selectDefault(DEFAULTS_FIELDS.MODE, null));
    }

    return dispatch(selectDefault(DEFAULTS_FIELDS.MODE, event.value));
  };

  const chooseProxies = (event: any) => {
    if (!event) {
      return dispatch(selectDefault(DEFAULTS_FIELDS.PROXIES, null));
    }

    return dispatch(
      selectDefault(DEFAULTS_FIELDS.PROXIES, {
        id: event.value,
        name: event.label
      })
    );
  };

  const chooseProfiles = (event: any) => {
    if (!event) {
      return dispatch(selectDefault(DEFAULTS_FIELDS.PROFILE, null));
    }

    return dispatch(selectDefault(DEFAULTS_FIELDS.PROFILE, event));
  };

  const chooseSize = (event: any) => {
    if (!event) {
      return dispatch(selectDefault(DEFAULTS_FIELDS.SIZES, null));
    }

    return dispatch(
      selectDefault(
        DEFAULTS_FIELDS.SIZES,
        event.map(({ value }: { value: string }) => value)
      )
    );
  };

  const makeSize = (event: any) => {
    const size = createSize(event);

    if (!size) {
      return null;
    }

    return dispatch(
      selectDefault(DEFAULTS_FIELDS.SIZES, [...defaultSizes, size])
    );
  };

  return (
    <Fade in>
      <DialogContent className={styles.dialog}>
        <FormControl component="fieldset" className={styles.accountFieldOne}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Account
              </Typography>

              <WindowedSelect
                required
                isClearable
                menuPortalTarget={document.body}
                menuPlacement="auto"
                classNamePrefix="select"
                placeholder="Choose Account"
                components={{
                  IndicatorSeparator
                }}
                value={accountValue}
                options={buildAccountListOptions(accounts, false)}
                key="default--account"
                styles={colorStyles(theme)}
                onChange={chooseAccount}
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.accountFieldTwo}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Mode
              </Typography>

              <WindowedSelect
                required
                isClearable
                menuPortalTarget={document.body}
                menuPlacement="auto"
                classNamePrefix="select"
                placeholder="Choose Mode"
                components={{
                  IndicatorSeparator
                }}
                value={modeValue}
                options={buildShopifyTaskModeOptions()}
                key="defaults--mode"
                styles={colorStyles(theme)}
                onChange={chooseMode}
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.accountFieldThree}>
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
                placeholder="No Proxies"
                components={{
                  IndicatorSeparator
                }}
                value={proxiesValue}
                options={buildProxiesOptions(proxies, false)}
                key="default--proxies"
                styles={colorStyles(theme)}
                onChange={chooseProxies}
              />
            </FormGroup>
          </div>
        </FormControl>

        <FormControl component="fieldset" className={styles.fieldSetHalfOne}>
          <div className={styles.block}>
            <FormGroup>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Profile(s)
              </Typography>

              <WindowedSelect
                required
                isMulti
                isClearable
                closeMenuOnSelect={false}
                menuPortalTarget={document.body}
                menuPlacement="auto"
                classNamePrefix="select"
                placeholder="No Profile"
                components={{
                  IndicatorSeparator
                }}
                value={profileValue}
                options={buildProfileOptions(profiles, true)}
                key="default--profile"
                styles={fullWidthStyles(theme)}
                onChange={chooseProfiles}
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldSetHalfTwo}>
          <div className={styles.block}>
            <FormGroup>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Sizes
              </Typography>

              <CreatableSelect
                required
                isMulti
                isClearable
                closeMenuOnSelect={false}
                menuPortalTarget={document.body}
                menuPlacement="auto"
                classNamePrefix="select"
                placeholder="No Sizes"
                components={{ IndicatorSeparator }}
                value={sizesValue}
                onCreateOption={makeSize}
                options={getAllSizes()}
                key="tasks--sizes"
                styles={fullWidthStyles(theme)}
                onChange={chooseSize}
              />
            </FormGroup>
          </div>
        </FormControl>
        <Typography variant="caption">
          Defaults are used for <strong>Quick Tasks</strong> on Shopify. Simply
          make sure you fill out all the provided fields above, then use the
          built-in monitor in the Discord server to quickly launch tasks into
          your <strong>Default</strong> task group.
        </Typography>
      </DialogContent>
    </Fade>
  );
};

export default DefaultsSettingsDialog;
