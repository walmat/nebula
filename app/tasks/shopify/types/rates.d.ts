/* eslint-disable camelcase */

export interface ShippingRates {
  shipping_rates: ShippingRate[];
}

export interface ShippingRate {
  id: string;
  price: string;
  title: string;
  checkout: Checkout;
  phone_required: boolean;
  delivery_range: any;
}

export interface Checkout {
  total_tax: string;
  total_price: string;
  subtotal_price: string;
}
