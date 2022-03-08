import prefixer from '../../../utils/reducerPrefixer';

const prefix = '@@Captcha';
export const captchasActionList = ['DELETE', 'EDIT', 'CREATE', 'THEME'];

export const captchasActions = captchasActionList.map(a => `${prefix}/${a}`);
export const captchasActionTypes = prefixer(prefix, captchasActionList);

export const deleteCaptcha = captcha => {
  return dispatch => {
    dispatch({
      type: captchasActionTypes.DELETE,
      payload: captcha
    });
  };
};

export const createCaptcha = () => {
  return dispatch => {
    dispatch({
      type: captchasActionTypes.CREATE
    });
  };
};

export const editCaptcha = ({ id, type, field, value }) => ({
  type: captchasActionTypes.EDIT,
  payload: {
    id,
    type,
    field,
    value
  }
});

export const changeTheme = (theme = 1) => {
  return dispatch => {
    dispatch({
      type: captchasActionTypes.THEME,
      payload: theme
    });
  };
};
