/* eslint-disable camelcase */

export interface Products {
  response: Response;
  facet_counts: FacetCounts;
  category_map: CategoryMap;
}

export interface Response {
  numFound: number;
  start: number;
  docs: ProductsDocument[];
}

export interface ProductsDocument {
  sale_price: number;
  price: number;
  launch_date: string;
  pid: string;
  currency: string;
  reporting_product_name: string;
  thumb_image: string;
  PRF: string[];
  title: string;
  description: string;
  display_price: string;
  brand: string;
  sale_price_range: number[];
  price_range: number[];
  display_sale_price: string;
  url: string;
  reporting_crumb: string;
  best_seller: number;
  variants: Variant[];
}

export interface Variant {
  reporting_crumb: string[];
  reporting_product_name: string[];
  sku_swatch_images: string[];
  sku_thumb_images: string[];
}

export interface FacetCounts {
  facet_ranges: FacetRanges;
  facet_fields: FacetFields;
  facet_queries: FacetQueries;
}

export interface FacetRanges {}

export interface FacetFields {
  category: Category[];
  sizes: any[];
  brand: Brand[];
  colors: any[];
  color_groups: any[];
  crumbs_id: CrumbsId[];
  'Size Name': SizeName[];
  catalog_code: CatalogCode[];
  view_id: ViewId[];
  PreorderReAuthDelta: PreorderReAuthDelum[];
  OFFER_TYPE: OfferType[];
  Buyable: Buyable[];
  'Item Category 2': ItemCategory2[];
  'Item Category 1': ItemCategory1[];
  'Item Category 3': ItemCategory3[];
  'Purchase Quantity Limit': PurchaseQuantityLimit[];
  'Is Pre-Order Item': IsPreOrderItem[];
  'Pre-Order Inventory Limit': PreOrderInventoryLimit[];
  NOT_SOLD_SEPARATELY: NotSoldSeparately[];
  'Recommended Age': RecommendedAge[];
  MSRP: Msrp[];
  'Authorized to Sell': AuthorizedToSell[];
  ITEM_TYPE: ItemType[];
  Displayable: Displayable[];
  MINIMUM_ORDER_QUANTITY: MinimumOrderQuantity[];
}

export interface Category {
  count: number;
  crumb: string;
  cat_name: string;
  parent: string;
  cat_id: string;
  tree_path: string;
}

export interface Brand {
  count: number;
  name: string;
}

export interface CrumbsId {
  count: number;
  name: string;
}

export interface SizeName {
  count: number;
  name: string;
}

export interface CatalogCode {
  count: number;
  name: string;
}

export interface ViewId {
  count: number;
  name: string;
}

export interface PreorderReAuthDelum {
  count: number;
  name: string;
}

export interface OfferType {
  count: number;
  name: string;
}

export interface Buyable {
  count: number;
  name: string;
}

export interface ItemCategory2 {
  count: number;
  name: string;
}

export interface ItemCategory1 {
  count: number;
  name: string;
}

export interface ItemCategory3 {
  count: number;
  name: string;
}

export interface PurchaseQuantityLimit {
  count: number;
  name: string;
}

export interface IsPreOrderItem {
  count: number;
  name: string;
}

export interface PreOrderInventoryLimit {
  count: number;
  name: string;
}

export interface NotSoldSeparately {
  count: number;
  name: string;
}

export interface RecommendedAge {
  count: number;
  name: string;
}

export interface Msrp {
  count: number;
  name: string;
}

export interface AuthorizedToSell {
  count: number;
  name: string;
}

export interface ItemType {
  count: number;
  name: string;
}

export interface Displayable {
  count: number;
  name: string;
}

export interface MinimumOrderQuantity {
  count: number;
  name: string;
}

export interface FacetQueries {}

