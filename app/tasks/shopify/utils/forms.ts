/* eslint-disable no-restricted-syntax */
import { convertArrayToObject } from '../../../utils/convertObjectToArray';
import { cardToPaypalIssuer } from '.';

export const submitCustomerApiForm = ({
  shipping,
  billing,
  discount = '',
  lineItems = []
}: {
  shipping: any;
  billing: any;
  discount?: string;
  lineItems: any;
}) => {
  const shippingProvinceValue = shipping.province
    ? shipping.province.value
    : '';

  const billingProvinceValue = billing.province ? billing.province.value : '';

  const shippingName = shipping.name.split(' ');
  const billingName = billing.name.split(' ');

  const base: any = {};
  if (discount) {
    base.checkout.discount_code = discount;
  }

  return {
    ...base,
    checkout: {
      ...base.checkout,
      email: billing.email,
      secret: true,
      shipping_address: {
        first_name: shippingName[0],
        last_name: shippingName[shippingName.length - 1],
        address1: shipping.address,
        address2: shipping.apt,
        country_code: shipping.country.value,
        province_code: shippingProvinceValue,
        city: shipping.city,
        zip: shipping.zip,
        phone: shipping.phone
      },
      billing_address: {
        first_name: billingName[0],
        last_name: billingName[billingName.length - 1],
        address1: billing.address,
        address2: billing.apt,
        country_code: billing.country.value,
        province_code: billingProvinceValue,
        city: billing.city,
        zip: billing.zip,
        phone: billing.phone
      },
      line_items: lineItems
    }
  };
};

export const patchShippingRate = ({ rate }: { rate: string }) => ({
  checkout: {
    shipping_rate: {
      id: rate
    }
  }
});

export type Property = {
  raw?: string;
  name: string;
  value: string;
  question: boolean;
};

export const patchCartForm = ({
  variant,
  quantity,
  properties
}: {
  variant: number;
  quantity: number;
  properties: Property[];
}) => {
  let extras = {};
  if (properties?.length) {
    extras = convertArrayToObject(properties, 'name', 'value');
  }

  return {
    checkout: {
      line_items: [
        {
          variant_id: variant,
          quantity,
          ...extras
        }
      ]
    }
  };
};

export const addToCart = ({
  variant,
  quantity,
  properties = [],
  injected
}: {
  variant: number;
  quantity: number;
  properties: Property[];
  injected: any;
}) => {
  const extras = convertArrayToObject(properties, 'name', 'value');

  return {
    form_type: 'product',
    utf8: '✓',
    id: `${variant}`,
    quantity,
    ...extras,
    ...injected
  };
};

export const submitCustomerForm = ({
  useCompany = false,
  useTerms = false,
  useRemember = false,
  profile,
  authToken = '',
  protection = [],
  captchaToken
}: {
  useCompany: boolean;
  useTerms: boolean;
  useRemember: boolean;
  profile: any;
  authToken: string;
  protection: any[];
  captchaToken: string;
}) => {
  const {
    name,
    address,
    province,
    country,
    city,
    apt,
    zip,
    phone,
    email
  } = profile.shipping;

  let body = '';
  const shippingName = name.split(' ');
  const provinceValue = province ? province.value : '';

  const base = {
    _method: 'patch',
    authenticity_token: authToken,
    previous_step: 'contact_information',
    step: 'shipping_method',
    'checkout[email]': email,
    'checkout[buyer_accepts_marketing]': '0'
  };

  // construct base body...
  for (const [name, value] of Object.entries(base)) {
    body += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;

    if (/buyer_accepts_marketing/i.test(name)) {
      // patch in '1' here as well
      body += `${encodeURIComponent(name)}=${encodeURIComponent('1')}&`;

      // and also add the honeypot form values
      let infoMap: any = {};
      if (useCompany) {
        infoMap = {
          'checkout[shipping_address][first_name]': shippingName[0],
          'checkout[shipping_address][last_name]':
            shippingName[shippingName.length - 1],
          'checkout[shipping_address][company]': '',
          'checkout[shipping_address][address1]': address,
          'checkout[shipping_address][address2]': apt,
          'checkout[shipping_address][city]': city,
          'checkout[shipping_address][country]': country.label,
          'checkout[shipping_address][province]': provinceValue,
          'checkout[shipping_address][zip]': zip,
          'checkout[shipping_address][phone]': phone
        };
      } else {
        infoMap = {
          'checkout[shipping_address][first_name]': shippingName[0],
          'checkout[shipping_address][last_name]':
            shippingName[shippingName.length - 1],
          'checkout[shipping_address][address1]': address,
          'checkout[shipping_address][address2]': apt,
          'checkout[shipping_address][city]': city,
          'checkout[shipping_address][country]': country.label,
          'checkout[shipping_address][province]': provinceValue,
          'checkout[shipping_address][zip]': zip,
          'checkout[shipping_address][phone]': phone
        };
      }

      // patch in information map
      for (const [name, value] of Object.entries(infoMap)) {
        // @ts-ignore
        body += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
      }

      // and again? thanks weird ass Shopify shit
      for (const [name, value] of Object.entries(infoMap)) {
        // @ts-ignore
        body += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
      }
    }
  }

  if (useRemember) {
    const vals = ['', '0'];
    for (const v of vals) {
      body += `${encodeURIComponent('checkout[remember_me]')}=${v}&`;
    }
  }

  if (useTerms) {
    body += `${encodeURIComponent(
      'checkout[attributes][I-agree-to-the-Terms-and-Conditions]'
    )}=Yes&`;
  }

  // patch in form protection
  if (protection && protection.length) {
    for (const { name, value } of protection) {
      body += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
    }
  }

  if (captchaToken) {
    body += `${encodeURIComponent('g-recaptcha-response')}=${encodeURIComponent(
      captchaToken
    )}&`;
  }

  // other stragglers...
  body += `${encodeURIComponent(
    'client_details[browser_width]'
  )}=${encodeURIComponent('927')}&`;
  body += `${encodeURIComponent(
    'client_details[browser_height]'
  )}=${encodeURIComponent('967')}&`;
  body += `${encodeURIComponent(
    'client_details[javascript_enabled]'
  )}=${encodeURIComponent('1')}&`;
  body += `${encodeURIComponent(
    'client_details[color_depth]'
  )}=${encodeURIComponent('30')}&`;
  body += `${encodeURIComponent(
    'client_details[java_enabled]'
  )}=${encodeURIComponent('false')}&`;
  body += `${encodeURIComponent(
    'client_details[browser_tz]'
  )}=${encodeURIComponent('360')}&`;

  return body;
};

