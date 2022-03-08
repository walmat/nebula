type link = {
  rel: string;
  rev: string;
  type: string;
  uri: string;
  href: string;
};

type address = {
  'country-name': 'US';
  'extended-address': null;
  locality: string;
  organization: null;
  'phone-number': string;
  'postal-code': string;
  region: string;
  'street-address': string;
};

type name = {
  'family-name': string;
  'given-name': string;
};

type price = {
  amount: number;
  currency: 'USD'; // add more once we see them
  display: string;
};

type tax = {
  amount: number;
  currency: 'USD'; // add more once we see them
  title: string;
};

export type Success = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
  'billing-address': {
    address: address;
    name: name;
  };
  'monetary-total': price[];
  'payment-means': 'CREDITCARD';
  'payment-name': string;
  'purchase-date': {
    'display-value': string;
    value: number;
  };
  'purchase-number': string;
  'shipping-destinations': { address: address; name: name }[];
  'shipping-options': {
    carrier: string;
    cost: price[];
    'display-name': string;
    name: string;
  }[];
  status: string;
  'tax-total': price;
  taxes: tax[];
};
