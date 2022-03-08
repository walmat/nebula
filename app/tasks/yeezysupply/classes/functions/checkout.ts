import { Task } from '../../constants';
import { createPaymentToken, extractCardType, getDfValue } from '../../utils';
import { CorrelationHeaders } from '../types';

const { States } = Task;

export const submitCheckout = async ({
  handler,
  encryptionKey,
  bearer,
  userAgent,
  secUAHeader,
  basketId,
  extras,
  payment
}: {
  handler: Function;
  encryptionKey: string;
  bearer: string | null;
  userAgent: string;
  secUAHeader: string;
  basketId: string;
  extras: CorrelationHeaders;
  payment: any;
}) => {
  const { holder, card, exp, cvv, type } = payment;
  const [month, year] = exp.split('/');
  const lastFour = `${card}`.substr(-4);
  const expirationMonth = month.length > 1 ? month : `0${month}`;
  const expirationYear = `20${year}`;
  const encryptedInstrument = await createPaymentToken(encryptionKey, {
    holder,
    card,
    exp,
    cvv
  });

  const paymentInstrument = {
    holder,
    expirationMonth: Number(expirationMonth),
    expirationYear: Number(expirationYear),
    lastFour,
    paymentMethodId: 'CREDIT_CARD',
    cardType: extractCardType(type)
  };

  const fingerprint = getDfValue();

  return handler({
    endpoint: '/api/checkout/orders',
    options: {
      method: 'POST',
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
        origin: 'https://www.yeezysupply.com',
        referer: `https://www.yeezysupply.com/payment`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      json: {
        basketId,
        encryptedInstrument: encryptedInstrument.replace('0_1_24', '0_1_21'),
        paymentInstrument,
        fingerprint
      }
    },
    message: 'Submitting checkout',
    from: States.SUBMIT_CHECKOUT
  });
};
