import { getRandomIntInclusive } from '../../../common/utils';
import { Task } from '../../constants';

const { States } = Task;

export const getSession = ({
  handler,
  boomerangUrl,
  soastaApiKey,
  userAgent
}: {
  handler: Function;
  boomerangUrl: string;
  soastaApiKey: string;
  userAgent: string;
}) => {
  return handler({
    endpoint: `${boomerangUrl}/${soastaApiKey}`,
    options: {
      json: true,
      headers: {
        'user-agent': userAgent,
        accept: '*/*',
        referer: new URL(boomerangUrl).origin,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    message: 'Generating session',
    from: States.GET_SESSION
  });
};

export const getBoomerang = ({
  handler,
  sessionId,
  boomerangApiUrl,
  boomerangVersion,
  soastaApiKey,
  userAgent
}: {
  handler: Function;
  sessionId: string;
  boomerangApiUrl: string;
  boomerangVersion: string;
  soastaApiKey: string;
  userAgent: string;
}) => {
  return handler({
    endpoint: `${boomerangApiUrl}${soastaApiKey}&d=www.yeezysupply.com&t=${getRandomIntInclusive(
      500000,
      550000
    )}&v=${boomerangVersion}&if=&sl=0&si=${sessionId}-${Math.random()
      .toString(36)
      .replace(
        /^0\./,
        ''
      )}&plugins=delayBeaconSending%2CConfigOverride%2CContinuity%2CPageParams%2CIFrameDelay%2CAutoXHR%2CSPA%2CAngular%2CBackbone%2CEmber%2CHistory%2CRT%2CCrossDomain%2CBW%2CPaintTiming%2CNavigationTiming%2CResourceTiming%2CMemory%2CCACHE_RELOAD%2CErrors%2CTPAnalytics%2CUserTiming%2CAkamai%2CEarly%2CLOGN&acao=`,
    options: {
      json: true,
      headers: {
        'user-agent': userAgent,
        accept: '*/*',
        referer: 'https://www.yeezysupply.com/',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    message: 'Generating session',
    from: States.GET_SESSION
  });
};
