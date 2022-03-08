import { Task } from '../../constants';

const { States } = Task;

export const getConfig = ({
  handler,
  productId,
  userAgent,
  secUAHeader,
  configUrl
}: {
  handler: Function;
  productId: string;
  userAgent: string;
  secUAHeader: string;
  configUrl: string;
}) =>
  handler({
    endpoint: configUrl,
    options: {
      json: true,
      headers: {
        'sec-ch-ua': secUAHeader,
        accept: 'application/json, text/plain, */*',
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        referer: `https://www.yeezysupply.com/product/${productId}`,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    from: States.GET_CONFIG
  });

export const getProduct = ({
  handler,
  userAgent,
  secUAHeader,
  productId
}: {
  handler: Function;
  userAgent: string;
  secUAHeader: string;
  productId: string;
}) =>
  handler({
    endpoint: `/hpl/content/yeezy-supply/releases/${productId}/en_US.json`,
    options: {
      json: true,
      headers: {
        'sec-ch-ua': secUAHeader,
        'sec-ch-ua-mobile': '?0',
        dnt: '1',
        referer: `https://www.yeezysupply.com/product/${productId}`,
        'upgrade-insecure-requests': '1',
        'user-agent': userAgent,
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    from: States.GET_US_PRODUCT
  });

export const getShared = ({
  handler,
  userAgent,
  secUAHeader,
  productId
}: {
  handler: Function;
  userAgent: string;
  secUAHeader: string;
  productId: string;
}) =>
  handler({
    endpoint: `/hpl/content/yeezy-supply/releases/${productId}/shared.json`,
    options: {
      json: true,
      headers: {
        'sec-ch-ua': secUAHeader,
        'sec-ch-ua-mobile': '?0',
        dnt: '1',
        referer: `https://www.yeezysupply.com/product/${productId}`,
        'upgrade-insecure-requests': '1',
        'user-agent': userAgent,
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    from: States.GET_WRGEN_ASSET
  });

export const getWrAsset = ({
  handler,
  userAgent,
  secUAHeader,
  wrUrl
}: {
  handler: Function;
  userAgent: string;
  secUAHeader: string;
  wrUrl: string;
}) =>
  handler({
    endpoint: wrUrl,
    options: {
      json: true,
      headers: {
        'sec-ch-ua': secUAHeader,
        'sec-ch-ua-mobile': '?0',
        dnt: '1',
        'upgrade-insecure-requests': '1',
        'user-agent': userAgent,
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    message: 'Visiting asset',
    from: States.GET_WRGEN_ASSET
  });
