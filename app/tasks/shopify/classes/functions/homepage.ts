import { Task } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';

const { States } = Task;

export const getHomepage = ({
  handler,
  context,
  current,
  aborter,
  delayer
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
}) => {
  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: '/',
    options: {
      json: false,
      followRedirect: false,
      followAllRedirects: false
    },
    message: 'Visiting homepage',
    from: States.GET_HOMEPAGE
  });
};
