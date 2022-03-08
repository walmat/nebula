import { Task } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';
import { userAgent } from '../../../common/utils';

const { States } = Task;

export const initialize = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  storeUrl,
  productUrl,
  follow = false,
  form
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  storeUrl: string;
  productUrl: string;
  follow?: boolean;
  form: string;
}) => {
  let params = form;
  if (!params) {
    params = 'updates%5B%5D=1&attributes%5Bcheckout_clicked%5D=true&checkout=';
  }

  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: '/cart',
    options: {
      method: 'POST',
      followRedirect: follow,
      followAllRedirects: follow,
      headers: {
        'cache-control': 'max-age=0',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        'sec-ch-ua-mobile': '?0',
        origin: storeUrl,
        'upgrade-insecure-requests': '1',
        dnt: '1',
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': userAgent,
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'document',
        referer: productUrl,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      form: params
    },
    message: 'Initializing checkout',
    from: States.INIT_CHECKOUT
  });
};

export const getTotalPrice = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  accessToken,
  hash
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  accessToken: string;
  hash: string;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `/api/checkouts/${hash}.json`,
    options: {
      method: 'GET',
      followRedirect: false,
      followAllRedirects: false,
      json: true,
      headers: {
        'X-Shopify-Storefront-Access-Token': accessToken,
        'X-Shopify-Checkout-Version': '2016-09-06',
        'accept-encoding': 'gzip, deflate',
        accept: 'application/json',
        connection: 'close'
      }
    },
    includeHeaders: false,
    message: 'Calculating taxes',
    from: States.GET_PRICE
  });
};
