type link = {
  rel: string;
  rev: string;
  type: string;
  uri: string;
  href: string;
};

type availability = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
  state: 'AVAILABLE' | 'UNAVAILBLE';
};

type code = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
  code: string;
};

type detail = {
  'display-name': string;
  'display-value': string;
  name: string;
  value: string | number | boolean;
};

type definition = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
  details: detail[];
  'display-name': string;
  'reporting-properties': {
    crumb: string;
    'product-name': string;
  };
};

type addtocartform = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
  configuration: any;
  quantity: number;
};

type addtowishlistform = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
};

type availability = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
  state: 'AVAILABLE' | 'UNAVAILABLE';
};

type code = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
  code: string;
};

type priceItem = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
  'list-price': price[];
  'purchase-price': price[];
};

type variantDefinition = {
  _options: {
    _element: {
      _value: {
        self: {
          type: string;
          uri: string;
          href: string;
        };
        messages: any[];
        links: link[];
        'display-name': string;
        name: string;
      }[];
    }[];
  }[];
};

export type element = {
  _addtocartform: addtocartform[];
  _addtowishlistform: addtowishlistform[];
  _availability: availability[];
  _code: code[];
  _definition: variantDefinition[];
  _price: priceItem[];
};

type item = {
  _element: element[];
};

type price = {
  amount: number;
  currency: 'USD'; // add more once we see them
  display: string;
};

type priceRange = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
  'list-price-range': {
    'from-price': price[];
    'to-price': price[];
  };
  'purchase-price-range': {
    'from-price': price[];
    'to-price': price[];
  };
};

type image = {
  high: string;
  original: string;
  thumbnail: string;
};

export type Product = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
  _availability: availability[];
  _code: code[];
  _definition: definition[];
  _items: item[];
  _pricerange: priceRange[];
  images: image[];
};
