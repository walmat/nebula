import React from 'react';
import { useSelector } from 'react-redux';
import WindowedSelect from 'react-windowed-select';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup } from '@material-ui/core';
import { colorStyles, IndicatorSeparator } from '../../../../styles/select';

import { buildProfileOptions } from '../../../../constants';
import { styles } from '../../../Tasks/styles/createDialog';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

type Props = {
  profiles: any;
  onChange: Function;
  profile: any;
};

const ProfileField = ({ profiles, onChange, profile }: Props) => {
  const styles = useStyles();
  const theme = useSelector((state: RootState) => state.Theme);

  const handleChangeProfile = (event: any) => {
    if (!event) {
      return onChange({
        value: event
      });
    }

    const profile = profiles.find((p: any) => p.id === event.value);
    return onChange({
      value: profile
    });
  };

  const getProfileValue = () => {
    if (!profile) {
      return null;
    }
    return {
      value: profile.id,
      label: profile.name
    };
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroup}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          Profile
        </Typography>

        <WindowedSelect
          required
          isClearable
          menuPortalTarget={document.body}
          menuPlacement="auto"
          classNamePrefix="select"
          placeholder="None"
          components={{
            IndicatorSeparator
          }}
          value={getProfileValue()}
          options={buildProfileOptions(profiles, false)}
          key="rates--profile"
          styles={colorStyles(theme)}
          onChange={(e: any) => handleChangeProfile(e)}
        />
      </FormGroup>
    </div>
  );
};

export default ProfileField;
