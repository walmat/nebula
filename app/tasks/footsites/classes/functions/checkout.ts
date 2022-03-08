import uuid from 'uuid';

import { getDfValue } from '../../utils';
import { Task } from '../../constants';

const adyenEncrypt = require('node-adyen-encrypt')(24);

const { States } = Task;

export const encryptData = (cardData: CardData, cseKey: string) => {
  let dataEncrypted;
  try {
    // eslint-disable-next-line no-param-reassign
    cardData.generationtime = new Date().toISOString();
    const cseInstance = adyenEncrypt.createEncryption(cseKey, {});
    cseInstance.validate(cardData);
    dataEncrypted = cseInstance.encrypt(cardData);
  } catch (e) {
    // noop...
  }
  return dataEncrypted;
};

export const encryptFootsite = (baseCardData: CardData, cseKey: string) => {
  const dfValue = getDfValue();

  const encrpytedObj = {
    encryptedCardNumber: encryptData(
      createFootsiteData(['number'], dfValue, baseCardData),
      cseKey
    ),
    encryptedExpiryMonth: encryptData(
      createFootsiteData(['number', 'expiryMonth'], dfValue, baseCardData),
      cseKey
    ),
    encryptedExpiryYear: encryptData(
      createFootsiteData(
        ['number', 'expiryMonth', 'expiryYear'],
        dfValue,
        baseCardData
      ),
      cseKey
    ),
    encryptedSecurityCode: encryptData(
      createFootsiteData(
        ['number', 'expiryMonth', 'expiryYear', 'cvc'],
        dfValue,
        baseCardData
      ),
      cseKey
    )
  };

  return encrpytedObj;
};

const cardNumberTransformer = (cardNumber: string) => {
  // eslint-disable-next-line no-param-reassign
  cardNumber = cardNumber.replace(/\D/g, '');
  return cardNumber.replace(/(\d{4})/g, '$1 ').replace(/(^\s+|\s+$)/, '');
};

type CardData = {
  number: string;
  cvc: string;
  holder: string;
  month: string;
  year: string;
  generationtime?: string;
};

const createFootsiteData = (
  nameArr: string[],
  dfValue: string,
  baseCardData: CardData
) => {
  const cardData: any = {};

  for (let i = 0; i < nameArr.length; i += 1) {
    const name = nameArr[i];
    switch (name) {
      case 'number':
        cardData[`${name}`] = cardNumberTransformer(baseCardData.number);
        break;
      case 'cvc':
        cardData[`${name}`] = baseCardData.cvc;
        break;
      case 'expiryMonth':
        cardData[`${name}`] = baseCardData.month;
        break;
      // must have 20 in front
      case 'expiryYear':
        cardData[`${name}`] = `20${baseCardData.year}`;
        break;
      default:
        break;
    }
  }

  cardData.dfValue = dfValue;
  cardData.holderName = baseCardData.holder;
  return cardData;
};

