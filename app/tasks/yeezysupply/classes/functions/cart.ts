import { Task } from '../../constants';
import { CorrelationHeaders } from '../types';

const { States } = Task;

export const addToCart = ({
  handler,
  productId,
  userAgent,
  secUAHeader,
  bearer,
  extras,
  json
}: {
  handler: Function;
  productId: string;
  userAgent: string;
  secUAHeader: string;
  bearer: string | null;
  extras: CorrelationHeaders;
  json: any;
}) => {
  return handler({
    endpoint: '/api/checkout/baskets/-/items',
    options: {
      method: 'POST',
      headers: {
        'x-instana-t': extras['x-instana-t'],
        dnt: '1',
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        'x-instana-l': extras['x-instana-l'],
        'x-instana-s': extras['x-instana-s'],
        'content-type': 'application/json',
        'checkout-authorization': bearer || 'null',
        'sec-ch-ua': secUAHeader,
        accept: '*/*',
        origin: 'https://www.yeezysupply.com',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer: `https://www.yeezysupply.com/product/${productId}`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      json
    },
    message: 'Adding to cart',
    from: States.ADD_TO_CART
  });
};

export const getCart = ({
  handler,
  bearer,
  userAgent,
  secUAHeader,
  productId,
  extras
}: {
  handler: Function;
  bearer: string | null;
  userAgent: string;
  secUAHeader: string;
  productId: string;
  extras: any;
}) =>
  handler({
    endpoint: `/api/checkout/customer/baskets`,
    options: {
      json: true,
      headers: {
        'x-instana-t': extras['x-instana-t'],
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        'x-instana-l': extras['x-instana-l'],
        'x-instana-s': extras['x-instana-s'],
        'content-type': 'application/json',
        'checkout-authorization': bearer || 'null',
        'sec-ch-ua': secUAHeader,
        accept: '*/*',
        referer: `https://www.yeezysupply.com/product/${productId}`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    message: 'Visiting basket',
    from: States.GET_BASKET
  });
