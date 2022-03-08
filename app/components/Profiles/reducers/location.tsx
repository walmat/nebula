import { LOCATION_FIELDS } from '../actions';

export const location: Address = {
  name: '',
  address: '',
  apt: '',
  city: '',
  province: null,
  zip: '',
  country: { label: 'United States', value: 'US' },
  phone: '',
  email: ''
};

export type Address = {
  name: string;
  address: string;
  apt: string;
  city: string;
  province: null | {
    label: string;
    value: string;
  };
  zip: string;
  country: null | {
    label: string;
    value: string;
  };
  phone: string;
  email: string;
};

export const shipping = { ...location };
export const billing = { ...location };

type Action = {
  field: string;
  value: any;
};

export const locationReducer = (state = { ...location }, action: Action) => {
  const { field, value } = action;

  if (!field) {
    return state;
  }

  switch (field) {
    case LOCATION_FIELDS.COUNTRY: {
      if (!value || (state.country && value.value === state.country.value)) {
        return state;
      }

      return {
        ...state,
        [field]: value,
        province: null
      };
    }
    case LOCATION_FIELDS.PROVINCE: {
      if (!value || (state.province && value.value === state.province?.value)) {
        return state;
      }
      return {
        ...state,
        [field]: value
      };
    }
    default: {
      return {
        ...state,
        [field]: value
      };
    }
  }
};
