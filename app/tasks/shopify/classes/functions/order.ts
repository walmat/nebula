import { Task as TaskConstants } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';

const { States } = TaskConstants;

export const getOrder = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  hash,
  shopId,
  url,
  polling,
  message
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
  message: string;
}) => {
  const endpoint = polling
    ? `/${shopId}/checkouts/${hash}/processing?from_processing_page=1`
    : `/${shopId}/checkouts/${hash}/processing`;

  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint,
    options: {
      json: false,
      followRedirect: true,
      followAllRedirects: true,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        referer: `${url}/${shopId}/checkouts/${hash}`
      }
    },
    message,
    from: States.GET_ORDER
  });
};
