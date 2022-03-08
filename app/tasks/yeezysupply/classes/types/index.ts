/* eslint-disable camelcase */
type messageListItem = {
  type: string;
  details?: {
    shipmentId: string;
  };
};

type pricing = {
  total: number;
  baseTotal: number;
  totalTax: number;
  productTotal: number;
  productTotalBeforeDiscounts: number;
  productTotalBeforeOrderDiscounts: number;
  shippingTotal: number;
  shippingBaseTotal: number;
};

type productLineItem = {
  itemId: string;
  productId: string;
  productName: string;
  canonicalProductName: string;
  productImage: string;
  quantity: number;
  pricing: {
    baseUnitPrice: number;
    unitPrice: number;
    basePrice: number;
    price: number;
    priceAfterAllDiscounts: number;
    unitPriceWithoutTax: number;
  };
  gender: string;
  color: string;
  size: string;
  allowedActions: {
    delete: boolean;
    edit: boolean;
    moveToWishlist: boolean;
  };
  maxQuantityAllowed: number;
  isBonusProduct: boolean;
  productType: string;
  editLinkCustomizableProduct: string;
  availableStock: number;
  lastAdded: boolean;
  isFlashProduct: boolean;
};

type shipmentListItem = {
  shipmentId: string;
  shipmentType: string;
  productLineItemList: productLineItem[];
  shippingLineItem: {
    name: string;
    description: string;
    id: string;
    pricing: {
      basePrice: number;
      price: number;
    };
    carrierServiceName: string;
  };
  shippingOnDate: string;
};

type customer = {
  customerId: string;
  name?: string;
  email?: string;
  encryptedEmail?: string;
  customerEUCI?: string;
  receiveSmsUpdates?: boolean;
  isLoggedIn: boolean;
};

type shippingAddress = {
  address1: string;
  address2: string;
  city: string;
  country: string;
  firstName: string;
  id: string;
  lastName: string;
  phoneNumber: string;
  zipcode: string;
  stateCode: string;
  useAsBillingAddress: boolean;
};

export type AddToCartResponse = {
  basketId: string;
  currency: string;
  modifiedDate: string;
  pricing: pricing;
  resourceState: string;
  taxationPolicy: string;
  totalProductCount: number;
  messageList: messageListItem[];
  shipmentList: shipmentListItem[];
  customer: customer;
};

type messageList = {
  type: string;
  details: {
    code: string;
    status: number;
    message: string;
  };
};

export type ErrorSubmitCheckoutResponse = {
  message: string;
  errorCode: string;
  messageList: messageList[];
};

export type ProductInfoResponse = {
  id: string;
  name: string;
  model_number: string;
  product_type: string;
  meta_data: {
    page_title: string;
    site_name: string;
    description: string;
    keywords: string;
    canonical: string;
  };
  view_list: [
    {
      type: string;
      image_url: string;
      source: string;
    }
  ];
  pricing_information: {
    standard_price: number;
    standard_price_no_vat: number;
    currentPrice: number;
  };
  attribute_list: {
    isWaitingRoomProduct: boolean;
    badge_text: string;
    badge_style: string;
    brand: string;
    category: string;
    color: string;
    gender: string;
    personalizable: boolean;
    mandatory_personalization: boolean;
    customizable: boolean;
    pricebook: string;
    sale: boolean;
    outlet: boolean;
    isCnCRestricted: boolean;
    sport: string[];
    size_chart_link: string;
    preview_to: string;
    coming_soon_signup: boolean;
    max_order_quantity: number;
    productType: string[];
    search_color: string;
    specialLaunch: boolean;
    isInPreview: boolean;
    search_color_raw: string;
  };
  product_description: {
    title: string;
    subtitle: string;
    text: string;
    usps: string[];
    description_assets: object;
  };
  recommendationsEnabled: boolean;
  product_link_list: any[];
};

type paymentInstrumentListItem = {
  amount: number;
  id: string;
  paymentMethodId: string;
  cardType: string;
  expirationMonth: number;
  expirationYear: number;
  holder: string;
  lastFour: string;
};

export type SubmitCheckoutResponse = {
  creationDate: string;
  currency: string;
  exported: boolean;
  orderId: string;
  paymentStatus: string;
  pricing: pricing;
  resourceState: string;
  status: string;
  taxationPolicy: string;
  npsSurveyURL: string;
  taxCalculationMissing: boolean;
  orderToken: string;
  paymentInstrumentList: paymentInstrumentListItem[];
  shipmentList: shipmentListItem[];
  customer: customer;
  shippingAddress: shippingAddress;
  customerOrderHistoryStatus: number;
};

export type SubmitInformationResponse = {
  basketId: string;
  currency: 'USD';
  modifiedDate: string;
  pricing: pricing;
  resourceState: string;
  taxationPolicy: string;
  totalProductCount: number;
  messageList: any[];
  shipmentList: shipmentListItem[];
};

export type CorrelationHeaders = {
  'x-instana-l': string;
  'x-instana-s': string;
  'x-instana-t': string;
};
