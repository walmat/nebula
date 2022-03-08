import { Task } from '../../constants';

const { States } = Task;

export const submitInformation = ({
  handler,
  storeUrl,
  json
}: {
  handler: Function;
  storeUrl: string;
  json: any;
}) =>
  handler({
    endpoint: `/tpci-ecommweb-api/address?format=zoom.nodatalinks`,
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
    message: 'Submitting information',
    from: States.SUBMIT_INFORMATION
  });
