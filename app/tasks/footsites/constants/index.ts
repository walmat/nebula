import { FootsiteTypes } from '../../../constants';

import {
  Task as TaskConstants,
  Monitor as MonitorConstants
} from '../../common/constants';

const MonitorStates = {
  ...MonitorConstants.States,
  STOCK: 'STOCK'
};

const CheckoutStates = {
  ...TaskConstants.States,
  GET_SESSION: 'GET_SESSION',
  GET_PRODUCT: 'GET_PRODUCT',
  GET_REDIRECT: 'GET_REDIRECT',
  GET_STOCK: 'GET_STOCK',
  QUEUE: 'QUEUE',
  ENTER_QUEUE: 'ENTER_QUEUE',
  WAIT_FOR_QUEUE: 'WAIT_FOR_QUEUE',
  SUBMIT_ENQUEUE: 'SUBMIT_ENQUEUE',
  SUBMIT_CAPTCHA_CHALLENGE: 'SUBMIT_CAPTCHA_CHALLENGE',
  HANDLE_POW: 'HANDLE_POW',
  SUBMIT_POW: 'SUBMIT_POW',
  ADD_TO_CART: 'ADD_TO_CART',
  WAIT_FOR_COOKIE: 'WAIT_FOR_COOKIE',
  SUBMIT_CAPTCHA: 'SUBMIT_CAPTCHA',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  SUBMIT_SHIPPING: 'SUBMIT_SHIPPING',
  SUBMIT_BILLING: 'SUBMIT_BILLING',
  SUBMIT_INFORMATION: 'SUBMIT_INFORMATION',
  SUBMIT_CHECKOUT: 'SUBMIT_CHECKOUT'
};

const Reasons = (error: string) => {
  if (/fraud/i.test(error)) {
    return 'Payment declined [FRAUD]';
  }

  if (/cvc_declined|invalid_pin/i.test(error)) {
    return 'Payment declined [CVC]';
  }

  if (
    /invalid_card|not_submitted|not_supported|expired_card|CardError/i.test(
      error
    )
  ) {
    return 'Payment declined [CARD]';
  }

  if (/TemporaryError|acquirer_error/i.test(error)) {
    return 'Payment declined [SITE]';
  }

  if (
    /declined_non_generic|declined|refused|restricted_card|not_enough_balance|transaction_not_permitted|block_card|referral|pending|notfinished|pin_validation_not_possible|pin_tries_exceeded/i.test(
      error
    )
  ) {
    return 'Payment declined [BANK]';
  }

  return 'Payment declined [UNKNOWN]';
};

const Task = {
  States: CheckoutStates,
  Modes: FootsiteTypes,
  Reasons
};

const Monitor = {
  States: MonitorStates
};

export { Task, Monitor };
