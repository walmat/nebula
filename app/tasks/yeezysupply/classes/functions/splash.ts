import { Task } from '../../constants';

const { States } = Task;

export const getSplash = ({
  handler,
  productId,
  userAgent,
  secUAHeader,
  splashUrl
}: {
  handler: Function;
  productId: string;
  userAgent: string;
  secUAHeader: string;
  splashUrl: string;
}) =>
  handler({
    endpoint: splashUrl,
    options: {
      json: true,
      headers: {
        'sec-ch-ua': secUAHeader,
        accept: 'application/json, text/plain, */*',
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        referer: `https://www.yeezysupply.com/product/${productId}`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    message: 'Waiting in splash',
    from: States.WAIT_IN_SPLASH
  });
