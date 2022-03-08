import {
  createCaptcha,
  editCaptcha,
  deleteCaptcha,
  captchasActionTypes,
  captchasActionList,
  captchasActions,
  changeTheme
} from './captchas';

export const HARVESTER_TYPES = {
  EDIT: 'EDIT'
};

export const HARVESTER_FIELDS = {
  NAME: 'name',
  STORE: 'store',
  PROXY: 'proxy',
  TOKEN: 'token',
  TYPE: 'type'
};

export {
  createCaptcha,
  editCaptcha,
  deleteCaptcha,
  captchasActionList,
  captchasActionTypes,
  captchasActions,
  changeTheme
};
