import uuid from 'uuid';
import { Task } from '../../constants';

const { States } = Task;

export const submitShipping = ({
  handler,
  message,
  storeUrl,
  cartId,
  csrfToken,
  json
}: {
  handler: Function;
  message: string;
  storeUrl: string;
  cartId: string;
  csrfToken: string;
  json: any;
}) => {
  const headers: any = {
    accept: 'application/json',
    'x-csrf-token': csrfToken,
    'x-fl-request-id': uuid(),
    'x-flapi-cart-guid': cartId,
    'content-type': 'application/json',
    origin: storeUrl,
    referer: `${storeUrl}/checkout`,
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9'
  };

  if (/www\.footlocker\.ca/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-CA';
  }

  if (/www\.footlocker\.co\.uk/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-GB';
    headers['accept-language'] = `en-GB,en;q=0.9`;
    headers.referer = `${storeUrl}/en/checkout`;
  }

  return handler({
    endpoint: `/api/users/carts/current/addresses/shipping?timestamp=${Date.now()}`,
    options: {
      method: 'POST',
      headers,
      json
    },
    message,
    from: States.SUBMIT_SHIPPING
  });
};
