import { Task } from '../../constants';

const { States } = Task;

export const getBloom = ({
  handler,
  secUAHeader,
  userAgent,
  extras
}: {
  handler: Function;
  secUAHeader: string;
  userAgent: string;
  extras: any;
}) =>
  handler({
    endpoint: `/api/yeezysupply/products/bloom`,
    options: {
      json: true,
      headers: {
        dnt: '1',
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        'x-instana-t': extras['x-instana-t'],
        'x-instana-l': extras['x-instana-l'],
        'x-instana-s': extras['x-instana-s'],
        'content-type': 'application/json',
        'sec-ch-ua': secUAHeader,
        accept: '*/*',
        referer: `https://www.yeezysupply.com/`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    message: 'Visiting bloom',
    from: States.GET_BLOOM
  });
