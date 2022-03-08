import { userAgents } from '../../common/utils';
import { getDfValue } from './dfValues';

const adyenEncrypt = require('node-adyen-encrypt')(24);

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const createPaymentToken = (
  key: string,
  {
    holder,
    card,
    exp,
    cvv
  }: { holder: string; card: string; exp: string; cvv: string }
) => {
  const [month, year] = exp.split('/');

  const data = {
    number: card,
    cvc: cvv,
    holderName: holder,
    expiryMonth: month?.length > 1 ? month : `0${month}`,
    expiryYear: `20${year}`,
    generationtime: new Date().toISOString()
  };

  const encryptor = adyenEncrypt.createEncryption(key, {});

  encryptor.validate(data);

  return encryptor.encrypt(data);
};

export const extractCardType = (type: string) => {
  if (/visa/i.test(type)) {
    return 'VISA';
  }

  if (/master/i.test(type)) {
    return 'MASTER';
  }

  if (/discover/i.test(type)) {
    return 'DISCOVER';
  }

  if (/diners/i.test(type)) {
    return 'DINERS';
  }

  if (/american|amex|express/i.test(type)) {
    return 'AMEX';
  }

  return `${type}`.toUpperCase();
};

export { getDfValue, userAgents };
