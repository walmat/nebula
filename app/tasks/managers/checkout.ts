import { emitEvent } from '../common/utils';

/* eslint-disable no-restricted-syntax */
export type DataRequester = {
  context: any;
  abort?: () => void;
};

export class CheckoutManager {
  requesters: {
    [url: string]: {
      [taskId: string]: DataRequester;
    };
  };

  constructor() {
    this.requesters = {};
  }

  check = ({ context }: DataRequester) => {
    const {
      id,
      task: {
        profile: { id: profileId },
        store: { url }
      }
    } = context;

    if (!this.requesters[url]) {
      this.requesters[url] = {};
    }

    for (const { context: _context, abort } of Object.values(
      this.requesters[url]
    )) {
      const {
        id: _id,
        task: {
          profile: { id: _profileId }
        }
      } = _context;

      // TODO: Refine this more...
      if (profileId === _profileId && _id !== id) {
        emitEvent(_context, [_id], {
          message: 'Profile already used'
        });

        if (abort) {
          abort();
        }
      }
    }
  };

  insert = ({ context, abort }: DataRequester) => {
    const {
      id,
      task: {
        store: { url }
      }
    } = context;

    if (!this.requesters[url]) {
      this.requesters[url] = {};
    }

    this.requesters[url][id] = { context, abort };
  };

  remove = ({ context }: DataRequester) => {
    const {
      id,
      task: {
        store: { url }
      }
    } = context;

    if (!this.requesters[url]) {
      this.requesters[url] = {};
    }

    if (this.requesters[url][id]) {
      delete this.requesters[url][id];
    }
  };
}
