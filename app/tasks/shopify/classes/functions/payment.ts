import { Task } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';
import { userAgent } from '../../../common/utils';

const { States } = Task;

export const getPayment = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  hash,
  shopId,
  url,
  polling = false
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  hash: string;
  shopId: string;
  url: string;
  polling?: boolean;
}) => {
  let endpoint = `/${shopId}/checkouts/${hash}?previous_step=shipping_method&step=payment_method`;
  let headers: any = {
    'cache-control': 'max-age=0',
    'upgrade-insecure-requests': '1',
    dnt: '1',
    'user-agent': userAgent,
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-user': '?1',
    'sec-fetch-dest': 'document',
    'sec-ch-ua':
      '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
    'sec-ch-ua-mobile': '?0',
    referer: `${url}/${shopId}/checkouts/${hash}?previous_step=contact_information&step=shipping_method`,
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9'
  };
  if (polling) {
    endpoint = `/${shopId}/checkouts/${hash}?step=payment_method`;
    headers = {
      'sec-ch-ua':
        '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      accept: '*/*',
      dnt: '1',
      'x-requested-with': 'XMLHttpRequest',
      'sec-ch-ua-mobile': '?0',
      'user-agent': userAgent,
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-user': '?1',
      'sec-fetch-dest': 'document',
      referer: `${url}/${shopId}/checkouts/${hash}?previous_step=shipping_method&step=payment_method`,
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9'
    };
  }

  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint,
    options: {
      json: false,
      followRedirect: false,
      followAllRedirects: false,
      headers
    },
    message: polling ? 'Calculating taxes' : 'Visiting payment',
    from: States.GET_PAYMENT
  });
};

export const submitPayment = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  follow = false,
  hash,
  shopId,
  url,
  form
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  follow?: boolean;
  hash: string;
  shopId: string;
  url: string;
  form: any;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `/${shopId}/checkouts/${hash}`,
    options: {
      method: 'POST',
      followAllRedirects: follow,
      followRedirect: follow,
      headers: {
        'cache-control': 'max-age=0',
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        'sec-ch-ua-mobile': '?0',
        origin: url,
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
        referer: `${url}/${shopId}/checkouts/${hash}?previous_step=shipping_method&step=payment_method`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      form
    },
    message: 'Submitting order',
    from: States.SUBMIT_PAYMENT
  });
};
