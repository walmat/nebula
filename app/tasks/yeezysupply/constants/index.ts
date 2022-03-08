import { YeezySupplyTypes } from '../../../constants';

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
  GET_HOMEPAGE: 'GET_HOMEPAGE',
  GET_AKAMAI: 'GET_AKAMAI',
  GET_BLOOM: 'GET_BLOOM',
  GET_BASKET: 'GET_BASKET',
  GET_PIXEL: 'GET_PIXEL',
  GET_PAYLOAD: 'GET_PAYLOAD',
  SUBMIT_PIXEL: 'SUBMIT_PIXEL',
  GET_PRODUCT_INFO: 'GET_PRODUCT_INFO',
  GET_PRODUCT_PAGE: 'GET_PRODUCT_PAGE',
  GET_WRGEN_ASSET: 'GET_WRGEN_ASSET',
  GET_US_PRODUCT: 'GET_US_PRODUCT',
  GET_SHARED: 'GET_SHARED',
  WAIT_FOR_SALE: 'WAIT_FOR_SALE',
  GET_AVAILABILITY: 'GET_AVAILABILITY',
  GET_CONFIG: 'GET_CONFIG',
  WAIT_IN_SPLASH: 'WAIT_IN_SPLASH',
  GET_SENSOR: 'GET_SENSOR',
  SUBMIT_SENSOR: 'SUBMIT_SENSOR',
  ADD_TO_CART: 'ADD_TO_CART',
  CLEAR_CART: 'CLEAR_CART',
  SUBMIT_INFORMATION: 'SUBMIT_INFORMATION',
  GET_PAYMENT: 'GET_PAYMENT',
  HANDLE_3DS: 'HANDLE_3DS',
  SUBMIT_CHECKOUT: 'SUBMIT_CHECKOUT',
  COMPLETE_CHECKOUT: 'COMPLETE_CHECKOUT',
  // browser specific states
  WAIT_FOR_LAUNCH: 'WAIT_FOR_LAUNCH',
  WAIT_FOR_CLOSE: 'WAIT_FOR_CLOSE'
};

const Reasons = (error: string) => {
  if (/fraud/i.test(error)) {
    return 'Payment failed [FRAUD]';
  }

  if (/cvc_declined|invalid_pin/i.test(error)) {
    return 'Payment failed [CVC]';
  }

  if (
    /invalid_card|not_submitted|not_supported|expired_card|CardError/i.test(
      error
    )
  ) {
    return 'Payment failed [CARD]';
  }

  if (/TemporaryError|acquirer_error/i.test(error)) {
    return 'Payment failed [SITE]';
  }

  if (
    /declined_non_generic|declined|refused|restricted_card|not_enough_balance|transaction_not_permitted|block_card|referral|pending|notfinished|pin_validation_not_possible|pin_tries_exceeded/i.test(
      error
    )
  ) {
    return 'Payment failed [BANK]';
  }

  return 'Payment failed [UNKNOWN]';
};

const Task = {
  States: CheckoutStates,
  Modes: YeezySupplyTypes,
  Reasons
};

const Monitor = {
  States: MonitorStates
};

export { Task, Monitor };
