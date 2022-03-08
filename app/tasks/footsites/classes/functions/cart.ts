import uuid from 'uuid';

import { Task } from '../../constants';

const { States } = Task;

export const addToCart = ({
  handler,
  purge,
  message,
  storeUrl,
  csrfToken,
  productId,
  json
}: {
  handler: Function;
  purge: boolean;
  message: string;
  storeUrl: string;
  csrfToken: string;
  productId: number;
  json: any;
}) => {
  const headers: any = {
    accept: 'application/json',
    'x-csrf-token': csrfToken,
    'x-fl-productid': productId,
    'x-fl-request-id': uuid(),
    'content-type': 'application/json',
    origin: storeUrl,
    referer: `${storeUrl}/product/~/${productId}.html`,
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': `en-US,en;q=0.9`
  };

  if (/www\.footlocker\.ca/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-CA';
  }

  if (/www\.footlocker\.co\.uk/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-GB';
    headers['accept-language'] = `en-GB,en;q=0.9`;
    headers.referer = `${storeUrl}/en/product/~/${productId}.html`;
  }

  const endpoint = `/api/users/carts/current/entries?timestamp=${Date.now()}`;

  return handler({
    endpoint,
    options: {
      method: 'POST',
      headers,
      json
    },
    purge,
    message,
    from: States.ADD_TO_CART
  });
};
