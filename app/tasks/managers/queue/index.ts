import { Cookie } from 'electron';

export class QueueManager {
  bank: {
    [url: string]: {
      id: string;
      cookies: Cookie[];
    }[];
  };

  constructor() {
    this.bank = {};
  }

  get = (url: string) => {
    if (!this.bank[url]) {
      return null;
    }

    const store = this.bank[url];
    const cycled = store.shift();
    if (!cycled) {
      return null;
    }

    this.bank[url].push({ ...cycled });
    return cycled;
  };

  add = ({ id, url, cookies }: any) => {
    if (!this.bank[url]) {
      this.bank[url] = [];
    }

    this.bank[url].push({ id, cookies });
  };

  remove = ({ id, url }: { id: string; url: string }) => {
    if (!this.bank[url]) {
      return;
    }

    const index = this.bank[url].findIndex(c => c.id === id);
    if (index === -1) {
      return;
    }

    this.bank[url].splice(index, 1);
  };
}