export interface CategoryMap {
  'S0106-0002-0000': string;
  'Extraordinary-Gifts': string;
  'eevee-sweet-choices': string;
  'pokemon-sports': string;
  'outdoors-collection': string;
  starters: string;
  'sword-shield': string;
  'galar-legendary': string;
  'S0102-0000-0000': string;
  'S0103-0001-0002': string;
  'S0102-0005-0002': string;
  'S0102-0005-0003': string;
  'S0102-0005-0000': string;
  'S0102-0005-0001': string;
  'S0103-0001-0001': string;
  'S0102-0005-0005': string;
  'S0101-0001-0002': string;
  'grass-type-collection': string;
  'ghost-type': string;
  'pokemon-go': string;
  'dragon-majesty': string;
  ludicolo: string;
  'S0105-0000-0000': string;
  'detective-pikachu': string;
  'cosmic-eclipse': string;
  'S0108-0001-0000': string;
  'S0108-0001-0001': string;
  'S0108-0001-0002': string;
  'S0108-0001-0003': string;
  'S0108-0001-0004': string;
  'Gifts-Under-25': string;
  'ground-type': string;
  'S0103-0007-0000': string;
  galar: string;
  'S0102-0009-0000': string;
  'S0105-0001-0001': string;
  'S0105-0001-0000': string;
  'S0105-0001-0003': string;
  'S0105-0001-0002': string;
  'S0105-0001-0005': string;
  'S0105-0001-0004': string;
  'S0105-0001-0007': string;
  'S0105-0001-0006': string;
  'highest-rated': string;
  'S0102-0006-0000': string;
  'S0103-0000-0000': string;
  jewelry: string;
  'Squishy Plush': string;
  Figma: string;
  'S0101-0001-0005': string;
  'S0101-0001-0004': string;
  'S0101-0001-0006': string;
  'S0101-0001-0001': string;
  'S0101-0001-0000': string;
  'S0101-0001-0003': string;
  'S0103-0001-0000': string;
  'S0103-0002-0002': string;
  'S0103-0002-0003': string;
  'S0103-0002-0000': string;
  'S0103-0002-0001': string;
  Funko: string;
  johto: string;
  'Ultra Prism': string;
  'S0103-0003-0003': string;
  'S0102-0003-0000': string;
  'S0105-0004-0000': string;
  'steel-type': string;
  kitchen: string;
  'Detective Pikachu TCG': string;
  'psychic-type': string;
  'unbroken-bonds': string;
  valentines: string;
  graduation: string;
  'Detective Pikachu Plush': string;
  'Cuddly Plush': string;
  'rebel-clash': string;
  'darkness-ablaze': string;
  jackets: string;
  'hidden-fates': string;
  Holiday: string;
  'S0101-0003-0000': string;
  'pokemon-sunset': string;
  'pokemon-accents': string;
  'grass-type-first-partners': string;
  'cozy-gifts': string;
  'pokeball-classics': string;
  kanto: string;
  CharizardFury: string;
  'S0108-0002-0001': string;
  'S0108-0002-0000': string;
  'S0108-0002-0003': string;
  'school-essentials': string;
  'S0108-0002-0005': string;
  'S0108-0002-0004': string;
  'vivid-voltage': string;
  hoenn: string;
  'eevee-pixel': string;
  'S0101-0002-0006': string;
  'sliding-pins': string;
  'S0101-0002-0000': string;
  'S0101-0002-0001': string;
  'S0101-0002-0002': string;
  'S0101-0002-0003': string;
  'S0103-0003-0001': string;
  'S0103-0003-0000': string;
  'top-character-gifts': string;
  'S0103-0003-0002': string;
  'Stocking-Stuffers': string;
  Ties: string;
  'S0106-0000-0000': string;
  alola: string;
  'relax-with-eevee': string;
  'Home-Decoration': string;
  'S0101-0005-0009': string;
  'pikachu-classics': string;
  unova: string;
  'S0108-0002-0002': string;
  'S0101-0000-0000': string;
  'S0102-0002-0000': string;
  'S0101-0005-0001': string;
  'S0101-0005-0000': string;
  'S0101-0005-0003': string;
  'S0101-0005-0002': string;
  'S0101-0005-0005': string;
  'S0101-0005-0004': string;
  'S0101-0005-0007': string;
  'S0101-0005-0006': string;
  'S0102-0004-0000': string;
  books: string;
  loungewear: string;
  outdoors: string;
  'S0103-0008-0000': string;
  'S0101-0004-0000': string;
  'Galar Collection': string;
  'S0105-0002-0004': string;
  'celestial-storm': string;
  'champions-path': string;
  'S0105-0002-0000': string;
  'S0105-0002-0001': string;
  'S0105-0002-0002': string;
  'S0105-0002-0003': string;
  kalos: string;
  'team-up': string;
  'dragon-type': string;
  COLLECTIONS: string;
  KantoRegion: string;
  sinnoh: string;
  'bear-walker': string;
  'S0102-0010-0000': string;
  'S0101-0005-0010': string;
  'S0101-0005-0011': string;
  'S0102-0001-0004': string;
  'S0102-0001-0002': string;
  'S0102-0001-0003': string;
  'S0102-0001-0000': string;
  'S0102-0001-0001': string;
  'Shining Legends': string;
  'eevee-cant-wait': string;
  'Forbidden Light': string;
  'S0105-0003-0000': string;
  'Charizard Firestorm': string;
  shirts: string;
  'lost-thunder': string;
  'S0101-0002-0004': string;
  'Halloween-Collection': string;
  'S0101-0002-0005': string;
  'S0102-0008-0000': string;
  'Team Rocket': string;
  'S0102-0011-0000': string;
  'S0108-0000-0000': string;
  'S0106-0001-0000': string;
  activewear: string;
  'Legendary Pins': string;
  'mystery-dungeon-plush': string;
}
