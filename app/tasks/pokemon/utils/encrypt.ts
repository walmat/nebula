import { Crypto } from '@peculiar/webcrypto';
import btoa from 'btoa';

export type Card = {
  securityCode: string;
  number: string;
  type: string;
  expirationMonth: string;
  expirationYear: string;
};

export type KeyId = {
  flx: {
    path: string;
    data: string;
    origin: string;
    jwk: {
      kty: string;
      e: string;
      use: string;
      n: string;
      kid: string;
    };
  };
  ctx: {
    data: {
      targetOrigins: string[];
      mfOrigin: string;
    };
    type: string;
  }[];
  iss: string;
  exp: number;
  iat: number;
  jti: string;
};

export type CardType = '001' | '002' | '042' | '004' | '005' | '007' | '062';

export type JsonWebTokenInfo = {
  data: {
    expirationYear: string;
    number: string;
    expirationMonth: string;
    type: CardType;
  };
  iss: 'Flex/04';
  exp: number;
  type: 'mf-0.11.0';
  iat: number;
  jti: string;
};

type Payload = {
  data: Card;
  context: string;
  index: number;
};

type Header = {
  kid: string;
  alg: string;
  enc: string;
};

type InitializationVector = Uint8Array;

const arrayBufferToString = (buf: ArrayBuffer) =>
  String.fromCharCode.apply(null, new Uint8Array(buf) as any);

const stringToArrayBuffer = (str: string) => {
  const buffer = new ArrayBuffer(str.length);
  const array = new Uint8Array(buffer);
  const { length } = str;

  for (let r = 0; r < length; r += 1) {
    array[r] = str.charCodeAt(r);
  }

  return buffer;
};

const replace = (str: string) =>
  btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const generateKey = (crypto: Crypto): Promise<CryptoKey> =>
  crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt']
  );

const encrypt = async (
  crypto: Crypto,
  payload: Payload,
  key: CryptoKey,
  header: Header,
  iv: InitializationVector
) => {
  const algorithm = {
    name: 'AES-GCM',
    iv,
    additionalData: stringToArrayBuffer(replace(JSON.stringify(header))),
    tagLength: 128
  };

  const buffer = await crypto.subtle.encrypt(
    algorithm,
    key,
    stringToArrayBuffer(JSON.stringify(payload))
  );

  return [buffer, key];
};

function importKey(crypto: Crypto, jsonWebKey: JsonWebKey) {
  return crypto.subtle.importKey(
    'jwk',
    jsonWebKey,
    {
      name: 'RSA-OAEP',
      hash: {
        name: 'SHA-1'
      }
    },
    false,
    ['wrapKey']
  );
}

async function wrapKey(crypto: Crypto, key: CryptoKey, jsonWebKey: JsonWebKey) {
  const wrappedKey = await importKey(crypto, jsonWebKey);

  return crypto.subtle.wrapKey('raw', key, wrappedKey, {
    name: 'RSA-OAEP',
    hash: {
      name: 'SHA-1'
    }
  });
}

async function build(
  crypto: Crypto,
  buffer: ArrayBuffer,
  key: CryptoKey,
  iv: InitializationVector,
  header: Header,
  jsonWebKey: JsonWebKey
) {
  // eslint-disable-next-line no-bitwise
  const u = buffer.byteLength - ((128 + 7) >> 3);

  const keyBuffer = await wrapKey(crypto, key, jsonWebKey);

  return [
    replace(JSON.stringify(header)),
    replace(arrayBufferToString(keyBuffer)),
    replace(arrayBufferToString(iv)),
    replace(arrayBufferToString(buffer.slice(0, u))),
    replace(arrayBufferToString(buffer.slice(u)))
  ].join('.');
}

export const run = async (
  card: Card,
  keyId: KeyId,
  token: string,
  radius = 0
) => {
  const crypto = new Crypto();

  const header: Header = {
    kid: keyId.flx.jwk.kid || '',
    alg: 'RSA-OAEP',
    enc: 'A256GCM'
  };

  const payload: Payload = {
    data: card,
    context: token,
    index: radius
  };

  const iv: InitializationVector = crypto.getRandomValues(new Uint8Array(12));

  return generateKey(crypto)
    .then(key => encrypt(crypto, payload, key, header, iv))
    .then(data => {
      const [buffer, key] = data;

      return build(crypto, buffer, key, iv, header, keyId.flx.jwk);
    });
};
