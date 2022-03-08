import uuid from 'uuidv4';

import { Task } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';
import { userAgent } from '../../../common/utils';

const { States } = Task;

export const getShipping = ({
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
  polling: boolean;
}) => {
  let endpoint = `/${shopId}/checkouts/${hash}?previous_step=contact_information&step=shipping_method`;
  if (polling) {
    endpoint = `/${shopId}/checkouts/${hash}/shipping_rates?step=shipping_method`;
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
        referer: `${url}/${shopId}/checkouts/${hash}?step=contact_information`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    message: polling ? 'Polling rates' : 'Visiting rates',
    from: States.GET_SHIPPING
  });
};

export const getShippingApi = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  hash,
  accessToken,
  uniqueToken = uuid(),
  visitToken = uuid(),
  polling
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  hash: string;
  accessToken: string;
  uniqueToken?: string;
  visitToken?: string;
  polling: boolean;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `/api/checkouts/${hash}/shipping_rates.json`,
    options: {
      json: true,
      headers: {
        authorization: `Basic ${Buffer.from(`${accessToken}::`).toString(
          'base64'
        )}`,
        'content-type': 'application/json',
        'X-Shopify-Checkout-Version': '2021-01-04',
        'X-Shopify-UniqueToken': uniqueToken,
        'X-Shopify-VisitToken': visitToken
      }
    },
    message: polling ? 'Polling rates' : 'Visiting rates',
    from: States.GET_SHIPPING
  });
};

export const getCartRates = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  zip,
  province,
  country
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  zip: string;
  province: string;
  country: string;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `/cart/shipping_rates.json?shipping_address[zip]=${zip}&shipping_address[country]=${country}&shipping_address[province]=${province}`,
    from: States.GET_SHIPPING,
    message: 'Visiting rates'
  });
};

export const submitShipping = ({
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
  hash: string;
  follow?: boolean;
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
      followRedirect: follow,
      followAllRedirects: follow,
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
        referer: `${url}/${shopId}/checkouts/${hash}?previous_step=contact_information&step=shipping_method`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      form
    },
    message: 'Submitting rates',
    from: States.SUBMIT_SHIPPING
  });
};

export const submitShippingApi = ({
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
      followRedirect: false,
      followAllRedirects: false,
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
    message: 'Submitting rates',
    from: States.SUBMIT_SHIPPING
  });
};
