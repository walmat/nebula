type link = {
  rel: string;
  rev: string;
  type: string;
  uri: string;
  href: string;
};

export type Payment = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
  'display-name': string;
  token: string;
};
