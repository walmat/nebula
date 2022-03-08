import prefixer from '../../../utils/reducerPrefixer';

const prefix = '@@Checkouts';
const checkoutTypesList = ['ADD'];

export const checkoutActions = checkoutTypesList.map(t => `${prefix}/${t}`);
export const checkoutActionTypes = prefixer(prefix, checkoutTypesList);

export const addCheckout = checkout => {
  return {
    type: checkoutActionTypes.ADD,
    payload: checkout
  };
};
