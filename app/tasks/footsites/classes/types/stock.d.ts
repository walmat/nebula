export interface ProductStock {
  id: string;
  model: Model;
  style: Style;
  inventory: Inventory;
  sizes: Size[];
  styleVariants: StyleVariant[];
  sizeChart: SizeChart;
}

export interface Model {
  id: string;
  modelWebKey: number;
  companyNumber: string;
  banner: string;
  languageIsoCode: string;
  active: boolean;
  number: number;
  name: string;
  description: string;
  keywords: any[];
  brand: string;
  genders: string[];
  sports: string[];
  productHierarchy: ProductHierarchy;
  sizeChartId: string;
}

export interface ProductHierarchy {
  productTypes: string[];
  styles: string[];
  subStyles: string[];
}

export interface Style {
  id: string;
  sku: string;
  styleWebKey: number;
  modelWebKey: number;
  modelDocumentId: string;
  companyNumber: string;
  banner: string;
  languageIsoCode: string;
  active: boolean;
  description: string;
  color: string;
  primaryColor: string;
  secondaryColors: string[];
  width: string;
  leagueName: string;
  playerName: string;
  teamName: string;
  fitVariant: string;
  keywords: string[];
  productDesignator: string;
  newArrivalDate: string;
  ageBuckets: any[];
  price: Price;
  flagsAndRestrictions: FlagsAndRestrictions;
  launchAttributes: LaunchAttributes;
  giftCardDenominations: any;
  eligiblePaymentTypes: EligiblePaymentTypes;
  vendorAttributes: VendorAttributes;
}

export interface Price {
  formattedValue: any;
  currencyIso: any;
  listPrice: number;
  salePrice: number;
  formattedListPrice: string;
  formattedSalePrice: string;
  priceRange: string;
  topSalesAmount: number;
  taxClassificationCode: string;
}

export interface FlagsAndRestrictions {
  defaultStyle: boolean;
  newProduct: boolean;
  saleProduct: boolean;
  excludedFromDiscount: boolean;
  mapEnabled: boolean;
  freeShipping: boolean;
  recaptchaOn: boolean;
  shipToAndFromStore: boolean;
  hasShippingRestrictions: boolean;
  canBePaidByKlarna: any;
}

export interface LaunchAttributes {
  launchProduct: boolean;
  launchType: string;
  webOnlyLaunchMsg: string;
  webOnlyLaunch: boolean;
  launchDate: any;
  launchDisplayCounterEnabled: boolean;
  launchDisplayCounterKickStartTime: any;
}

export interface EligiblePaymentTypes {
  creditCard: boolean;
  giftCard: boolean;
  payPal: boolean;
  klarna: boolean;
  applePay: boolean;
  googlePay: boolean;
  payBright: boolean;
}

export interface VendorAttributes {
  supplierSkus: string[];
}

export interface Inventory {
  inventoryAvailable: boolean;
  storeInventoryAvailable: boolean;
  warehouseInventoryAvailable: boolean;
  inventoryAvailableLocations: any[];
  preSell: any;
  backOrder: any;
  purchaseOrderDate: any;
}

export interface Size {
  id: string;
  productWebKey: number;
  styleDocumentId: string;
  modelDocumentId: string;
  companyNumber: string;
  banner: string;
  languageIsoCode: string;
  active: boolean;
  productNumber: number;
  size: string;
  strippedSize: string;
  upc: string;
  storeUpc: string;
  storeSku: string;
  price: Price2;
  inventory: Inventory2;
}

export interface Price2 {
  currencyIso: any;
  listPrice: number;
  salePrice: number;
  formattedListPrice: string;
  formattedSalePrice: string;
  priceRange: string;
  topSalesAmount: any;
  taxClassificationCode: any;
}

export interface Inventory2 {
  inventoryAvailable: boolean;
  storeInventoryAvailable: boolean;
  warehouseInventoryAvailable: boolean;
  inventoryAvailableLocations: any[];
  preSell: boolean;
  backOrder: boolean;
  purchaseOrderDate: any;
}

export interface StyleVariant {
  styleWebKey: number;
  sku: string;
  upc: string;
  storeUpc: string;
  productWebKey: number;
  style: string;
  color: string;
  size: string;
  ageBuckets: any;
  price: Price3;
  inventory: Inventory3;
}

export interface Price3 {
  currencyIso: any;
  listPrice: number;
  salePrice: number;
  formattedListPrice: string;
  formattedSalePrice: string;
  priceRange: string;
  topSalesAmount: any;
  taxClassificationCode: any;
}

export interface Inventory3 {
  inventoryAvailable: boolean;
  storeInventoryAvailable: boolean;
  warehouseInventoryAvailable: boolean;
  inventoryAvailableLocations: string[];
  preSell: boolean;
  backOrder: boolean;
  purchaseOrderDate: any;
}

export interface SizeChart {
  id: string;
  sizeChartGridMap: SizeChartGridMap[];
  sizeChartTipTx: string;
  sizeChartImage: string;
}

export interface SizeChartGridMap {
  label: string;
  sizes: string[];
}
