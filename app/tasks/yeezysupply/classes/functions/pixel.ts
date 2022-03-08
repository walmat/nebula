import { Task } from '../../constants';

const { States } = Task;

export const getPixel = ({
  handler,
  pxTag,
  secUAHeader,
  userAgent
}: {
  handler: Function;
  pxTag: string;
  secUAHeader: string;
  userAgent: string;
}) => {
  return handler({
    endpoint: `/akam/11/${pxTag}`,
    options: {
      json: false,
      headers: {
        'sec-ch-ua': secUAHeader,
        dnt: '1',
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        accept: '*/*',
        referer: 'https://www.yeezysupply.com/',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    message: 'Visiting pixel',
    from: States.GET_PIXEL
  });
};

export const submitPixel = ({
  handler,
  pxTag,
  secUAHeader,
  userAgent,
  payload,
  extras
}: {
  handler: Function;
  pxTag: string;
  secUAHeader: string;
  userAgent: string;
  payload: string;
  extras?: any;
}) => {
  return handler({
    endpoint: `/akam/11/pixel_${pxTag}`,
    options: {
      method: 'POST',
      headers: {
        'x-instana-t': extras['x-instana-t'],
        dnt: '1',
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        'x-instana-l': extras['x-instana-l'],
        'x-instana-s': extras['x-instana-s'],
        'content-type': 'application/x-www-form-urlencoded',
        'sec-ch-ua': secUAHeader,
        accept: '*/*',
        origin: 'https://www.yeezysupply.com',
        referer: 'https://www.yeezysupply.com/',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      body: payload
    },
    message: 'Submitting pixel',
    from: States.SUBMIT_PIXEL
  });
};
