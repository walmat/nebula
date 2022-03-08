import { Task } from '../constants';
import { getPaymentConfigSuccess } from './paymentsConfig';
import { checkout } from './checkout';
import {
  apiCheckouts,
  apiCheckoutsAddressError,
  apiCheckoutsVariantError
} from './apiCheckouts';
import { sessions } from './sessions';

export const kithTask = {
  account: null,
  amount: 1,
  captcha: false,
  endTime: null,
  id: 'ZIId4SqW3',
  message: 'Starting task',
  mode: 'FAST',
  monitor: 3500,
  retry: 3500,
  platform: 'Shopify',
  product: {
    neg: null,
    pos: null,
    raw: 'https://kith.com/collections/kith-kids/products/khk1023-102',
    url: 'https://kith.com/collections/kith-kids/products/khk1023-102',
    variant: null
  },
  profile: {
    billing: {
      address: '59 West 46th Street',
      apt: '10',
      city: 'New York',
      country: {
        label: 'United States',
        value: 'US'
      },
      email: 'teste@example.com',
      name: 'Test Awesome',
      phone: '1555123223',
      province: {
        label: 'New York',
        value: 'NY'
      },
      zip: '10036'
    },
    id: '1c2a7641-de12-47fb-9681-f05cd9e07e29',
    matches: true,
    name: 'Test Awesome',
    payment: {
      card: '4242424242424242',
      cvv: '234',
      exp: '10/30',
      holder: 'Test John',
      type: 'visa'
    },
    shipping: {
      address: '59 West 46th Street',
      apt: '10',
      city: 'New York',
      country: {
        label: 'United States',
        value: 'US'
      },
      email: 'teste@example.com',
      name: 'Test Awesome',
      phone: '1555123223',
      province: {
        label: 'New York',
        value: 'NY'
      },
      zip: '10036'
    }
  },
  proxies: null,
  quantity: 1,
  randomInStock: true,
  selected: true,
  sizes: ['Random'],
  startTime: null,
  state: 'RUNNING',
  store: {
    name: 'Kith',
    url: 'https://kith.com'
  },
  user: '112368837852180480'
  // TODO - recheck variants logic
  // variants: ['19436872106112'],
};

// same as task.store.url
// eslint-disable-next-line
const baseUrl = 'https://kith.com';

// Gather Data
export const kithMocks = {
  [Task.States.GATHER_DATA]: {
    endpoint: '/payments/config',
    success: getPaymentConfigSuccess()
  },
  [Task.States.CREATE_CHECKOUT]: {
    endpoint: '/checkout',
    success: checkout()
  },
  [Task.States.SUBMIT_CUSTOMER]: {
    endpoint: 'api/checkouts/00cedd8a0c1fda98b0e6ff320620e3e1.json',
    success: apiCheckouts(),
    error: apiCheckoutsAddressError(),
    wrongVariant: apiCheckoutsVariantError()
  },
  sessions: {
    endpoint: 'https://deposit.us.shopifycs.com/sessions',
    success: sessions()
  }
};
