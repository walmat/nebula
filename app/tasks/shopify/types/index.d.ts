/* eslint-disable camelcase */

type properties = {
  [key: string]: string | number;
};

type featuredImage = {
  aspect_ratio: number;
  alt: string;
  height: number;
  url: string;
  width: number;
};

type optionsWithValue = {
  name: string;
  value: string;
};

export type AddToCartMessage = {
  productName?: string;
  chosenSize?: string;
  productImage?: string;
  productImageHi?: string;
};

export type AddToCartResponse = {
  id: number;
  properties: properties;
  quantity: number;
  variant_id: number;
  key: string;
  title: string;
  price: number;
  original_price: number;
  discounted_price: number;
  line_price: number;
  original_line_price: number;
  total_discount: number;
  discounts: any[];
  sku: string;
  grams: number;
  vendor: string;
  taxable: boolean;
  product_id: number;
  product_has_only_default_variant: boolean;
  gift_card: boolean;
  final_price: number;
  final_line_price: number;
  url: string;
  featured_image: featuredImage;
  image: string;
  handle: string;
  requires_shipping: boolean;
  product_type: string;
  product_title: string;
  product_description: string;
  variant_title: string;
  variant_options: string[];
  options_with_values: optionsWithValue[];
  line_level_discount_allocations: any[];
  line_level_total_discount: number;
};

type lineItem = {
  id: string;
  key: string;
  product_id: number;
  variant_id: number;
  sku: string;
  vendor: string;
  title: string;
  variant_title: string;
  image_url: string;
  taxable: boolean;
  requires_shipping: boolean;
  gift_card: boolean;
  price: string;
  compare_at_price: string;
  line_price: string;
  properties: {
    [key: string]: string | number;
  };
  quantity: number;
  grams: number;
  fulfillment_service: string;
  applied_discounts: any[];
};

type address = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  company: string | null;
  address1: string;
  address2: string;
  city: string;
  province: string;
  province_code: string;
  country: string;
  country_code: string;
  zip: string;
};

export type PatchCartResponse = {
  checkout: {
    completed_at: null | string;
    created_at: null | string;
    currency: string;
    presentment_currency: string;
    customer_id: number;
    customer_locale: string;
    device_id: null;
    discount_code: null;
    email: string;
    legal_notice_url: null;
    location_id: null;
    name: string;
    note: string;
    note_attributes: {
      [key: string]: string | number;
    };
    order_id: null;
    order_status_url: null;
    order: null;
    payment_due: string;
    payment_url: string;
    payments: any[];
    phone: null;
    shopify_payments_account_id: null;
    privacy_policy_url: null;
    refund_policy_url: string;
    requires_shipping: boolean;
    reservation_time_left: number;
    reservation_time: null;
    source_identifier: null;
    source_name: string;
    source_url: null;
    subscription_policy_url: null;
    subtotal_price: string;
    shipping_policy_url: null;
    tax_exempt: boolean;
    taxes_included: boolean;
    terms_of_sale_url: null;
    terms_of_service_url: string;
    token: string;
    total_price: string;
    total_tax: string;
    total_tip_received: string;
    total_line_items_price: string;
    updated_at: string;
    user_id: null;
    web_url: string;
    line_items: lineItem[];
    gift_cards: any[];
    tax_lines: any[];
    tax_manipulations: any[];
    shipping_line: null;
    shipping_rate: null;
    shipping_address: address;
    credit_card: null;
    billing_address: address;
    applied_discount: null;
  };
};
