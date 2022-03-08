import { Task } from '../../constants';

const { States } = Task;

export const getAkamai = ({
  handler,
  akamaiUrl,
  secUAHeader,
  referer,
  userAgent
}: {
  handler: Function;
  akamaiUrl: string;
  secUAHeader: string;
  referer: string;
  userAgent: string;
}) =>
  handler({
    endpoint: akamaiUrl,
    options: {
      json: true,
      headers: {
        'sec-ch-ua': secUAHeader,
        dnt: '1',
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        accept: '*/*',
        referer,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    message: 'Visiting akamai',
    from: States.GET_AKAMAI
  });

export const submitSensor = ({
  handler,
  referer,
  secUAHeader,
  akamaiUrl,
  userAgent,
  payload,
  extras
}: {
  handler: Function;
  referer: string;
  secUAHeader: string;
  akamaiUrl: string;
  userAgent: string;
  payload: string;
  extras: any;
}) =>
  handler({
    endpoint: akamaiUrl,
    options: {
      method: 'POST',
      json: false,
      headers: {
        'x-instana-t': extras['x-instana-t'],
        dnt: '1',
        'sec-ch-ua-mobile': '?0',
        'user-agent': userAgent,
        'x-instana-l': extras['x-instana-l'],
        'x-instana-s': extras['x-instana-s'],
        'content-type': 'text/plain;charset=UTF-8',
        'sec-ch-ua': secUAHeader,
        accept: '*/*',
        origin: 'https://www.yeezysupply.com',
        referer,
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      },
      body: `{"sensor_data": "${payload}"}`
    },
    message: 'Submitting sensor',
    from: States.SUBMIT_SENSOR
  });
