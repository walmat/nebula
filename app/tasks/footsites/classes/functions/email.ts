import uuid from 'uuid';
import { Task } from '../../constants';

const { States } = Task;

export const verifyEmail = ({
  handler,
  message,
  storeUrl,
  cartId,
  csrfToken,
  email
}: {
  handler: Function;
  message: string;
  storeUrl: string;
  cartId: string;
  csrfToken: string;
  email: string;
}) => {
  const headers: any = {
    accept: 'application/json',
    'x-csrf-token': csrfToken,
    'x-fl-request-id': uuid(),
    'x-flapi-cart-guid': cartId,
    'content-type': 'application/json',
    origin: storeUrl,
    referer: `${storeUrl}/cart`,
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9'
  };

  if (/www\.footlocker\.ca/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-CA';
  }

  if (/www\.footlocker\.co\.uk/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-GB';
    headers['accept-language'] = `en-GB,en;q=0.9`;
    headers.referer = `${storeUrl}/en/cart`;
  }

  return handler({
    endpoint: `/api/users/carts/current/email/${email}?timestamp=${Date.now()}`,
    options: {
      method: 'PUT',
      headers
    },
    message,
    from: States.VERIFY_EMAIL
  });
};
