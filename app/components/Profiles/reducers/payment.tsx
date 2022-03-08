export const payment: Payment = {
  holder: '',
  card: '',
  exp: '',
  cvv: '',
  type: ''
};

export type Payment = {
  card: string;
  cvv: string;
  exp: string;
  holder: string;
  type: string;
};

type Action = {
  field: string;
  value: string;
};

export const paymentReducer = (state = payment, action: Action) => {
  const { field, value } = action;
  if (!field) {
    return state;
  }

  switch (field) {
    default:
      return { ...state, [field]: value };
  }
};