export const submitCheckout = async ({
  handler,
  message,
  storeUrl,
  cartId,
  csrfToken,
  encryptionKey,
  payment
}: {
  handler: Function;
  message: string;
  storeUrl: string;
  cartId: string;
  csrfToken: string;
  encryptionKey: string;
  payment: any;
}) => {
  let endpoint = `/api/v2/users/orders?timestamp=${Date.now()}`;
  let payload: any = {};

  if (/www\.footlocker\.co\.uk/i.test(storeUrl)) {
    endpoint = `/api/users/orders/adyen?timestamp=${Date.now()}`;
    payload = {
      optIn: false,
      preferredLanguage: 'en',
      termsAndCondition: true,
      deviceId:
        '0400tyDoXSFjKeoNf94lis1ztjbaCjtwdIzBnrp/XmcfWoVVgr+Rt2dAZP+0aAuVOFL4FTmO+bngRuvXnfra5uHnD42fRE9PMD+Q3FCX9pS6pa9J27cNnYPSQUyAZ5slTMaJ+UPuCMmCd6JiCIZRJQvjJX/brPol8AV6Yb9x2QgwVubph/T+lMlRTJjCUwopOToTDJ0qCc4gMpduVSt2BaQklPnxAAHc199AHf4N3pIo1yQVvKUitMuhXCagG24RYnEZi4PvWoIpyZmpr5zlQx90s1eovP7W+WpQCv10TaNx+XTCCuhAF+nK4gvCa9tA65eC57wb4PD49aJVPDYLihDankoqWDbHA4su0+1vm3fbD4rDJ0DFxdJP7VgOQ9z936intXN/LuoqOt7ggu2rYKClFBEQdSA7pVHI+087MHv8fzHz3wafI/WYHEsTCs2TKRSUB860/YtAXmzRhLqdI1qchaYiJ/+IO4wJwtQHr2DgT3vFL0ZMZD89cevpxdcdnhXWCQf7ODMKeW56Jn7YNCrmjtW5s8Hb9UYRvgPxwa4l98diDwK4w63kwk+N0eY/qPMOBL4aeIdJ+eNZOUd2zwsxQUsys+sxW8mW8sTzEDL+2GfZsbSyl9kH53ErNjRzWcwCkbuS2bhH2fM9JTa6h1EHgUBHbtl2L6+OFWpQwTscdvaIrukwLD3N1PqpDcajLlidS4e4f0GE7S1FQiHXkXi3KG5VK3YFpCSU+fEAAdzX30Ad/g3ekijXJBW8pSK0y6FcJqAbbhFicRmLg+9aginJmamvnOVDH3SzV6i8/tb5alAK/XRNo3H5dMIK6EAX6criC8Jr20Drl4LnvBvg8Pj1olU8NguKENqer1nNtP8OECkk/64lKoqM3wDorceNFA82i2sTVjDNkvFLO+3YsQiZukOe8mXXkfdIj2qku3ZkvznJeR0ATQxQVnlWmCRBdNDNsuaxAwAEbRdjjZSkBTBViHxgPVj4eN/NGYWc8AmavPCpk8WUUK5yAgcs+4762Kn4wW1EYeMWV94FwTuHk1oY7A7NhwaWHXBt1M87rVstx87uasO1J72IbUpX4ytSKzQH+cThFxfxQCNycPtZzoVX+j+EDXm9ivw4izrrGfL02gSJoJg5RjKaZn8ZSexdq/CVmz61zhzFB1cSSOiN5jbe88jwjs5Ca2/wBdhim9vK/Uu9reMfedtEcWxVYQhoLMwdw7yV1babUQ9E2YEMBkBTaDK2Ap43KhSPYo1spIJ6Rke4fzTUUKQEKRcWvEsMdd2+erzmvpDm5kytV+cAzi9nBHI7Ml7KvBs7PlVd+5WTqrhOqLzj2uQdHOmS1cSz6IKyRr1puZUqTD4=',
      cartId,
      paymentMethod: 'CREDITCARD',
      returnUrl: `${storeUrl}/adyen/checkout`,
      browserInfo: {
        screenWidth: 1792,
        screenHeight: 1120,
        colorDepth: 30,
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
        timeZoneOffset: 240,
        language: 'en-US',
        javaEnabled: false
      }
    };
  } else {
    payload = {
      paymentMethod: 'CREDITCARD',
      sid: '',
      deviceId:
        '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',
      cartId
    };
  }

  const { holder, card, exp, cvv } = payment;
  const [month, year] = exp.split('/');

  const data = {
    holder,
    number: card,
    month,
    year,
    cvc: cvv
  };

  const encrpytedObj = encryptFootsite(data, encryptionKey);
  payload.encryptedCardNumber = encrpytedObj.encryptedCardNumber;
  payload.encryptedExpiryMonth = encrpytedObj.encryptedExpiryMonth;
  payload.encryptedExpiryYear = encrpytedObj.encryptedExpiryYear;
  payload.encryptedSecurityCode = encrpytedObj.encryptedSecurityCode;

  const headers: any = {
    accept: 'application/json',
    'x-csrf-token': csrfToken,
    'x-fl-request-id': uuid(),
    'x-flapi-cart-guid': cartId,
    'content-type': 'application/json',
    referer: `${storeUrl}/checkout`,
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9'
  };

  if (/www\.footlocker\.ca/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-CA';
  }

  if (/www\.footlocker\.co\.uk/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-GB';
    headers['accept-language'] = `en-GB,en;q=0.9`;
    headers.referer = `${storeUrl}/en/checkout`;
  }

  return handler({
    endpoint,
    options: {
      method: 'POST',
      headers,
      json: payload
    },
    message,
    from: States.SUBMIT_CHECKOUT
  });
};
