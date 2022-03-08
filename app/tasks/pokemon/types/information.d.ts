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

export type Information = {
  billing: {
    self: {
      type: string;
      uri: string;
      href: string;
    };
    messages: any[];
    links: link[];
    address: address;
    name: name;
  };
  shipping: {
    self: {
      type: string;
      uri: string;
      href: string;
    };
    messages: any[];
    links: link[];
    address: address;
    name: name;
  };
};
