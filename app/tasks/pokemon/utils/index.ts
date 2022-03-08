import { userAgent, toTitleCase } from '../../common/utils';

import { pickVariant } from './pickVariant';
import { encryptCard } from './decode';

type UserAgents = {
  [index: number]: string;
};

export const userAgents: UserAgents = {
  0: userAgent,
  1: `Mozilla/5.0 (compatible; MJ12bot/v1.3.${
    Math.floor(Math.random() * 8) + 1
  }; http://mj12bot.com/)`
};

export const getHeaders = (name: string) => ({
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': /ca/i.test(name) ? 'en-ca' : 'en-us',
  origin: 'https://www.pokemoncenter.com',
  'x-store-scope': /ca/i.test(name) ? 'pokemon-ca' : 'pokemon'
});

export const getCardType = (type: string) => {
  if (/visa/i.test(type)) {
    return 'Visa';
  }

  if (/master/i.test(type)) {
    return 'MasterCard';
  }

  if (/amex|american/i.test(type)) {
    return 'American Express';
  }

  if (/discover/i.test(type)) {
    return 'Discover';
  }

  if (/diners/i.test(type)) {
    return 'Diners Club';
  }

  if (/jcb/i.test(type)) {
    return 'JCB';
  }

  if (/union|cup/i.test(type)) {
    return 'China UnionPay';
  }

  return toTitleCase(type);
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export { pickVariant, encryptCard };
