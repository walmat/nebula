/* eslint-disable camelcase */
import { Geetest } from './geetest';
import { DatadomeData, DatadomeCookie } from './datadome';

type baseOptionsObject = {
  options: any[];
  selected: {
    ageBucket: any[];
    backOrderable: boolean;
    code: string;
    displayCountDownTimer: boolean;
    images: imageObject[];
    launchProduct: boolean;
    mapEnable: boolean;
    mobileBarCode: string;
    name: string;
    potentialPromotions: any[];
    preOrder: boolean;
    priceData: priceObject;
    recaptchaOn: boolean;
    shippingRestrictionExists: boolean;
    size: string;
    sizeAvailableInStores: boolean;
    stock: {
      stockLevel: number;
      stockLevelStatus: string;
    };
    style: string;
    variantOptionQualifiers: any[];
    variantOptions: any[];
    width: string;
  };
  variantType: string;
};

type slimPrice = {
  currencyIso: string;
  formattedValue: string;
  priceType: string;
  value: number;
};

type productObject = {
  baseOptions: baseOptionsObject[];
  baseProduct: string;
  categories: any[];
  classifications: any[];
  code: string;
  displayCountDownTimer: boolean;
  freeShipping: boolean;
  futureStocks: any[];
  giftCosts: any[];
  images: any[];
  launchProduct: boolean;
  potentialPromotions: any[];
  price: slimPrice;
  productReferences: any[];
  reviews: any[];
  sizeChartGridMap: any[];
  skuExclusions: boolean;
  stock: {
    stockLevel: number;
    stockLevelStatus: string;
  };
  styleVariantCode: any[];
  variantMatrix: any[];
  variantOptions: any[];
  volumePrices: any[];
};

type entriesObject = {
  applicableDeliveryModes: any[];
  entryNumber: number;
  product: productObject;
  productPriceVariation: boolean;
  quantity: number;
  shippingRestricted: boolean;
  totalPrice: slimPrice;
};

export type AddToCartResponse = {
  appliedCoupons: any[];
  appliedOrderPromotions: any[];
  appliedProductPromotions: any[];
  appliedVouchers: any[];
  cartMerged: boolean;
  code: string;
  deliveryOrderGroups: any[];
  eligiblePaymentTypesForCart: any[];
  entries: entriesObject[];
  gfPaymentInfo: any[];
  giftBoxAdded: boolean;
  giftOrder: boolean;
  guid: string;
  isCartContainGiftCard: boolean;
  isCarthasOnlyEMailGiftCard: boolean;
  orderDiscounts: slimPrice;
  outOfStockProducts: any[];
  pickupOrderGroups: any[];
  potentialOrderPromotions: any[];
  potentialProductPromotions: any[];
  productDiscounts: slimPrice;
  subTotal: slimPrice;
  totalDiscounts: slimPrice;
  totalItems: number;
  totalPrice: slimPrice;
  totalPriceWithTax: slimPrice;
  totalTax: slimPrice;
  totalUnitCount: number;
  type: string;
};

type categoryObject = {
  code: string;
  name: string;
};

type variationEntry = {
  altText: string;
  format: string;
  url: string;
};

type imageObject = {
  code: string;
  variations: variationEntry[];
};

type attributesObject = {
  id: string;
  type: string;
  value: string;
};

type priceObject = {
  currencyIso: string;
  formattedOriginalPrice?: string;
  formattedValue: string;
  originalPrice: number;
  value: number;
};

export type SellableUnit = {
  attributes: attributesObject[];
  barCode: string;
  code: string;
  isBackOrderable: boolean;
  isPreOrder: boolean;
  isRecaptchaOn: boolean;
  price: priceObject;
  singleStoreInventory: boolean;
  sizeAvailableInStores: boolean;
  sizeAvailableInStoresMessage?: string;
  stockLevelStatus: string;
};

type sizeChartGridMap = {
  label: string;
  sizes: string[];
};

