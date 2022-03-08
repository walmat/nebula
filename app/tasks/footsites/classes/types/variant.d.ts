import { Price } from './stock';

export interface Variant {
  id: number;
  sku: string;
  size: string;
  price: Price;
  available: boolean;
}
