import { Task as TaskConstants } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';
import { userAgent } from '../../../common/utils';

const { States } = TaskConstants;

export const getAccount = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  storeUrl
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  storeUrl: string;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: '/account/login',
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
        referer: `${storeUrl}/`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    includeHeaders: false,
    message: 'Visiting account',
    from: States.GET_ACCOUNT
  });
};

export const submitAccount = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  storeUrl
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  storeUrl: string;
}) => {
  const { captchaToken } = context;
  const { username, password } = context.task.account;

  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: '/account/login',
    options: {
      method: 'POST',
      followRedirect: false,
      followAllRedirects: false,
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
        referer: `${storeUrl}/account/login?return_url=%2Faccount`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      form: {
        form_type: 'customer_login',
        utf8: '✓',
        'customer[email]': username,
        'customer[password]': password,
        'recaptcha-v3-token': captchaToken
      }
    },
    includeHeaders: false,
    message: 'Logging in',
    from: States.SUBMIT_ACCOUNT
  });
};
