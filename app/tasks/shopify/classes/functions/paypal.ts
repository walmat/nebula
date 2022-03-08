import { Task } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';
import { userAgent } from '../../../common/utils';

const { States } = Task;

export const createGuest = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  expressCheckoutToken,
  json
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  expressCheckoutToken: string;
  json: any;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `https://www.paypal.com/graphql?OnboardGuestMutation`,
    options: {
      method: 'POST',
      followRedirect: false,
      followAllRedirects: false,
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        dnt: 1,
        'paypal-client-metadata-id': expressCheckoutToken,
        'paypal-client-context': expressCheckoutToken,
        referer: `https://www.paypal.com/checkoutweb/signup?version=4.0.173&locale.x=en_US&fundingSource=paypal&sessionID=&buttonSessionID=&env=production&logLevel=warn&uid=044671dc1d&token=${expressCheckoutToken}&xcomponent=1&country.x=US&locale.x=en_US&country.x=US`,
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'user-agent': userAgent,
        'x-app-name': 'checkoutuinodeweb_onboarding_lite',
        'x-country': 'US',
        'x-locale': 'en_US'
      },
      json
    },
    includeHeaders: false,
    message: 'Creating guest',
    from: States.CREATE_GUEST
  });
};

export const approveGuest = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  expressCheckoutToken,
  accessToken,
  json
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  expressCheckoutToken: string;
  accessToken: string;
  json: any;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `https://www.paypal.com/graphql?ApproveOnboardPaymentMutation`,
    options: {
      method: 'POST',
      followRedirect: false,
      followAllRedirects: false,
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        dnt: 1,
        'paypal-client-metadata-id': expressCheckoutToken,
        'paypal-client-context': expressCheckoutToken,
        referer: `https://www.paypal.com/checkoutweb/signup?version=4.0.173&locale.x=en_US&fundingSource=paypal&sessionID=&buttonSessionID=&env=production&logLevel=warn&uid=044671dc1d&token=${expressCheckoutToken}&xcomponent=1&country.x=US&locale.x=en_US&country.x=US`,
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'user-agent': userAgent,
        'x-app-name': 'checkoutuinodeweb_onboarding_lite',
        'x-country': 'US',
        'x-locale': 'en_US',
        'x-paypal-internal-euat': accessToken
      },
      json
    },
    includeHeaders: false,
    message: 'Approving guest',
    from: States.APPROVE_GUEST
  });
};

export const getCallbackUrl = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  storeUrl,
  returnUrl
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  storeUrl: string;
  returnUrl: string;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: returnUrl,
    options: {
      method: 'GET',
      followRedirect: false,
      followAllRedirects: false,
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        dnt: '1',
        pragma: 'no-cache',
        referer: storeUrl,
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'upgrade-insecure-requests': '1',
        'user-agent': userAgent
      }
    },
    includeHeaders: false,
    message: 'Approving guest',
    from: States.APPROVE_GUEST
  });
};
