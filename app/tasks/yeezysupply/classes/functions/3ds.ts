import { Task } from '../../constants';

const { States } = Task;

export const completeCheckout = ({
  handler,
  userAgent,
  secUAHeader,
  storeUrl,
  bearer,
  form,
  extras
}: {
  handler: Function;
  userAgent: string;
  secUAHeader: string;
  storeUrl: string;
  bearer: string;
  form: any;
  extras: any;
}) => {
  return handler({
    endpoint: form.paymentUrl,
    options: {
      method: 'POST',
      json: false,
      headers: {
        'x-instana-t': extras['x-instana-t'],
        dnt: '1',
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        'x-instana-l': extras['x-instana-l'],
        'x-instana-s': extras['x-instana-s'],
        'content-type': 'application/json',
        'checkout-authorization': bearer || 'null',
        'sec-ch-ua': secUAHeader,
        accept: '*/*',
        origin: storeUrl,
        referer: form.termUrl,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9;q=0.9'
      },
      form: {
        orderId: form.orderId,
        ...form.data
      }
    },
    message: 'Completing checkout',
    from: States.COMPLETE_CHECKOUT
  });
};
