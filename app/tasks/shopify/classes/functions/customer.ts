import uuid from 'uuidv4';

import { Task } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';
import { userAgent } from '../../../common/utils';

const { States } = Task;

export const getCustomer = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  hash,
  shopId,
  url
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  hash: string;
  shopId: string;
  url: string;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `/${shopId}/checkouts/${hash}`,
    options: {
      followRedirect: true,
      followAllRedirects: true,
      headers: {
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
        'content-type': 'application/x-www-form-urlencoded',
        referer: `${url}/${shopId}/checkouts/${hash}`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    message: 'Visiting checkout',
    from: States.GET_CUSTOMER
  });
};

export const submitCustomer = ({
  handler,
  context,
  current,
  aborter,
  delayer,
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
      json: false,
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
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'document',
        referer: `${url}/${shopId}/checkouts/${hash}?step=contact_information`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      form
    },
    message: 'Submitting information',
    from: States.SUBMIT_CUSTOMER
  });
};

export const submitCustomerApi = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  hash,
  uniqueToken = uuid(),
  visitToken = uuid(),
  accessToken,
  json
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  hash: string;
  uniqueToken?: string;
  visitToken?: string;
  accessToken: string;
  json: any;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `/api/checkouts/${hash}.json`,
    options: {
      method: 'PATCH',
      followRedirect: true,
      followAllRedirects: true,
      headers: {
        authorization: `Basic ${Buffer.from(`${accessToken}::`).toString(
          'base64'
        )}`,
        'content-type': 'application/json',
        'X-Shopify-Checkout-Version': '2021-01-04',
        'X-Shopify-UniqueToken': uniqueToken,
        'X-Shopify-VisitToken': visitToken
      },
      json
    },
    message: 'Preloading checkout',
    from: States.PATCH_CHECKOUT
  });
};