type variantAttributes = {
  code: string;
  skuLaunchDate: string;
  displayCountDownTimer: boolean;
  eligiblePaymentTypesForProduct: string[];
  freeShipping: boolean;
  freeShippingMessage: string;
  isSelected?: boolean;
  launchProduct: boolean;
  mapEnable: boolean;
  price: priceObject;
  recaptchaOn: boolean;
  riskified: boolean;
  shipToAndFromStore: boolean;
  shippingRestrictionExists: boolean;
  sku: string;
  skuExclusions: boolean;
  stockLevelStatus: string;
  webOnlyLaunch: boolean;
  width: string;
};

export type GetStockResponse = {
  brand: string;
  categories: categoryObject[];
  description: string;
  dropShip: boolean;
  freeShipping: boolean;
  giftCosts: number[];
  images: imageObject[];
  isNewProduct: boolean;
  isSaleProduct: boolean;
  modelNumber: string;
  name: string;
  sellableUnits: SellableUnit[];
  sizeChartGridMap: sizeChartGridMap[];
  sizeChartImage: string;
  sizeChartTipTx: string;
  variantAttributes: variantAttributes[];
};

export type GetSessionResponse = {
  data: {
    csrfToken: string;
    user: {
      firstName: string;
      serverUTC: string;
      optIn: boolean;
      militaryVerified: boolean;
      loyaltyStatus: boolean;
      ssoComplete: boolean;
      vipUser: boolean;
      authenticated: boolean;
      recognized: boolean;
      vip: boolean;
      loyalty: boolean;
    };
    cart: any;
  };
  success: boolean;
  errors: any[];
};

export type SubmitInformationResponse = {
  billingAddress: boolean;
  country: {
    isocode: string;
  };
  defaultAddress: boolean;
  firstName: string;
  id: string;
  lastName: string;
  line1: string;
  line2: string;
  phone: string;
  postalCode: string;
  recordType: string;
  region: {
    isocode: string;
  };
  setAsBilling: boolean;
  shippingAddress: boolean;
  town: string;
  visibleInAddressBook: boolean;
};

export type SubmitCheckoutResponse = {
  // TODO;
};

export type CreatePaymentResourceResponse = {
  paymentResource: {
    paymentToken: string;
    intent: string;
    redirectUrl: string;
    authenticateUrl: null;
  };
};

type resolver = {
  path: string[];
  parentType: string;
  fieldName: string;
  returnType: string;
  startOffset: number;
  duration: number;
};

export type OnboardGuestResponse = {
  data: {
    onboardAccount: {
      buyer: {
        auth: {
          accessToken: string;
          __typename: string;
        };
        userId: string;
        __typename: string;
      };
      flags: {
        is3DSecureRequired: boolean;
        __typename: string;
      };
      paymentContingencies: {
        threeDomainSecure: null;
        threeDSContingencyData: null;
        __typename: string;
      };
      __typename: string;
    };
  };
  extensions: {
    tracing: {
      version: number;
      startTime: string;
      endTime: string;
      duration: number;
      execution: {
        resolvers: resolver[];
      };
    };
    correlationId: string;
  };
};

export type SubmitAccountResponse = {
  paypalAccounts: [
    {
      type: string;
      nonce: string;
      description: string;
      consumed: boolean;
      details: {
        payerInfo: {
          email: string;
          firstName: string;
          lastName: string;
          payerId: string;
          shippingAddress: {
            recipientName: string;
            line1: string;
            city: string;
            state: string;
            postalCode: string;
            countryCode: string;
          };
          phone: string;
          countryCode: string;
        };
        correlationId: string;
        billingAddress: null;
        shippingAddress: {
          recipientName: string;
          line1: string;
          city: string;
          state: string;
          postalCode: string;
          countryCode: string;
        };
      };
    }
  ];
};

export type AllowedSkus = {
  [sku: string]: boolean;
};

export { Geetest, DatadomeData, DatadomeCookie };
