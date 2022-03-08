import { ftl } from './ftl-us';
import { ca } from './ftl-ca';
import { kids } from './ftl-kids';
import { fa } from './fa';
import { eb } from './eb';
import { champs } from './champs';

export const cookies = (url: string) => {
  const c = list[url] || [];
  const { cookie } = c.pop();

  if (!cookie) {
    return null;
  }

  return cookie;
};

type list = {
  [key: string]: any[];
};

const list: list = {
  'https://www.footlocker.com': ftl,
  'https://www.footaction.com': fa,
  'https://www.eastbay.com': eb,
  'https://www.champssports.com': champs,
  'https://www.kidsfootlocker.com': kids,
  'https://www.footlocker.ca': ca
};
