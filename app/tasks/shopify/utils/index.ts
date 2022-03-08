/* eslint-disable no-bitwise */

import { userAgent } from '../../common/utils';
import parseProtection from './protection';
import pickVariant from './pickVariant';
import {
  addToCart,
  patchCartForm,
  submitCustomerApiForm,
  submitCustomerForm,
  submitShippingForm,
  submitDiscountForm,
  submitPaymentForm,
  submitPaymentFormApi,
  onboardGuest,
  submitReviewForm,
  patchShippingRate
} from './forms';
import {
  convertToJson,
  filterAndLimit,
  getParseType,
  matchKeywords,
  matchVariant,
  match
} from './parse';

const getRandomHex = (size = 32) => {
  const result = [];
  const hexRef = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f'
  ];

  for (let n = 0; n < size; n += 1) {
    result.push(hexRef[Math.floor(Math.random() * 16)]);
  }
  return result.join('');
};

export const urlForStore = (url: string) => {
  try {
    const { origin } = new URL(url);

    return origin.replace(/^https?:\/\//, '');
  } catch (e) {
    return null;
  }
};

export const cardToPaypalIssuer = (type: string) => {
  if (/master/i.test(type)) {
    return 'MASTER_CARD';
  }

  if (/discover/i.test(type)) {
    return 'DISCOVER';
  }

  if (/visa/i.test(type)) {
    return 'VISA';
  }

  if (/american|amex/i.test(type)) {
    return 'AMEX';
  }

  return type.toUpperCase();
};

export const cacheBypass = (length = 32) =>
  [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('');

export const getHeaders = ({ url }: { url: string }) => ({
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
  'user-agent': userAgent,
  origin: url
});

const Parse = {
  convertToJson,
  filterAndLimit,
  getParseType,
  matchKeywords,
  matchVariant,
  match
};

const Forms = {
  addToCart,
  patchCartForm,
  submitCustomerApiForm,
  submitCustomerForm,
  submitShippingForm,
  submitDiscountForm,
  submitPaymentForm,
  submitPaymentFormApi,
  onboardGuest,
  submitReviewForm,
  patchShippingRate
};

export { pickVariant, Parse, Forms, parseProtection, getRandomHex };
