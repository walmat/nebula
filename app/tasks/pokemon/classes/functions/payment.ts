import { Task } from '../../constants';

const { States } = Task;

export const getKeyId = ({
  handler,
  storeName,
  storeUrl
}: {
  handler: Function;
  storeName: string;
  storeUrl: string;
}) => {
  let endpoint = `/tpci-ecommweb-api/payment/key?microform=true`;
  if (/ca/i.test(storeName)) {
    endpoint += `&locale=en-CA`;
  } else {
    endpoint += `&locale=en-US`;
  }

  let referer = `${storeUrl}`;
  if (/ca/i.test(storeName)) {
    referer += `/en-ca/checkout/address`;
  } else {
    endpoint += `/checkout/address`;
  }

  return handler({
    endpoint,
    options: {
      json: true,
      headers: {
        referer,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      }
    },
    message: 'Generating token',
    from: States.GET_KEY_ID
  });
};

export const submitPayment = ({
  handler,
  storeUrl,
  json
}: {
  handler: Function;
  storeUrl: string;
  json: any;
}) => {
  return handler({
    endpoint: '/tpci-ecommweb-api/payment?microform=true&format=nodatalinks',
    options: {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        referer: `${storeUrl}/checkout/payment`,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      json
    },
    message: 'Submitting payment',
    from: States.SUBMIT_PAYMENT
  });
};
