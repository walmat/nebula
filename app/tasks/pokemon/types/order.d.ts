type link = {
  rel: string;
  rev: string;
  type: string;
  uri: string;
  href: string;
};

type self = {
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

type cost = {
  amount: number;
  currency: string;
  display: string;
};

type billingaddress = {
  self: self;
  messages: any[];
  links: link[];
  address: address;
  name: name;
};

type billingaddressinfo = {
  _billingaddress: billingaddress[];
};

type destination = {
  self: self;
  messages: any[];
  links: link[];
  address: address;
  name: name;
};

type destinationinfo = {
  _destination: destination[];
  _shippingoptioninfo: shippingoptioninfo[];
};

type deliveries = {
  _element: destinationinfo[];
};

type choice = {
  self: self;
  messages: any[];
  links: link[];
  _description: [
    {
      self: self;
      messages: any[];
      links: link[];
      carrier: string;
      cost: cost[];
      'display-name': string;
      name: string;
    }
  ];
};

type selector = {
  _choice: choice[];
};

type shippingoption = {
  self: self;
  messages: any[];
  links: link[];
  carrier: string;
  cost: cost[];
  'display-name': string;
  name: string;
};

type shippingoptioninfo = {
  _selector: selector[];
  _shippingoption: shippingoption[];
};

type paymentmethod = {
  self: self;
  messages: any[];
  links: link[];
  'display-name': string;
  token: string;
};

type paymentmethodinfo = {
  _paymentmethod: paymentmethod[];
};

type subtotal = {
  self: self;
  messages: any[];
  links: link[];
  cost: cost[];
  discount: cost[];
};

type tax = {
  self: self;
  messages: any[];
  links: link[];
  cost: cost[];
  total: cost;
};

type total = {
  self: self;
  messages: any[];
  links: link[];
  cost: cost[];
};

type order = {
  self: self;
  messages: any[];
  links: link[];
  _billingaddressinfo: billingaddressinfo[];
  _deliveries: deliveries[];
  _paymentmethodinfo: paymentmethodinfo[];
  _subtotal: subtotal[];
  _tax: tax[];
  _total: total[];
};

export type Order = {
  self: self;
  messages: any[];
  links: link[];
  _order: order[];
  'total-quantity': number;
};
