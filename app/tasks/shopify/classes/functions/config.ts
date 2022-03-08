import { Task } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';

const { States } = Task;

export const getConfig = ({
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
    endpoint: '/payments/config',
    options: {
      json: true,
      followRedirect: false,
      followAllRedirects: false
    },
    message: 'Visiting config',
    from: States.GET_CONFIG
  });
};
