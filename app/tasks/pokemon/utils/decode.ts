import { encrypt } from 'cs2-encryption';
import { typeForProvider } from './cards';

export const encryptCard = async (keyId: string, payment: any) => {
  const { card, exp, cvv, type: provider } = payment;
  const type = typeForProvider(provider);
  const [month, year] = exp.split('/');

  return encrypt(
    {
      securityCode: cvv,
      number: card,
      type,
      expirationMonth: month,
      expirationYear: `20${year}`
    },
    keyId
  );
};
