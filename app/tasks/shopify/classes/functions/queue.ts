import { Task as TaskConstants } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';
import { userAgent } from '../../../common/utils';

const { States } = TaskConstants;

export const enterQueue = async ({
  handler,
  context,
  current,
  aborter,
  delayer,
  ctd,
  url,
  from
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  ctd: string;
  url: string;
  from: string;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: ctd
      ? `/throttle/queue?_ctd=${encodeURIComponent(ctd)}&_ctd_update=`
      : '/throttle/queue',
    options: {
      followRedirect: false,
      followAllRedirects: false,
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        referer: url
      }
    },
    message: 'Entering queue',
    from
  });
};

export const waitInQueue = async ({
  handler,
  context,
  current,
  aborter,
  delayer,
  url,
  ctd
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  url: string;
  ctd: string;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: '/checkout/poll?js_poll=1',
    options: {
      followRedirect: false,
      followAllRedirects: false,
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9,fr;q=0.8,de;q=0.7',
        referer: `${url}/throttle/queue?_ctd=${encodeURIComponent(
          ctd
        )}&_ctd_update`
      }
    },
    message: 'Waiting in queue',
    from: States.GET_QUEUE
  });
};

export const passedQueue = async ({
  handler,
  context,
  current,
  aborter,
  delayer,
  ctd
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  ctd: string;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `/throttle/queue?_ctd=${encodeURIComponent(ctd)}&_ctd_update`,
    options: {
      json: false,
      followRedirect: false,
      followAllRedirects: false
    },
    from: States.GET_QUEUE
  });
};

export const waitInNextQueue = async ({
  handler,
  context,
  current,
  aborter,
  delayer,
  storeUrl,
  eta,
  available,
  token
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  storeUrl: string;
  eta: string;
  available: string;
  token: string;
}) => {
  let message = 'Waiting in queue';

  if (eta) {
    message = `Waiting in queue [${eta}s]`;
  }

  if (available !== '') {
    message = `Waiting in queue [${available}]`;
  }

  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `/queue/poll`,
    options: {
      method: 'POST',
      followRedirect: false,
      followAllRedirects: false,
      headers: {
        'sec-ch-ua':
          '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        dnt: '1',
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        'content-type': 'application/json',
        accept: '*/*',
        origin: storeUrl,
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer: `${storeUrl}/throttle/queue`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      json: {
        query:
          '\n      {\n        poll(token: $token) {\n          token\n          pollAfter\n          queueEtaSeconds\n          productVariantAvailability {\n            id\n            available\n          }\n        }\n      }\n    ',
        variables: {
          token
        }
      }
    },
    message,
    from: States.GET_NEXT_QUEUE
  });
};
