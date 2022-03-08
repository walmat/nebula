import { Task } from '../../constants';
import { CorrelationHeaders } from '../types';

const { States } = Task;

export const submitInformation = ({
  handler,
  bearer,
  userAgent,
  secUAHeader,
  basketId,
  extras,
  json
}: {
  handler: Function;
  bearer: string | null;
  userAgent: string;
  secUAHeader: string;
  basketId: string;
  extras: CorrelationHeaders;
  json: any;
}) => {
  return handler({
    endpoint: `/api/checkout/baskets/${basketId}`,
    options: {
      method: 'PATCH',
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
        referer: `https://www.yeezysupply.com/delivery`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      json
    },
    message: 'Submitting information',
    from: States.SUBMIT_INFORMATION
  });
};
