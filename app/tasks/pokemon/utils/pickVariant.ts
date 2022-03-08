/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
import { shuffle } from 'lodash';
import { getRandomIntInclusive } from '../../common/utils';
import { element } from '../types/product';

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
  variants: element[];
  sizes: string[];
  logger: any;
  id: string;
};

export type PokemonVariant = {
  id: string;
  uri: string;
  price: string;
  size: string;
  available: boolean;
};

export const pickVariant = ({
  variants = [],
  sizes = [],
  logger,
  id
}: PickVariant) => {
  const matches: PokemonVariant[] = [];

  const variantGroup: PokemonVariant[] = [...variants]
    .map(({ _addtocartform, _availability, _price, _code, _definition }) => {
      let id = '-';
      let uri = '-';
      let price = 'N/A';
      let size = 'N/A';
      let available = false;
      try {
        id = _code[0].code;
        ({ uri } = _addtocartform[0].self);
        price =
          _price[0]['purchase-price'][0].display ||
          `${_price[0]['purchase-price'][0].amount}`;
        size = _definition[0]._options[0]._element[0]._value[0]['display-name'];
        available = _availability[0].state === 'AVAILABLE';
      } catch (e) {
        // noop..
      }

      return {
        id,
        uri,
        price,
        size,
        available
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
        sizes.some(size => new RegExp(`^${size}`, 'i').test(`${s}`.trim()));
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
