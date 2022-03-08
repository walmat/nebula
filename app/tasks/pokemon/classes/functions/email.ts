import { Task } from '../../constants';

const { States } = Task;

export const submitEmail = ({
  handler,
  storeUrl,
  json
}: {
  handler: Function;
  storeUrl: string;
  json: any;
}) => {
  return handler({
    endpoint: `/tpci-ecommweb-api/email?format=zoom.nodatalinks`,
    options: {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        referer: `${storeUrl}/checkout/address`,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      json
    },
    from: States.SUBMIT_INFORMATION
  });
};