export const submitShippingForm = ({
  useTerms = false,
  rate,
  authToken,
  protection = []
}: {
  useTerms: boolean;
  rate: string;
  authToken: string;
  protection: any[];
}) => {
  let body = '';
  const base = {
    _method: 'patch',
    authenticity_token: authToken,
    previous_step: 'shipping_method',
    step: 'payment_method',
    'checkout[shipping_rate][id]': rate
  };

  // construct base body...
  for (const [name, value] of Object.entries(base)) {
    body += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
  }

  if (useTerms) {
    body += `${encodeURIComponent(
      'checkout[attributes][I-agree-to-the-Terms-and-Conditions]'
    )}=Yes&`;
  }

  // patch in form protection
  if (protection && protection.length) {
    for (const { name, value } of protection) {
      body += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
    }
  }

  // other stragglers...
  body += `${encodeURIComponent(
    'client_details[browser_width]'
  )}=${encodeURIComponent('927')}&`;
  body += `${encodeURIComponent(
    'client_details[browser_height]'
  )}=${encodeURIComponent('967')}&`;
  body += `${encodeURIComponent(
    'client_details[javascript_enabled]'
  )}=${encodeURIComponent('1')}&`;
  body += `${encodeURIComponent(
    'client_details[color_depth]'
  )}=${encodeURIComponent('30')}&`;
  body += `${encodeURIComponent(
    'client_details[java_enabled]'
  )}=${encodeURIComponent('false')}&`;
  body += `${encodeURIComponent(
    'client_details[browser_tz]'
  )}=${encodeURIComponent('360')}&`;

  return body;
};

export const submitDiscountForm = ({
  discount,
  authToken
}: {
  discount: string;
  authToken: string;
}) => {
  let body = '';

  const base = {
    _method: 'patch',
    authenticity_token: authToken,
    step: 'payment_method',
    'checkout[reduction_code]': discount
  };

  // construct base body...
  for (const [name, value] of Object.entries(base)) {
    body += `${encodeURIComponent(name)}=${encodeURIComponent(value || '')}&`;
  }

  body += `${encodeURIComponent(
    'client_details[browser_width]'
  )}=${encodeURIComponent('927')}&`;
  body += `${encodeURIComponent(
    'client_details[browser_height]'
  )}=${encodeURIComponent('967')}&`;
  body += `${encodeURIComponent(
    'client_details[javascript_enabled]'
  )}=${encodeURIComponent('1')}&`;
  body += `${encodeURIComponent(
    'client_details[color_depth]'
  )}=${encodeURIComponent('24')}&`;
  body += `${encodeURIComponent(
    'client_details[java_enabled]'
  )}=${encodeURIComponent('false')}&`;
  body += `${encodeURIComponent(
    'client_details[browser_tz]'
  )}=${encodeURIComponent('240')}&`;

  return body;
};

