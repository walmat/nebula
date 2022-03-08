import { Task } from '../../constants';
import { CorrelationHeaders } from '../types';

const { States } = Task;

export const getProductPage = ({
  handler,
  userAgent,
  secUAHeader,
  productId
}: {
  handler: Function;
  userAgent: string;
  secUAHeader: string;
  productId: string;
}) =>
  handler({
    endpoint: `/product/${productId}`,
    options: {
      json: true,
      headers: {
        'sec-ch-ua': secUAHeader,
        'sec-ch-ua-mobile': '?0',
        'upgrade-insecure-requests': '1',
        'user-agent': userAgent,
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        referer: 'https://www.yeezysupply.com/',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        dnt: '1'
      }
    },
    message: 'Visiting product',
    from: States.GET_PRODUCT_PAGE
  });

export const getProductInfo = ({
  handler,
  productId,
  userAgent,
  secUAHeader,
  extras
}: {
  handler: Function;
  productId: string;
  userAgent: string;
  secUAHeader: string;
  extras: CorrelationHeaders;
}) =>
  handler({
    endpoint: `/api/products/${productId}`,
    options: {
      json: true,
      headers: {
        'x-instana-t': extras['x-instana-t'],
        'content-type': 'application/json',
        'x-instana-s': extras['x-instana-s'],
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        'sec-ch-ua': secUAHeader,
        'x-instana-l': extras['x-instana-l'],
        accept: '*/*',
        referer: `https://www.yeezysupply.com/product/${productId}`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    message: 'Visiting variation',
    from: States.GET_PRODUCT_INFO
  });
