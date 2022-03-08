export type Profile = {
  id: string;
  name: string;
  matches: boolean;
  shipping: Location;
  billing: Location;
  payment: Payment;
};

export type Location = {
  name: string;
  address: string;
  apt: string;
  city: string;
  province: {
    value: string;
    label: string;
  };
  zip: string;
  country: {
    label: string;
    value: string;
  };
  phone: string;
  email: string;
};

export type Payment = {
  holder: string;
  card: string;
  exp: string;
  cvv: string;
  type: string;
};

export type Profiles = {
  [id: string]: Profile;
};
