import { Task } from '../../constants';

const { States } = Task;

export const submitCheckout = async ({
  handler,
  storeUrl,
  purchaseUri
}: {
  handler: Function;
  storeUrl: string;
  purchaseUri: string;
}) => {
  return handler({
    endpoint: `/tpci-ecommweb-api/order?format=nodatalinks`,
    options: {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        referer: `${storeUrl}/checkout/summary`
      },
      json: {
        purchaseForm: purchaseUri
      }
    },
    message: 'Submitting checkout',
    from: States.SUBMIT_CHECKOUT
  });
};
