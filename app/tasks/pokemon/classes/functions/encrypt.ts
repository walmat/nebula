import decode from 'jwt-decode';

import { Task } from '../../constants';

import { KeyId } from '../../utils/encrypt';
import { encryptCard } from '../../utils';

const { States } = Task;

export const createEncryption = async ({
  handler,
  keyId,
  microform,
  payment
}: {
  handler: Function;
  keyId: string;
  microform: string;
  payment: any;
}) => {
  const decoded: KeyId = decode(keyId);
  const { kid } = decoded.flx.jwk;

  const encryptedKeyId = await encryptCard(keyId, payment);

  return handler({
    endpoint: 'https://flex.cybersource.com/flex/v2/tokens',
    options: {
      method: 'POST',
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/jwt; charset=UTF-8',
        origin: 'https://flex.cybersource.com',
        referer: `https://flex.cybersource.com/cybersource/assets/microform/${microform}/iframe.html?keyId=${kid}`,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      body: encryptedKeyId
    },
    includeHeaders: false,
    message: 'Encrypting session',
    from: States.CREATE_ENCRYPT
  });
};
