import { Task } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';

const { States } = Task;

export const getReview = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  hash,
  shopId
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  hash: string;
  shopId: string;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `/${shopId}/checkouts/${hash}?step=review`,
    options: {
      method: 'GET',
      followAllRedirects: false,
      followRedirect: false
    },
    message: 'Calculating taxes',
    from: States.GET_REVIEW
  });
};

export const submitReview = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  hash,
  shopId,
  form
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  hash: string;
  shopId: string;
  form: any;
}) => {
  const {
    task: {
      store: { url }
    }
  } = context;

  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: `/${shopId}/checkouts/${hash}`,
    options: {
      method: 'POST',
      followAllRedirects: false,
      followRedirect: false,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        referer: `${url}/${shopId}/checkouts/${hash}`,
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1'
      },
      form
    },
    message: 'Completing order',
    from: States.SUBMIT_REVIEW
  });
};
