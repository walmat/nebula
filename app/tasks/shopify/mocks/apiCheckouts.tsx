/* eslint-disable camelcase */

import { ResponseMock } from './responseTypes';

export type Data = {
  data?: Data;
  checkout?: Checkout;
};
export type Checkout = {
  completed_at: null;
  created_at: string;
  currency: string;
  presentment_currency: string;
  customer_id: number;
  customer_locale: string;
  device_id: null;
  discount_code: null;
  email: string;
  legal_notice_url: null;
  location_id: null;
  name: string;
  note: string;
  note_attributes: Note_attributes;
  order_id: null;
  order_status_url: null;
  order: null;
  payment_due: string;
  payment_url: string;
  payments: any[];
  phone: null;
  shopify_payments_account_id: null;
  privacy_policy_url: null;
  refund_policy_url: string;
  requires_shipping: boolean;
  reservation_time_left: number;
  reservation_time: null;
  source_identifier: null;
  source_name: string;
  source_url: null;
  subscription_policy_url: null;
  subtotal_price: string;
  shipping_policy_url: null;
  tax_exempt: boolean;
  taxes_included: boolean;
  terms_of_sale_url: null;
  terms_of_service_url: string;
  token: string;
  total_price: string;
  total_tax: string;
  total_tip_received: string;
  total_line_items_price: string;
  updated_at: string;
  user_id: null;
  web_url: string;
  line_items: any[];
  gift_cards: any[];
  tax_lines: any[];
  tax_manipulations: any[];
  shipping_line: null;
  shipping_rate: null;
  shipping_address: Shipping_address;
  credit_card: null;
  billing_address: Billing_address;
  applied_discount: null;
};
export type Note_attributes = {};
export type Shipping_address = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  company: null;
  address1: string;
  address2: string;
  city: string;
  province: string;
  province_code: string;
  country: string;
  country_code: string;
  zip: string;
};
export type Billing_address = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  company: null;
  address1: string;
  address2: string;
  city: string;
  province: string;
  province_code: string;
  country: string;
  country_code: string;
  zip: string;
};

export const apiCheckouts = async (): Promise<ResponseMock<Data>> => {
  return {
    statusCode: 200,
    headers: {},
    data: {
      checkout: {
        completed_at: null,
        created_at: '2020-04-16T18:15:30-04:00',
        currency: 'USD',
        presentment_currency: 'USD',
        customer_id: 1238788407424,
        customer_locale: 'en',
        device_id: null,
        discount_code: null,
        email: 'teste@example.com',
        legal_notice_url: null,
        location_id: null,
        name: '#14237244981376',
        note: '',
        note_attributes: {},
        order_id: null,
        order_status_url: null,
        order: null,
        payment_due: '0.00',
        payment_url: 'https://elb.deposit.shopifycs.com/sessions',
        payments: [],
        phone: null,
        shopify_payments_account_id: null,
        privacy_policy_url: null,
        refund_policy_url:
          'https://kithnyc.myshopify.com/942252/policies/refund-policy.html?locale=en',
        requires_shipping: false,
        reservation_time_left: 0,
        reservation_time: null,
        source_identifier: null,
        source_name: 'checkout_next',
        source_url: null,
        subscription_policy_url: null,
        subtotal_price: '0.00',
        shipping_policy_url: null,
        tax_exempt: false,
        taxes_included: false,
        terms_of_sale_url: null,
        terms_of_service_url:
          'https://kithnyc.myshopify.com/942252/policies/terms-of-service.html?locale=en',
        token: '00cedd8a0c1fda98b0e6ff320620e3e1',
        total_price: '0.00',
        total_tax: '0.00',
        total_tip_received: '0.00',
        total_line_items_price: '0.00',
        updated_at: '2020-04-16T18:41:09-04:00',
        user_id: null,
        web_url:
          'https://kith.com/942252/checkouts/00cedd8a0c1fda98b0e6ff320620e3e1',
        line_items: [],
        gift_cards: [],
        tax_lines: [],
        tax_manipulations: [],
        shipping_line: null,
        shipping_rate: null,
        shipping_address: {
          id: 5112503304320,
          first_name: 'Test',
          last_name: 'Awesome',
          phone: '1555123223',
          company: null,
          address1: '59 West 46th Street',
          address2: '10',
          city: 'New York',
          province: 'New York',
          province_code: 'NY',
          country: 'United States',
          country_code: 'US',
          zip: '10036'
        },
        credit_card: null,
        billing_address: {
          id: 5112503304320,
          first_name: 'Test',
          last_name: 'Awesome',
          phone: '1555123223',
          company: null,
          address1: '59 West 46th Street',
          address2: '10',
          city: 'New York',
          province: 'New York',
          province_code: 'NY',
          country: 'United States',
          country_code: 'US',
          zip: '10036'
        },
        applied_discount: null
      }
    }
  };
};

export const apiCheckoutsAddressError = async () => {
  return {
    statusCode: 422,
    headers: {},
    data: {
      errors: {
        shipping_address: {
          last_name: [{ code: 'blank', message: "can't be blank", options: {} }]
        },
        billing_address: {
          last_name: [{ code: 'blank', message: "can't be blank", options: {} }]
        }
      }
    }
  };
};

export const apiCheckoutsVariantError = async () => {
  // eslint-disable-next-line
  const uri = 'https://kith.com/api/checkouts/00cedd8a0c1fda98b0e6ff320620e3e1.json';
  // eslint-disable-next-line
  const method = 'PATCH';
  // eslint-disable-next-line
  const json = {
    checkout: {
      line_items: [{ variant_id: undefined, quantity: 1, properties: {} }]
    }
  };

  return {
    statusCode: 422,
    headers: {},
    data: {
      errors: {
        line_items: {
          '0': {
            variant_id: [
              { code: 'invalid', message: 'is invalid', options: {} }
            ]
          }
        }
      }
    }
  };
};

/* eslint-enable camelcase */
