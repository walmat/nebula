import { Task } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';

const { States } = Task;

export const submitDiscount = ({
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
    message: 'Submitting discount',
    from: States.SUBMIT_DISCOUNT
  });
};
