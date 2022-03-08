import uuid from 'uuidv4';
import { Task } from '../../constants';

const { States } = Task;

export const getSession = ({
  handler,
  storeUrl,
  message
}: {
  handler: Function;
  storeUrl: string;
  message: string;
}) => {
  const headers: any = {
    accept: 'application/json',
    'x-fl-request-id': uuid(),
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9'
  };

  let endpoint = `/api/session?timestamp=${Date.now()}`;
  if (/www\.footlocker\.ca/i.test(storeUrl)) {
    endpoint = endpoint.replace('v3', 'v4');
    headers['x-api-lang'] = 'en-CA';
  }

  if (/www\.footlocker\.co\.uk/i.test(storeUrl)) {
    headers['x-api-lang'] = 'en-GB';
    headers['accept-language'] = `en-GB,en;q=0.9`;
  }

  return handler({
    endpoint,
    options: {
      json: true,
      headers
    },
    message,
    from: States.GET_SESSION
  });
};
