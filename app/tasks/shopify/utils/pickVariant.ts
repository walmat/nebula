/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
import { shuffle } from 'lodash';
import { Monitor } from '../../common/constants';
import { getRandomIntInclusive, emitEvent } from '../../common/utils';

const { ParseType } = Monitor;

export default async ({ context }: { context: any }) => {
  const { id, product, task, logger, parseType } = context;

  let variant;
  if (parseType !== ParseType.Variant) {
    variant = await pickSize({
      variants: product.variants,
      sizes: task.sizes,
      logger,
      id
    });
  } else {
    [variant] = product.variants;
  }

  if (!variant) {
    emitEvent(context, [context.id], { message: 'No size matched' });
    return null;
  }

  return variant;
};

export const sizeMatcherShoe = (sizes: string[]) => (value: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const size of sizes) {
    if (
      new RegExp(`^${size.trim()}(?![.])`, 'i').test(
        `${value}`.replace(/^[^0-9]+/g, '')
      )
    ) {
      return true;
    }
  }

  return false;
};

export type ShopifyVariant = {
  id: number;
  title?: string;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  sku?: string;
  requires_shipping?: boolean;
  taxable?: boolean;
  featured_image?: string | null;
  available?: boolean;
  name?: string;
  public_title?: string | null;
  options?: string[] | [];
  price?: number;
  weight?: number;
  compare_at_price?: null | number | string;
  inventory_quantity?: number;
  inventory_management?: string;
  inventory_policy?: string;
  barcode?: null | string;
};

type PickSize = {
  variants: ShopifyVariant[];
  sizes: string[];
  logger: any;
  id: string;
};
export const pickSize = async ({
  variants = [],
  sizes = [],
  logger,
  id
}: PickSize) => {
  const matches: ShopifyVariant[] = [];
  const variantGroup = [...variants];

  // let's just choose a random in stock variant if they just chose random sizing
  // this will at least guarantee they checkout if there is a size available
  if (sizes.length === 1 && sizes.some(size => /random/i.test(size))) {
    const inStockOptions = variantGroup.filter(v => v.available);

    // no variations in stock, let's return a random size..
    if (!inStockOptions.length) {
      const rand = getRandomIntInclusive(0, variantGroup.length - 1);
      const variant = variantGroup[rand];

      return variant;
    }

    // let's return a random option from the instock list
    const rand = getRandomIntInclusive(0, inStockOptions.length - 1);
    const variant = inStockOptions[rand];

    return variant;
  }

  for (const variant of variantGroup) {
    // Determine if we are checking for shoe sizes or not
    let sizeMatcher;
    if (sizes.some(size => /[0-9]+/.test(size))) {
      // We are matching a shoe size
      sizeMatcher = sizeMatcherShoe(sizes);
    } else {
      // We are matching a garment size
      sizeMatcher = (s: string) =>
        sizes.some(
          size =>
            !/[0-9]+/.test(s) && new RegExp(`^${size}`, 'i').test(`${s}`.trim())
        );
    }

    if (sizeMatcher(variant.title || '')) {
      logger.log({
        id,
        level: 'debug',
        message: `Matched variant: ${variant.title}`
      });
      matches.push(variant);
    }
  }

  // if we can't match a size at all and we don't want random, return null
  if (!matches.length && !sizes.some(size => /random/i.test(size))) {
    return null;
  }

  // if we only matched one variant, just use that no matter what
  if (matches.length === 1) {
    return matches[0];
  }

  // otherwise, let's do some 'pseudo-random' shuffling
  const options = shuffle([...matches]);

  const inStockOptions = options.filter(v => v.available);
  if (!inStockOptions.length) {
    const rand = getRandomIntInclusive(0, matches.length - 1);
    const variant = matches[rand];

    return variant;
  }

  const rand = getRandomIntInclusive(0, inStockOptions.length - 1);
  const variant = inStockOptions[rand];

  return variant;
};
