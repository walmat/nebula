import { PokemonTypes } from '../../../constants';

import { Task as TaskConstants } from '../../common/constants';

const CheckoutStates = {
  ...TaskConstants.States,
  GET_COOKIE: 'GET_COOKIE',
  WAIT_FOR_COOKIE: 'WAIT_FOR_COOKIE',
  GET_CAPTCHA: 'GET_CAPTCHA',
  SOLVE_CAPTCHA: 'SOLVE_CAPTCHA',
  SUBMIT_CAPTCHA: 'SUBMIT_CAPTCHA',
  GET_SESSION: 'GET_SESSION',
  GET_PRODUCTS: 'GET_PRODUCTS',
  GET_PRODUCT: 'GET_PRODUCT',
  GET_STOCK: 'GET_STOCK',
  ADD_TO_CART: 'ADD_TO_CART',
  CLEAR_CART: 'CLEAR_CART',
  SUBMIT_INFORMATION: 'SUBMIT_INFORMATION',
  GET_CHECKOUT: 'GET_CHECKOUT',
  GET_KEY_ID: 'GET_KEY_ID',
  CREATE_ENCRYPT: 'CREATE_ENCRYPT',
  SUBMIT_PAYMENT: 'SUBMIT_PAYMENT',
  SUBMIT_CHECKOUT: 'SUBMIT_CHECKOUT'
};

const Task = {
  States: CheckoutStates,
  Modes: PokemonTypes
};

export { Task };
