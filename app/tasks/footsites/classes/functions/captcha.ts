import { Task } from '../../constants';
import { DatadomeData } from '../types';

const { States } = Task;

export const submitCaptcha = ({
  handler,
  userAgent,
  storeUrl,
  data,
  token
}: {
  handler: Function;
  userAgent: string;
  storeUrl: string;
  data: DatadomeData;
  token: string;
}) => {
  const { host, cid, initialCid, hsh, referer: _referer, s } = data;

  const referer = `https://${host}/captcha/?initialCid=${encodeURIComponent(
    initialCid
  )}&hash=${hsh}&cid=${encodeURIComponent(
    cid
  )}&t=fe&referer=${encodeURIComponent(_referer)}&s=${s}`;

  const endpoint = `https://${host}/captcha/check?cid=${encodeURIComponent(
    cid
  )}&icid=${encodeURIComponent(
    initialCid
  )}&ccid=null&g-recaptcha-response=${encodeURIComponent(
    token
  )}&hash=${hsh}&ua=${encodeURIComponent(
    userAgent
  )}&referer=${encodeURIComponent(storeUrl)}&parent_url=${encodeURIComponent(
    `${_referer}/`
  )}&x-forwarded-for=&captchaChallenge=57699&s=${s}`;

  return handler({
    endpoint,
    options: {
      json: true,
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        dnt: '1',
        referer,
        'user-agent': userAgent
      }
    },
    includeHeaders: false,
    message: 'Submitting captcha',
    from: States.SUBMIT_CAPTCHA
  });
};

export const submitCaptchaChallenge = ({
  handler,
  location,
  json
}: {
  handler: Function;
  location: string;
  json: any;
}) => {
  return handler({
    endpoint: 'https://footlocker.queue-it.net/challengeapi/verify',
    options: {
      json,
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        dnt: '1',
        referer: location
      }
    },
    includeHeaders: false,
    message: 'Submitting captcha',
    from: States.SUBMIT_CAPTCHA
  });
};
