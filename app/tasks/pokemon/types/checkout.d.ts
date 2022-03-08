type link = {
  rel: string;
  rev: string;
  type: string;
  uri: string;
  href: string;
};

type message = {
  type: string;
  id: string;
  'debug-message': string;
  data: {
    casue: string;
  };
};

export type Checkout = {
  messages: message[];
  links: link[];
};
