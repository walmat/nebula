import { Task } from '../../constants';
import { CorrelationHeaders } from '../types';

const { States } = Task;

export const getAvailability = ({
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
    endpoint: `/api/products/${productId}/availability`,
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
    message: 'Retrieving stock',
    from: States.GET_AVAILABILITY
  });
