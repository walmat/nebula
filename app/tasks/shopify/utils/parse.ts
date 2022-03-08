import { sortBy, map, find, flatten, filter, every, some } from 'lodash';
import { parseString } from 'xml2js';
import { load } from 'cheerio';

import { Property } from './forms';

import { Monitor } from '../../common/constants';

const { ParseType } = Monitor;

/**
 * Determine the type of parsing we need to
 * perform based the contents of the given
 * Task Product.
 *
 * @param {TaskProduct} product
 */
export function getParseType(product: any) {
  if (!product) {
    return ParseType.Unknown;
  }

  if (product.variant) {
    return ParseType.Variant;
  }

  if (product.url) {
    return ParseType.Url;
  }

  if (product.pos && product.neg) {
    return ParseType.Keywords;
  }

  return ParseType.Unknown;
}

/**
 * Filter a list using a sorter and limit
 *
 * Using a given sorter, sort the list and then limit
 * the array by the given limit. The sorter can be a
 * String that is the key to use on each object (e.g. length),
 * or a function that takes an object from the list and
 * returns a value to use when sorting. No sorting will take
 * place if no sorter is given.
 *
 * Limiting can be done in "ascending" or "descending" mode
 * based on the sign of the limit. When using a positive number,
 * the first N values will be chosen ("ascending"). When using
 * a negative number, the last N values will be chosen ("descending").
 * No limiting will take place if 0 or no limit is given.
 *
 * @param {List} list the list to filter
 * @param {Sorter} sorter the method of sorting
 * @param {num} limit the limit to use
 */
export const filterAndLimit = (
  list: any[],
  sorter: any,
  limit: any,
  logger: any,
  id: string
) => {
  if (!list) {
    logger.log({
      id,
      level: 'silly',
      message: 'No list given! returning empty list'
    });
    return [];
  }

  logger.log({
    id,
    level: 'silly',
    message: `List Detected with ${list.length} elements. Proceeding to sorting now...`
  });

  let sorted = list;
  if (sorter) {
    logger.log({
      id,
      level: 'silly',
      message: 'Sorter detected, sorting...'
    });

    sorted = sortBy(list, sorter);
  }

  const _limit = limit || 0;
  if (_limit === 0) {
    logger.log({
      id,
      level: 'silly',
      message: 'No limit given! returning...'
    });

    return sorted;
  }
  if (_limit > 0) {
    logger.log({
      id,
      level: 'silly',
      message: 'Ascending limit detected, limiting...'
    });

    return sorted.slice(_limit);
  }

  logger.log({
    id,
    level: 'silly',
    message: 'Descending limit detected, limiting...'
  });

  // slice, then reverse elements to get the proper order
  return sorted.slice(0, _limit).reverse();
};

/**
 * Match a variant id to a product
 *
 * Take the given list of products and find the product
 * that contains the given varient id. If no product is
 * found, this method returns `null`.
 *
 * NOTE:
 * This method assumes the following:
 * - The products list contains objects that have a "variants" list of
 *   variants associated with the product
 * - The variant objects contain an id for the variant and a "product_id" key
 *   that maps it back to the associated product
 *
 * @param {List} products list of products to search
 * @param {String} variantId the variant id to match
 */
export const matchVariant = (
  products: any,
  variantId: string,
  logger: any,
  id: string
) => {
  logger.log({
    id,
    level: 'silly',
    message: `Starting variant matching for variant: ${variantId}`
  });

  if (!products) {
    logger.log({
      id,
      level: 'silly',
      message: 'No product list given! Returning null'
    });

    return null;
  }
  if (!variantId) {
    logger.log({
      id,
      level: 'silly',
      message: 'No variant id given! Returning null'
    });

    return null;
  }
  // Sometimes the objects in the variants list don't include a product_id hook back to the associated product.
  // In order to counteract this, we first add this hook in (if it doesn't exist)
  const transformedProducts = products.map(
    ({
      id,
      variants,
      ...otherProductData
    }: {
      id: string;
      variants: any[];
    }) => {
      const transformedVariants = variants.map(
        ({ product_id: productId, ...otherVariantData }) => ({
          ...otherVariantData,
          product_id: productId || id
        })
      );
      return {
        ...otherProductData,
        id,
        variants: transformedVariants
      };
    }
  );

  // Step 1: Map products list to a list of variant lists
  // Step 2: flatten the list of lists, so we only have one total list of all variants
  // Step 3: Search for the variant in the resulting variant list
  const matchedVariant = find(
    flatten(map(transformedProducts, p => p.variants)),
    v => v.id.toString() === variantId
  );
  if (matchedVariant) {
    logger.log({
      id,
      level: 'silly',
      message: `Searched ${transformedProducts.length} products. Found variant: ${variantId}`
    });

    return find(transformedProducts, p => p.id === matchedVariant.product_id);
  }

  logger.log({
    id,
    level: 'silly',
    message: `Searched ${products.length} products. Variant ${variantId} was not found. Returning null...`
  });

  return null;
};

