import uuid from 'uuid';

import { Task } from '../../constants';
import { getSiteIdentifier } from '../../utils';

const { States } = Task;

export const getOldStock = ({
  handler,
  message,
  storeUrl,
  productId
}: {
  handler: Function;
  message: string;
  storeUrl: string;
  productId: string;
}) => {
  const headers: any = {
    accept: `application/json`,
    'x-fl-request-id': uuid(),
    referer: `${storeUrl}/product/${productId}`,
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9'
  };

  if (/www\.footlocker\.ca/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-CA';
  }

  if (/www\.footlocker\.co\.uk/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-GB';
    headers['accept-language'] = `en-GB,en;q=0.9`;
    headers.referer = `${storeUrl}/en/product/~/${productId}`;
  }

  const endpoint = `/api/products/pdp/${productId}?timestamp=${Date.now()}`;

  return handler({
    endpoint,
    options: {
      json: true,
      headers
    },
    message,
    from: States.GET_STOCK
  });
};

export const getStock = ({
  handler,
  message,
  storeUrl,
  productId
}: {
  handler: Function;
  message: string;
  storeUrl: string;
  productId: string;
}) => {
  const headers: any = {
    accept: `application/json`,
    'x-fl-request-id': uuid(),
    referer: `${storeUrl}/product/${productId}`,
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9'
  };

  if (/www\.footlocker\.ca/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-CA';
  }

  if (/www\.footlocker\.co\.uk/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-GB';
    headers['accept-language'] = `en-GB,en;q=0.9`;
    headers.referer = `${storeUrl}/en/product/~/${productId}`;
  }

  const endpoint = `/zgw/product-core/v1/pdp/${getSiteIdentifier(
    storeUrl
  )}/sku/${productId}`;

  return handler({
    endpoint,
    options: {
      json: true,
      headers
    },
    message,
    from: States.GET_STOCK
  });
};
