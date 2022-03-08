import { DatadomeData } from '../../footsites/classes/types';

export type SessionRequester = {
  id: string;
  url: string;
  data: DatadomeData;
  release: (cookie?: string) => void;
  active: boolean;
};

export class GeetestManager {
  requesters: {
    [url: string]: {
      [id: string]: SessionRequester;
    };
  };

  constructor() {
    this.requesters = {};
  }

  count = (url: string) => {
    if (!this.requesters[url]) {
      this.requesters[url] = {};
    }

    return Object.values(this.requesters[url]).filter(({ active }) => active)
      .length;
  };

  insert = ({ id, url, data, release, active }: SessionRequester) => {
    if (!this.requesters[url]) {
      this.requesters[url] = {};
    }

    this.requesters[url][id] = {
      id,
      url,
      data,
      release,
      active
    };
  };

  get = (url: string, id: string) => {
    if (!this.requesters[url]) {
      this.requesters[url] = {};
    }

    return this.requesters[url][id];
  };

  // swaps an active solver with an inactive solver
  swap = (url: string, id: string) => {
    if (!this.requesters[url]) {
      this.requesters[url] = {};
    }

    this.requesters[url][id].active = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const { id: _id, data, release } of Object.values(
      this.requesters[url]
    )) {
      if (id !== _id && data.t !== 'bv') {
        // set old requester to inactive
        this.requesters[url][_id].active = true;
        release();
        break;
      }
    }
  };

  spread = (url: string, cookie: string) => {
    if (!this.requesters[url]) {
      this.requesters[url] = {};
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const { id: _id, release } of Object.values(this.requesters[url])) {
      if (!this.requesters[url]) {
        this.requesters[url] = {};
      }

      delete this.requesters[url][_id];
      release(cookie);
    }
  };

  remove = ({ id, url }: { id: string; url: string }) => {
    if (!this.requesters[url]) {
      this.requesters[url] = {};
    }

    delete this.requesters[url][id];
  };
}
