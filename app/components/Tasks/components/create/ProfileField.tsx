import React from 'react';
import { useSelector } from 'react-redux';
import WindowedSelect from 'react-windowed-select';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup } from '@material-ui/core';
import { TASK_FIELDS } from '../../actions';
import { colorStyles, IndicatorSeparator } from '../../../../styles/select';

import { buildProfileOptions } from '../../../../constants';
import { styles } from '../../styles/createDialog';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

type Props = {
  profile: any;
  profiles: any;
  isEditing: boolean;
  task: any;
  useAll?: boolean;
  onChange: Function;
};

const ProfileField = ({
  profile,
  profiles,
  isEditing,
  task,
  useAll = true,
  onChange
}: Props) => {
  const styles = useStyles();
  const theme = useSelector((state: RootState) => state.Theme);

  const handleChangeProfile = (event: any) => {
    return onChange({
      id: task?.id,
      field: TASK_FIELDS.PROFILE,
      value: event
    });
  };

  return (
    <div className={styles.flex}>
      <FormGroup className={styles.formGroup}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          {isEditing ? 'Profile' : 'Profile(s)'}
        </Typography>

        <WindowedSelect
          required
          isMulti={!isEditing}
          isClearable
          closeMenuOnSelect={isEditing}
          menuPortalTarget={document.body}
          menuPlacement="auto"
          classNamePrefix="select"
          placeholder={isEditing ? 'No change' : 'None'}
          components={{
            IndicatorSeparator
          }}
          value={profile}
          options={buildProfileOptions(profiles, !isEditing && useAll)}
          key="tasks--profile"
          styles={colorStyles(theme)}
          onChange={(e: any) => handleChangeProfile(e)}
        />
      </FormGroup>
    </div>
  );
};

ProfileField.defaultProps = {
  useAll: true
};

export default ProfileField;
