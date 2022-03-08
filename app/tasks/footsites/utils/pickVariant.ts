/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
import { shuffle } from 'lodash';
import { getRandomIntInclusive } from '../../common/utils';
import { Variant } from '../classes/types/variant';

export const sizeMatcherShoe = (sizes: string[]) => (value: string) => {
  for (const size of sizes) {
    const pattern = `^${size}(?!.)`;

    const re = new RegExp(pattern, 'i');

    const parsed = `${value}`.replace(/^[^0-9]+/g, '');
    if (re.test(parsed)) {
      return true;
    }
  }

  return false;
};

type PickVariant = {
  variants: Variant[];
  sizes: string[];
};

export const pickVariant = ({
  variants = [],
  sizes = []
}: PickVariant): null | Variant => {
  const matches: Variant[] = [];

  const variantGroup = [...variants]
    .map(({ id, sku, size, price, available }) => {
      // remove leading 0 (e.g. - `08.0 => 8.0`)
      let s = size?.replace(/^0+/, '');

      // remove trailing .0 (e.g. - `8.0 => 8`)
      if (s?.endsWith('.0')) {
        s = s.slice(0, -2);
      }

      return {
        id,
        sku,
        price,
        available,
        size: s
      };
    })
    .filter(Boolean);

  // let's just choose a random in stock variant if they just chose random sizing
  // this will at least guarantee they checkout if there is a size available
  if (sizes.length === 1 && sizes.some(size => /random/i.test(size))) {
    const inStockOptions = variantGroup.filter(({ available }) => available);

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

    if (sizeMatcher(variant.size)) {
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

  const inStockOptions = options.filter(({ available }) => available);
  if (!inStockOptions.length) {
    const rand = getRandomIntInclusive(0, matches.length - 1);
    const variant = matches[rand];

    return variant;
  }

  const rand = getRandomIntInclusive(0, inStockOptions.length - 1);
  const variant = inStockOptions[rand];

  return variant;
};
