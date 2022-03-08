import { Task } from '../../constants';

const { States } = Task;

export const getQueue = ({
  handler,
  message,
  location,
  storeUrl
}: {
  handler: Function;
  message: string;
  location: string;
  storeUrl: string;
}) => {
  const headers: any = {
    accept: '*/*',
    referer: `${storeUrl}/`,
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9'
  };

  if (/www\.footlocker\.co\.uk/i.test(storeUrl)) {
    headers['accept-language'] = `en-GB,en;q=0.9`;
  }

  return handler({
    endpoint: location,
    options: {
      followRedirect: false,
      followAllRedirects: false,
      headers
    },
    message,
    from: States.GET_REDIRECT
  });
};

export const submitEmptyPow = ({
  handler,
  endpoint,
  json
}: {
  handler: Function;
  endpoint: string;
  json: any;
}) => {
  return handler({
    endpoint,
    options: {
      json,
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        dnt: '1'
      }
    },
    includeHeaders: false
  });
};

export const submitPow = ({
  handler,
  endpoint,
  json
}: {
  handler: Function;
  endpoint: string;
  json: any;
}) => {
  return handler({
    endpoint,
    options: {
      json,
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        dnt: '1'
      }
    },
    includeHeaders: false
  });
};

export const submitEnqueue = ({
  handler,
  endpoint,
  json
}: {
  handler: Function;
  endpoint: string;
  json: any;
}) => {
  return handler({
    endpoint,
    options: {
      json,
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        dnt: '1'
      }
    },
    includeHeaders: false
  });
};

export const submitSpaQueue = ({
  handler,
  endpoint,
  json
}: {
  handler: Function;
  endpoint: string;
  json: any;
}) => {
  return handler({
    endpoint,
    options: {
      json,
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        dnt: '1'
      }
    },
    includeHeaders: false
  });
};
