/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
import { shuffle } from 'lodash';
import { getRandomIntInclusive } from '../../common/utils';

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

export type YeezySupplyVariant = {
  sku: string;
  availability: number | string;
  availability_status: string;
  size: string;
};

type PickVariant = {
  variants: YeezySupplyVariant[];
  sizes: string[];
  logger: any;
  id: string;
};

export const pickVariant = ({
  variants = [],
  sizes = [],
  logger,
  id
}: PickVariant) => {
  const matches: YeezySupplyVariant[] = [];
  const variantGroup = [...variants];

  // let's just choose a random in stock variant if they just chose random sizing
  // this will at least guarantee they checkout if there is a size available
  if (sizes.length === 1 && sizes.some(size => /random/i.test(size))) {
    const inStockOptions = variantGroup.filter(v => Number(v.availability) > 0);

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
      logger.log({
        id,
        level: 'debug',
        message: `Matched variant: ${variant.size}`
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

  const inStockOptions = options.filter(v => Number(v.availability) > 0);
  if (!inStockOptions.length) {
    const rand = getRandomIntInclusive(0, matches.length - 1);
    const variant = matches[rand];

    return variant;
  }

  const rand = getRandomIntInclusive(0, inStockOptions.length - 1);
  const variant = inStockOptions[rand];

  return variant;
};
