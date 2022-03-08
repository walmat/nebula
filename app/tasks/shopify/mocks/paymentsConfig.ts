import { ResponseMock } from './responseTypes';

export type PaymentsConfig = {
  paymentInstruments: PaymentInstruments;
};
export type PaymentInstruments = {
  accessToken: string;
  amazonPayConfig: null;
  applePayConfig: ApplePayConfig;
  checkoutConfig: CheckoutConfig;
  shopifyPayConfig: ShopifyPayConfig;
  currency: string;
  googlePayConfig: null;
  locale: string;
  paypalConfig: PaypalConfig;
  offsiteConfigs: null;
  supportsDiscounts: boolean;
  supportsGiftCards: boolean;
  checkoutDisabled: boolean;
};
export type ApplePayConfig = {
  shopId: number;
  countryCode: string;
  currencyCode: string;
  merchantCapabilities: string[];
  merchantId: string;
  merchantName: string;
  requiredBillingContactFields: string[];
  requiredShippingContactFields: string[];
  shippingType: string;
  supportedNetworks: string[];
  total: Total;
};
export type Total = {
  type: string;
  label: string;
  amount: string;
};
export type CheckoutConfig = {
  domain: string;
  shopId: number;
};
export type ShopifyPayConfig = {
  domain: string;
  shopId: number;
  accelerated: boolean;
  supportsLogin: boolean;
};
export type PaypalConfig = {
  domain: string;
  environment: string;
  merchantId: string;
  buttonVersion: string;
  venmoSupported: boolean;
  locale: string;
  shopId: number;
};

export const getPaymentConfigSuccess = (): ResponseMock<PaymentsConfig> => {
  return {
    statusCode: 200,
    headers: {
      'set-cookie': [
        '__cfduid=df893f529e9cc1700f6e54b0e818f08d51587034830; expires=Sat, 16-May-20 11:00:30 GMT; path=/; domain=.kith.com; HttpOnly; SameSite=Lax'
      ]
    },
    body: {
      paymentInstruments: {
        accessToken: '08430b96c47dd2ac8e17e305db3b71e8',
        amazonPayConfig: null,
        applePayConfig: {
          shopId: 942252,
          countryCode: 'US',
          currencyCode: 'USD',
          merchantCapabilities: ['supports3DS'],
          merchantId: 'gid://shopify/Shop/942252',
          merchantName: 'Kith',
          requiredBillingContactFields: ['postalAddress', 'email', 'phone'],
          requiredShippingContactFields: ['postalAddress', 'email', 'phone'],
          shippingType: 'shipping',
          supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
          total: { type: 'pending', label: 'Kith', amount: '1.00' }
        },
        checkoutConfig: { domain: 'kith.com', shopId: 942252 },
        shopifyPayConfig: {
          domain: 'kith.com',
          shopId: 942252,
          accelerated: false,
          supportsLogin: true
        },
        currency: 'USD',
        googlePayConfig: null,
        locale: 'en',
        paypalConfig: {
          domain: 'kith.com',
          environment: 'production',
          merchantId: 'J84BKAHN99EUL',
          buttonVersion: 'v3',
          venmoSupported: true,
          locale: 'en_US',
          shopId: 942252
        },
        offsiteConfigs: null,
        supportsDiscounts: true,
        supportsGiftCards: true,
        checkoutDisabled: false
      }
    }
  };
};