export const submitPaymentForm = ({
  matches,
  billing,
  authToken,
  useCompany = false,
  protection = [],
  gateway = '',
  price = '',
  s
}: {
  matches: boolean;
  billing: any;
  authToken: string;
  useCompany?: boolean;
  protection: any[];
  gateway: string;
  price: string | number;
  s: string | undefined;
}) => {
  const { name, address, province, country, city, apt, zip, phone } = billing;

  let body = '';

  const provinceValue = province ? province.value : '';

  const base = {
    _method: 'patch',
    authenticity_token: authToken,
    previous_step: 'payment_method',
    step: '',
    s
  };

  // construct base body...
  for (const [name, value] of Object.entries(base)) {
    body += `${encodeURIComponent(name)}=${encodeURIComponent(value || '')}&`;
  }

  // patch in form protection
  if (protection && protection.length) {
    for (const { name, value } of protection) {
      body += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
    }
  }

  body += `${encodeURIComponent('checkout[payment_gateway]')}=${gateway}&`;

  const differentBilling = !matches;
  const nextBatch = {
    'checkout[credit_card][vault]': 'false',
    'checkout[different_billing_address]': differentBilling
  };

  // construct next batch...
  for (const [name, value] of Object.entries(nextBatch)) {
    body += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
  }

  if (differentBilling) {
    if (useCompany) {
      const honeypot = {
        'checkout[billing_address][first_name]': '',
        'checkout[billing_address][last_name]': '',
        'checkout[billing_address][company]': '',
        'checkout[billing_address][address1]': '',
        'checkout[billing_address][address2]': '',
        'checkout[billing_address][city]': '',
        'checkout[billing_address][country]': '',
        'checkout[billing_address][province]': '',
        'checkout[billing_address][zip]': '',
        'checkout[billing_address][phone]': ''
      };

      // construct billing form...
      for (const [name, value] of Object.entries(honeypot)) {
        body += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
      }

      const billingName = name.split(' ');
      const billingForm = {
        'checkout[billing_address][first_name]': billingName[0],
        'checkout[billing_address][last_name]':
          billingName[billingName.length - 1],
        'checkout[billing_address][company]': '',
        'checkout[billing_address][address1]': address,
        'checkout[billing_address][address2]': apt,
        'checkout[billing_address][city]': city,
        'checkout[billing_address][country]': country.label,
        'checkout[billing_address][province]': provinceValue,
        'checkout[billing_address][zip]': zip,
        'checkout[billing_address][phone]': phone
      };

      // construct billing form...
      for (const [name, value] of Object.entries(billingForm)) {
        body += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
      }
    } else {
      const honeypot = {
        'checkout[billing_address][first_name]': '',
        'checkout[billing_address][last_name]': '',
        'checkout[billing_address][address1]': '',
        'checkout[billing_address][address2]': '',
        'checkout[billing_address][city]': '',
        'checkout[billing_address][country]': '',
        'checkout[billing_address][province]': '',
        'checkout[billing_address][zip]': '',
        'checkout[billing_address][phone]': ''
      };

      // construct billing form...
      for (const [name, value] of Object.entries(honeypot)) {
        body += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
      }

      const billingName = name.split(' ');
      const billingForm = {
        'checkout[billing_address][first_name]': billingName[0],
        'checkout[billing_address][last_name]':
          billingName[billingName.length - 1],
        'checkout[billing_address][address1]': address,
        'checkout[billing_address][address2]': apt,
        'checkout[billing_address][city]': city,
        'checkout[billing_address][country]': country.label,
        'checkout[billing_address][province]': provinceValue,
        'checkout[billing_address][zip]': zip,
        'checkout[billing_address][phone]': phone
      };

      // construct billing form...
      for (const [name, value] of Object.entries(billingForm)) {
        body += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
      }
    }
  }

  body += `${encodeURIComponent('checkout[total_price]')}=${encodeURIComponent(
    price || ''
  )}&`;
  body += `${encodeURIComponent('complete')}=${encodeURIComponent('1')}&`;

  // other stragglers...
  body += `${encodeURIComponent(
    'client_details[browser_width]'
  )}=${encodeURIComponent('927')}&`;
  body += `${encodeURIComponent(
    'client_details[browser_height]'
  )}=${encodeURIComponent('967')}&`;
  body += `${encodeURIComponent(
    'client_details[javascript_enabled]'
  )}=${encodeURIComponent('1')}&`;
  body += `${encodeURIComponent(
    'client_details[color_depth]'
  )}=${encodeURIComponent('30')}&`;
  body += `${encodeURIComponent(
    'client_details[java_enabled]'
  )}=${encodeURIComponent('false')}&`;
  body += `${encodeURIComponent(
    'client_details[browser_tz]'
  )}=${encodeURIComponent('360')}&`;

  return body;
};

