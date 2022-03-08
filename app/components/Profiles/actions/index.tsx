import {
  importProfiles,
  exportProfiles,
  editProfile,
  loadProfile,
  saveProfile,
  deleteProfile,
  deleteProfiles,
  duplicateProfile,
  profilesActionTypes,
  profilesActionList,
  profilesActions
} from './profiles';

export { profilesActionTypes };
export { profilesActionList };
export { profilesActions };

export const PROFILE_FIELDS = {
  EDIT_SHIPPING: 'EDIT_SHIPPING',
  EDIT_BILLING: 'EDIT_BILLING',
  EDIT_PAYMENT: 'EDIT_PAYMENT',
  EDIT_NAME: 'EDIT_NAME',
  TOGGLE_MATCHES: 'TOGGLE_MATCHES'
};

export const LOCATION_FIELDS = {
  NAME: 'name',
  ADDRESS: 'address',
  APT: 'apt',
  CITY: 'city',
  PROVINCE: 'province',
  ZIP: 'zip',
  COUNTRY: 'country',
  EMAIL: 'email',
  PHONE: 'phone'
};

export const PAYMENT_FIELDS = {
  HOLDER: 'holder',
  CARD: 'card',
  TYPE: 'type',
  EXP: 'exp',
  CVV: 'cvv'
};

export {
  importProfiles,
  exportProfiles,
  saveProfile,
  loadProfile,
  deleteProfile,
  deleteProfiles,
  duplicateProfile,
  editProfile
};
