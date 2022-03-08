import prefixer from '../../../utils/reducerPrefixer';
import { toggleField, SETTINGS_FIELDS } from '../../Settings/actions';

const prefix = '@@Profile';
export const profilesActionList = [
  'DELETE',
  'DELETE_ALL',
  'DUPLICATE',
  'EDIT',
  'SAVE',
  'LOAD',
  'IMPORT',
  'EXPORT'
];
export const profilesActions = profilesActionList.map(a => `${prefix}/${a}`);
export const profilesActionTypes = prefixer(prefix, profilesActionList);

export const deleteProfiles = () => {
  return (dispatch: any) => {
    dispatch({
      type: profilesActionTypes.DELETE_ALL
    });
  };
};

export const deleteProfile = (profile: any) => {
  return (dispatch: any) => {
    dispatch({
      type: profilesActionTypes.DELETE,
      payload: profile
    });
  };
};

export const duplicateProfile = (profile: any) => {
  return (dispatch: any) => {
    dispatch({
      type: profilesActionTypes.DUPLICATE,
      payload: profile
    });
  };
};

export function importProfiles(profiles: any[]) {
  return (dispatch: any) => {
    dispatch({
      type: profilesActionTypes.IMPORT,
      payload: profiles
    });
  };
}

export function exportProfiles(profiles: any[]) {
  return (dispatch: any) => {
    dispatch({
      type: profilesActionTypes.EXPORT,
      payload: profiles
    });
  };
}

export function loadProfile(profile: any) {
  return (dispatch: any) => {
    dispatch({
      type: profilesActionTypes.LOAD,
      payload: profile
    });
    dispatch(toggleField(SETTINGS_FIELDS.CREATE_PROFILE));
  };
}

export function saveProfile(profile: any) {
  return (dispatch: any) => {
    dispatch({
      type: profilesActionTypes.SAVE,
      payload: profile
    });
  };
}

export const editProfile = ({
  id,
  type,
  field,
  value
}: {
  id: string;
  type: string;
  field?: string;
  value?: any;
}) => ({
  type: profilesActionTypes.EDIT,
  payload: {
    id,
    type,
    field,
    value
  }
});
