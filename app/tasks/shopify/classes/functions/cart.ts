import { Task as TaskConstants } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';
import { userAgent } from '../../../common/utils';

const { States } = TaskConstants;

export const getCart = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  endpoint = '/cart',
  message = 'Visiting cart',
  options = {}
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  endpoint?: string;
  message?: string;
  options?: any;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint,
    options: {
      followRedirect: false,
      followAllRedirects: false,
      ...options
    },
    message,
    from: States.GET_CART
  });
};

export const submitCart = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  storeUrl,
  productUrl,
  form
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  storeUrl: string;
  productUrl: string;
  form: any;
}) => {
  let json = true;
  let endpoint = `/cart/add.js`;
  if (/mattel/i.test(storeUrl)) {
    json = false;
    endpoint = `/cart/add`;
  }

  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint,
    options: {
      method: 'POST',
      json,
      followRedirect: false,
      followAllRedirects: false,
      headers: {
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        accept: 'application/json, text/javascript, */*; q=0.01',
        dnt: '1',
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        origin: storeUrl,
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer: productUrl,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      form
    },
    includeHeaders: false,
    message: 'Adding to cart',
    from: States.SUBMIT_CART
  });
};

export const clearCart = ({
  handler,
  context,
  current,
  aborter,
  delayer
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: '/cart/clear.js',
    options: {
      method: 'POST',
      followRedirect: false,
      followAllRedirects: false,
      form: JSON.stringify({})
    },
    message: 'Clearing cart',
    from: States.CLEAR_CART
  });
};