/**
 * Match a set of keywords to a product
 *
 * Given a list of products, use a set of keywords to find a
 * single product that matches the following criteria:
 * - the product's title/handle contains ALL of the positive keywords (`keywords.pos`)
 * - the product's title/handle DOES NOT contain ANY of the negative keywords (`keywords.neg`)
 *
 * If no product is found, `null` is returned. If multiple products are found,
 * the products are filtered using the given `filter.sorter` and `filter.limit`.
 * and the first product is returned.
 *
 * If no filter is given, this method returns the most recent product.
 *
 * See `filterAndLimit` for more details on `sorter` and `limit`.
 *
 * @param {List} products list of products to search
 * @param {Object} keywords an object containing two arrays of strings (`pos` and `neg`)
 * @see filterAndLimit
 */
export const matchKeywords = ({
  products,
  keywords,
  minPrice,
  maxPrice,
  _filter = null,
  logger,
  id,
  returnAll = false
}: {
  products: any[];
  keywords: any;
  minPrice: any;
  maxPrice: any;
  _filter: any;
  logger: any;
  id: string;
  returnAll: boolean;
}) => {
  logger.log({
    id,
    level: 'silly',
    message: 'Starting keyword matching...'
  });

  if (!products) {
    logger.log({
      id,
      level: 'silly',
      message: 'No product list given! Returning null'
    });

    return null;
  }
  if (!keywords) {
    logger.log({
      id,
      level: 'silly',
      message: 'No keywords object given! Returning null'
    });

    return null;
  }

  if (!keywords.pos || !keywords.neg) {
    logger.log({
      id,
      level: 'silly',
      message: 'Malformed keywords object! Returning null'
    });

    return null;
  }

  const matches = filter(products, product => {
    const title = product.title.toUpperCase();
    const handle = (product.handle || '').toUpperCase();
    // defaults
    let pos = true;
    let neg = false;

    // match every keyword in the positive array
    if (keywords.pos.length > 0) {
      pos = every(
        keywords.pos.map((k: any) => k.toUpperCase()),
        keyword => {
          if (title) {
            // monkey patch in DSM trickery..
            if (title.replace(/[.]/g, '').indexOf(keyword.toUpperCase()) > -1) {
              return true;
            }
          }

          if (handle) {
            if (
              handle.replace(/[.]/g, '').indexOf(keyword.toUpperCase()) > -1
            ) {
              return true;
            }
          }

          return (
            title.indexOf(keyword.toUpperCase()) > -1 ||
            handle.indexOf(keyword.toUpperCase()) > -1
          );
        }
      );
    }

    // match none of the keywords in the negative array
    if (keywords.neg.length > 0) {
      neg = some(
        keywords.neg.map((k: any) => k.toUpperCase()),
        keyword => {
          if (title) {
            return title.indexOf(keyword.toUpperCase()) > -1;
          }

          if (handle) {
            return handle.indexOf(keyword.toUpperCase()) > -1;
          }

          return false;
        }
      );
    }
    return pos && !neg;
  });

  if (!matches.length) {
    logger.log({
      id,
      level: 'silly',
      message: `Searched ${products.length} products. No matches found! Returning null`
    });

    return null;
  }

  let leftovers = matches;
  // filter out price bounds...
  if (minPrice) {
    leftovers = leftovers.filter(({ variants }) => {
      const [{ price }] = variants;
      if (Number(price) < minPrice) {
        return false;
      }
      return true;
    });
  }

  logger.log({
    id,
    level: 'silly',
    message: `Products after filtering minPrice: ${leftovers.length}`
  });

  if (!leftovers.length) {
    logger.log({
      id,
      level: 'silly',
      message: `Searched ${products.length} products. No matches found! Returning null`
    });

    return null;
  }

  if (maxPrice) {
    leftovers = leftovers.filter(({ variants }) => {
      const [{ price }] = variants;
      if (Number(price) > maxPrice) {
        return false;
      }
      return true;
    });
  }

  logger.log({
    id,
    level: 'silly',
    message: `Products after filtering maxPrice: ${leftovers.length}`
  });

  if (!leftovers.length) {
    logger.log({
      id,
      level: 'silly',
      message: `Searched ${products.length} products. No matches found! Returning null`
    });

    return null;
  }

  if (leftovers.length > 1) {
    let filtered;
    logger.log({
      id,
      level: 'silly',
      message: `Searched ${products.length} products. ${leftovers.length} products found.`
    });

    if (_filter && _filter.sorter && _filter.limit) {
      logger.log({
        id,
        level: 'silly',
        message: 'Using given filtering heuristic on the products...'
      });

      let { limit } = _filter;
      if (returnAll) {
        logger.log({
          id,
          level: 'silly',
          message: `Overriding filter's limit and returning all products...`
        });

        limit = 0;
      }
      filtered = filterAndLimit(leftovers, _filter.sorter, limit, logger, id);
      if (!returnAll) {
        logger.log({
          id,
          level: 'silly',
          message: `Returning Matched Product: ${filtered[0].title}`
        });

        return filtered[0];
      }

      logger.log({
        id,
        level: 'silly',
        message: `Returning ${filtered.length} matched products`
      });

      return filtered;
    }

    logger.log({
      id,
      level: 'silly',
      message: `No Filter or Invalid Filter Heuristic given! Defaulting to most recent...`
    });

    if (returnAll) {
      logger.log({
        id,
        level: 'silly',
        message: 'Returning all products...'
      });

      filtered = filterAndLimit(leftovers, 'updated_at', 0, logger, id);

      logger.log({
        id,
        level: 'silly',
        message: `Returning ${filtered.length} matched products`
      });

      return filtered;
    }
    filtered = filterAndLimit(leftovers, 'updated_at', -1, logger, id);

    logger.log({
      id,
      level: 'silly',
      message: `Returning matched product: ${filtered[0].title}`
    });
    return filtered[0];
  }

  logger.log({
    id,
    level: 'silly',
    message: `Searched ${products.length} products. Matching product: ${leftovers[0].title}`
  });

  return returnAll ? leftovers : leftovers[0];
};

