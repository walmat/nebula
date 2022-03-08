import { ShopifyContext } from './shopify';
import { YeezySupplyContext } from './yeezysupply';
import { FootsiteContext } from './footsite';
import { PokemonContext } from './pokemon';

export type Context =
  | ShopifyContext
  | YeezySupplyContext
  | FootsiteContext
  | PokemonContext;

export { ShopifyContext, YeezySupplyContext, FootsiteContext, PokemonContext };