export const submitPaymentFormApi = ({
  matches,
  billing,
  rate = '',
  discount = '',
  gateway = '',
  authToken = '',
  price = '',
  s
}: {
  rate?: string;
  matches: boolean;
  billing: any;
  discount?: string;
  gateway?: string;
  authToken?: string;
  price?: string;
  s: string;
}) => {
  const { name, address, province, country, city, apt, zip, phone } = billing;

  const provinceValue = province ? province.value : '';

  const base: any = {
    _method: 'patch',
    authenticity_token: authToken,
    previous_step: 'payment_method',
    step: '',
    s
  };

  if (discount) {
    base['checkout[discount_code]'] = discount;
  }

  if (gateway) {
    base['checkout[payment_gateway]'] = gateway;
  }

  base['checkout[credit_card][vault]'] = false;

  const differentBilling = !matches;
  base['checkout[different_billing_address]'] = !matches;

  if (differentBilling) {
    const [firstName, lastName] = name.split(' ');
    base['checkout[billing_address][first_name]'] = firstName;
    base['checkout[billing_address][last_name]'] = lastName;
    base['checkout[billing_address][address1]'] = address;
    base['checkout[billing_address][address2]'] = apt;
    base['checkout[billing_address][city]'] = city;
    base['checkout[billing_address][country]'] = country.label;
    base['checkout[billing_address][province]'] = provinceValue;
    base['checkout[billing_address][zip]'] = zip;
    base['checkout[billing_address][phone]'] = phone;
  }

  base['checkout[total_price]'] = price;
  base.complete = 1;
  base['client_details[browser_width]'] = 1747;
  base['client_details[browser_height]'] = 967;
  base['client_details[javascript_enabled]'] = 1;
  base['client_details[color_depth]'] = 30;
  base['client_details[java_enabled]'] = false;
  base['client_details[browser_tz]'] = 300;

  if (rate) {
    base['checkout[shipping_rate][id]'] = rate;
  }

  return base;
};

export const submitReviewForm = ({
  captchaToken,
  free,
  price,
  authToken
}: {
  captchaToken?: string;
  free: boolean;
  price?: string;
  authToken?: string;
}) => {
  const base: any = {
    utf8: '✓',
    _method: 'patch',
    authenticity_token: authToken,
    'checkout[total_price]': price,
    complete: 1,
    'checkout[client_details][browser_width]': 927,
    'checkout[client_details][browser_height]': 967,
    'checkout[client_details][javascript_enabled]': 1
  };

  if (free) {
    base['checkout[payment_gateway]'] = 'free';
  }

  if (captchaToken) {
    base['g-recaptcha-response'] = captchaToken;
  }

  return base;
};

export const onboardGuest = (profile: any, token: string) => {
  const { shipping, billing, payment } = profile;

  const {
    name,
    address: sAddress,
    city: sCity,
    province: sProvince,
    zip: sZip,
    country: { value: sCountry }
  } = shipping;

  const {
    email,
    address: bAddress,
    city: bCity,
    province: bProvince,
    zip: bZip,
    phone,
    country: { value: bCountry }
  } = billing;

  const { holder, card, exp, cvv, type } = payment;
  const [month, year] = exp.split('/');

  const holderParts = holder.split(' ');

  const [bFirstName] = holderParts;
  const bLastName = holderParts[holderParts.length - 1];

  const shippingNameParts = name.split(' ');
  const [sFirstName] = shippingNameParts;
  const sLastName = shippingNameParts[shippingNameParts.length - 1];

  return {
    card: {
      cardNumber: card,
      expirationDate: `${month}/20${year}`,
      securityCode: cvv,
      type: cardToPaypalIssuer(type)
    },
    country: bCountry,
    email,
    firstName: bFirstName,
    lastName: bLastName,
    phone: {
      countryCode: '1',
      number: phone,
      type: 'MOBILE'
    },
    supportedThreeDsExperiences: ['IFRAME'],
    token,
    billingAddress: {
      line1: bAddress,
      city: bCity,
      state: bProvince ? bProvince.value : '',
      postalCode: bZip,
      accountQuality: {
        autoCompleteType: 'MERCHANT_PREFILLED',
        isUserModified: true,
        twoFactorPhoneVerificationId: ''
      },
      country: bCountry,
      familyName: bLastName,
      givenName: bFirstName
    },
    shippingAddress: {
      line1: sAddress,
      city: sCity,
      state: sProvince ? sProvince.value : '',
      postalCode: sZip,
      accountQuality: {
        autoCompleteType: 'MERCHANT_PREFILLED',
        isUserModified: true,
        twoFactorPhoneVerificationId: ''
      },
      country: sCountry,
      familyName: sLastName,
      givenName: sFirstName
    }
  };
};
