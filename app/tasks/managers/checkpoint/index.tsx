import { session, Session } from 'electron';
import { Utils } from '../../common';

const { userAgent, request } = Utils;

export class CheckpointManager {
  interval: number | null;

  intervalRate: number;

  requesters: {
    [url: string]: number;
  };

  session: Session;

  cache: any;

  constructor() {
    this.interval = null;

    this.intervalRate = 5000;

    this.requesters = {};

    this.session = session.fromPartition('persist:checkpoint');

    this.cache = {};
  }

  check = async (url: string) => {
    try {
      const { body } = await request(this.session, {
        url: `${url}/checkpoint`,
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'user-agent': userAgent,
          origin: url
        }
      });

      // return true;
      return /content_checkpoint/i.test(body);
    } catch (err) {
      return false;
    }
  };

  isLive = (url: string) => this.cache[url] || false;

  start = async (url: string) => {
    if (typeof this.cache[url] === 'undefined') {
      this.cache[url] = false;
    }

    if (typeof this.requesters[url] === 'undefined') {
      this.requesters[url] = 1;
    }

    if (!this.interval) {
      this.interval = setInterval(async () => {
        const isLive = await this.check(url);

        this.cache[url] = isLive;
      }, this.intervalRate);

      const isLive = await this.check(url);
      this.cache[url] = isLive;
    }
  };

  stop = (url: string) => {
    this.requesters[url] -= 1;

    if (this.requesters[url] < 0) {
      this.requesters[url] = 0;
    }

    if (this.requesters[url] === 0) {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  };
}
