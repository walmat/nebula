import { Task as TaskConstants } from '../../constants';
import { ShopifyContext } from '../../../common/contexts';

const { States } = TaskConstants;

export const getPassword = ({
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
    endpoint: '/password',
    options: {
      method: 'GET',
      followRedirect: false,
      followAllRedirects: false
    },
    message: 'Visiting password',
    from: States.GET_PASSWORD
  });
};

export const submitPassword = ({
  handler,
  context,
  current,
  aborter,
  delayer,
  form
}: {
  handler: Function;
  context: ShopifyContext;
  current: any;
  aborter: AbortController;
  delayer: any;
  form: string;
}) => {
  let params = form;

  if (!params) {
    const { password } = context.task;
    params = `form_type=storefront_password&utf8=✓&password=${password}`;
  }

  return handler({
    context,
    current,
    aborter,
    delayer,
    endpoint: '/password',
    options: {
      method: 'POST',
      followRedirect: false,
      followAllRedirects: false,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: params
    },
    message: 'Submitting password',
    from: States.SUBMIT_PASSWORD
  });
};
