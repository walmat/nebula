import { Task as TaskConstants } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';

const { States } = TaskConstants;

export const getChallenge = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  url
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  url: string;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: '/challenge',
    options: {
      followRedirect: false,
      followAllRedirects: false,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        referer: `${url}/account/login`
      }
    },
    message: 'Visiting challenge',
    from: States.GET_CHALLENGE
  });
};

export const submitChallenge = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  authToken,
  captchaToken,
  url
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  authToken: string;
  captchaToken: string;
  url: string;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: '/account/login',
    options: {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        referer: `${url}/challenge`
      },
      form: {
        authenticity_token: authToken,
        'g-recaptcha-response': captchaToken
      }
    },
    message: 'Submitting challenge',
    from: States.SUBMIT_CHALLENGE
  });
};
