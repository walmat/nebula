import { Task } from '../../constants';

const { States } = Task;

export const getHomepage = ({
  handler,
  secUAHeader,
  userAgent
}: {
  handler: Function;
  secUAHeader: string;
  userAgent: string;
}) =>
  handler({
    endpoint: 'https://www.yeezysupply.com/',
    options: {
      json: false,
      headers: {
        'sec-ch-ua': secUAHeader,
        'sec-ch-ua-mobile': '?0',
        dnt: '1',
        'upgrade-insecure-requests': '1',
        'user-agent': userAgent,
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9'
      }
    },
    message: 'Visiting homepage',
    from: States.GET_HOMEPAGE
  });
