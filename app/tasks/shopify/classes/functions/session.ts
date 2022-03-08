import { Task } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';
import { userAgent } from '../../../common/utils';

const { States } = Task;

export const getSession = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  timeout = 15000,
  message = 'Creating session',
  json
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  message?: string;
  timeout?: number;
  json: any;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `https://deposit.us.shopifycs.com/sessions`,
    options: {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        dnt: 1,
        origin: 'https://checkout.shopifycs.com',
        pragma: 'no-cache',
        referer: `https://checkout.shopifycs.com/`,
        'user-agent': userAgent
      },
      json
    },
    timeout,
    includeHeaders: false,
    message,
    from: States.GET_SESSION
  });
};
