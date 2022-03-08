type link = {
  rel: string;
  rev: string;
  type: string;
  uri: string;
  href: string;
};

export type Cart = {
  self: {
    type: string;
    uri: string;
    href: string;
  };
  messages: any[];
  links: link[];
  configuration: any;
  'is-freegiftitem': boolean;
  quantity: number;
};
