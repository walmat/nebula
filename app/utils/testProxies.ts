import { session } from 'electron';

import { request, isImproperStatusCode } from '../tasks/common/utils';

const format = (rawData: string) => {
  const [ip, port, user, pass] = rawData.split(':');

  if (!ip || !port) {
    return undefined;
  }

  if (user && pass) {
    return `http://${user}:${pass}@${ip}:${port}`;
  }

  return `http://${ip}:${port}`;
};

const getBaseAddress = (proxy: string) => {
  const splitProxy = proxy.split('@');
  return splitProxy[splitProxy.length - 1];
};

export const testProxy = (
  url: string,
  ip: string
): Promise<{ speed: number | 'failed'; isLoading: boolean }> => {
  return new Promise(async resolve => {
    const proxySession = session.fromPartition(`${ip}`);

    const withAuth = format(ip);
    if (!withAuth) {
      proxySession.setProxy({ proxyRules: '' });
    } else {
      const baseAddr = getBaseAddress(withAuth);
      if (baseAddr) {
        proxySession.setProxy({ proxyRules: baseAddr });
      } else {
        proxySession.setProxy({ proxyRules: '' });
      }
    }

    try {
      const { statusCode, time } = await request(proxySession, {
        url,
        method: 'HEAD',
        proxy: withAuth,
        followAllRedirects: false,
        followRedirect: false,
        timeout: 30000,
        headers: {
          accept: '*/*',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
        }
      });

      if (isImproperStatusCode(statusCode) && statusCode !== 401) {
        return resolve({ speed: 'failed', isLoading: false });
      }

      return resolve({ speed: time, isLoading: false });
    } catch (e) {
      return resolve({ speed: 'failed', isLoading: false });
    }
  });
};
