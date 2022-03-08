/* eslint-disable camelcase */
import { Task as TaskConstants } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';

const { States } = TaskConstants;

export const submitCheckpoint = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  url,
  form
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  url: string;
  form: any;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: '/checkpoint',
    options: {
      method: 'POST',
      json: false,
      followRedirect: false,
      followAllRedirects: false,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Dnt: '1',
        referer: `${url}/checkpoint?return_to=${encodeURIComponent(
          `${url}/cart`
        )}`,
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      },
      form
    },
    timeout: 60000,
    message: 'Submitting checkpoint',
    from: States.SUBMIT_CHECKPOINT
  });
};
