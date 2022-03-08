import { Task } from '../../constants';
import { DatadomeData } from '../../types';

const { States } = Task;

export const submitCaptcha = ({
  handler,
  url,
  data,
  userAgent,
  captchaToken
}: {
  handler: Function;
  url: string;
  data: DatadomeData;
  userAgent: string;
  captchaToken: string;
}) => {
  const { host, cid, initialCid, hsh, referer: _referer, s, t } = data;

  const referer = `https://${host}/captcha/?initialCid=${initialCid}&hash=${hsh}&t=${t}&s=${s}&referer=${encodeURIComponent(
    _referer
  )}&cid=${cid}`;

  const endpoint = `https://${host}/captcha/check?cid=${encodeURIComponent(
    cid
  )}&icid=${encodeURIComponent(
    initialCid
  )}&ccid=null&g-recaptcha-response=${encodeURIComponent(
    captchaToken
  )}&hash=${hsh}&ua=${encodeURIComponent(
    userAgent
  )}&referer=${encodeURIComponent(
    `${url}/`
  )}&parent_url=&x-forwarded-for=&captchaChallenge=12439015&s=${s}`;

  return handler({
    endpoint,
    options: {
      method: 'GET',
      json: true,
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        dnt: '1',
        referer
      }
    },
    message: 'Submitting captcha',
    from: States.SUBMIT_CAPTCHA
  });
};