export const getProperties = (body: string, url: string) => {
  const $ = load(body, { xmlMode: false, normalizeWhitespace: true });

  let hash = '';
  if (/eflash-us/i.test(url)) {
    const regex = /\$\(\s*atob\(\s*'PGlucHV0IHR5cGU9ImhpZGRlbiIgbmFtZT0icHJvcGVydGllc1tfSEFTSF0iIC8\+'\s*\)\s*\)\s*\.val\(\s*'(.+)'\s*\)/;
    const elements = regex.exec(body);

    if (elements) {
      [, hash] = elements;
    }
  }

  // for DSM UK the hash hasn't changed, so let's just hardcode it
  if (/eflash(?!-)/i.test(url)) {
    hash = 'ee3e8f7a9322eaa382e04f8539a7474c11555';
  }

  const form = $(
    'form[action*="/cart/add"] input, select, textarea, button'
  ).attr('required', 'true');

  let needsAnswer = false;
  const properties: Property[] = [];
  if (form) {
    $(form).each((_: any, el: any) => {
      const name = $(el).attr('name') || '';
      const value = $(el).attr('value') || '';

      if (/properties/i.test(name)) {
        const match = /properties\[(.*)\]/i.exec(name);
        if (!match) {
          return;
        }

        const [, property] = match;
        if (!property.startsWith('_') && !value) {
          if (
            /shipping_method|store_pickup/i.test(property) &&
            /dtlr/i.test(url)
          ) {
            properties.push({
              name,
              value: 'me',
              question: false
            });

            return;
          }

          needsAnswer = true;
          properties.push({
            name,
            value,
            question: true
          });
          return;
        }

        properties.push({
          name,
          value,
          question: false
        });
      }
    });
  }

  if (/eflash-us/i.test(url)) {
    properties.push({
      name: 'properties[_HASH]',
      value: hash,
      question: false
    });
  }

  if (/eflash(?!-)/i.test(url)) {
    properties.push({
      name: 'properties[_hash]',
      value: hash,
      question: false
    });
  }

  return { needsAnswer, properties };
};

/**
 * Convert an XML String to JSON
 *
 * This method proxies the xml2js parseString method,
 * but converts it to a promisified form.
 *
 * @param {String} xml
 */
export const convertToJson = (xml: any) =>
  new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });

export const match = (context: any, products: any) => {
  const { id, parseType, logger, task } = context;

  logger.log({
    id,
    level: 'silly',
    message: `Starting match for parse type: ${parseType}`
  });

  switch (parseType) {
    case ParseType.Variant: {
      const product = matchVariant(products, task.product.variant, logger, id);
      if (!product) {
        logger.log({
          id,
          level: 'error',
          message: 'Unable to find matching product!'
        });

        return null;
      }
      return product;
    }
    case ParseType.Keywords: {
      const keywords = {
        pos: task.product.pos,
        neg: task.product.neg
      };

      const { minPrice, maxPrice } = task;

      const product = matchKeywords({
        products,
        keywords,
        minPrice,
        maxPrice,
        _filter: null,
        logger,
        id,
        returnAll: false
      });

      if (!product) {
        logger.log({
          id,
          level: 'error',
          message: 'Unable to find matching product!'
        });

        return null;
      }
      return product;
    }
    default: {
      logger.log({
        id,
        level: 'error',
        message: `Invalid parsing type: ${parseType}`
      });

      return null;
    }
  }
};
