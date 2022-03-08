/* eslint-disable no-restricted-syntax */
import { ipcMain } from 'electron';

import { IPCKeys } from '../../../constants/ipc';

export class AsyncQueue {
  _backlog: any[];

  _waitQueue: any[];

  constructor() {
    this._backlog = [];
    this._waitQueue = [];
  }

  get backlogLength() {
    return this._backlog.length;
  }

  get lineLength() {
    return this._waitQueue.length;
  }

  insert(datum: any) {
    // Check if we have anybody waiting for data
    if (this._waitQueue.length) {
      // Get the resolution and invoke it with the data
      const resolution = this._waitQueue.pop();
      resolution.request.status = 'fulfilled';
      resolution.request.value = datum;
      resolution.resolve(datum);
    } else {
      // Add data to the backlog
      this._backlog.unshift(datum);
    }
    return this._backlog.length;
  }

  next() {
    // initialize request
    const nextRequest: any = {
      status: 'pending', // status of the request
      cancel: null, // function to cancel the request with a given reason
      promise: null, // the async promise that is waiting for the next value
      reason: '', // the reason for cancelling the request
      value: null // the resolved value
    };

    // Check if we don't have any waiters and we do have a backlog
    if (!this._waitQueue.length && this._backlog.length) {
      // return from the backlog immediately
      const value = this._backlog.pop();
      const promise = Promise.resolve(value);
      return {
        ...nextRequest,
        status: 'fulfilled',
        promise,
        value
      };
    }

    // Setup request promise and cancel function
    nextRequest.promise = new Promise((resolve, reject) => {
      nextRequest.cancel = (reason = 'Abort detected') => {
        nextRequest.status = 'cancelled';
        nextRequest.reason = reason;
        this._waitQueue = this._waitQueue.filter(
          r => r.request !== nextRequest
        );
        reject(reason);
      };
      this._waitQueue.push({ resolve, reject, request: nextRequest });
    }).catch(() => {});

    return nextRequest;
  }

  clear() {
    // Remove all items from the backlog if they exist
    this._backlog = [];
  }

  destroy() {
    // Reject all resolutions in the wait queue
    this._waitQueue.forEach(({ reject, request }) => {
      request.status = 'destroyed';
      request.reason = 'Queue was destroyed';
      reject('Queue was destroyed');
    });
    this._waitQueue = [];

    // Remove all items from the backlog if they exist
    this.clear();
  }
}

export class Queue {
  data: any;

  constructor() {
    this.data = [];
  }

  enqueue(datum: any) {
    this.data.push(datum);
  }

  dequeue() {
    return this.data.shift();
  }

  isEmpty() {
    return this.data.length === 0;
  }

  peek() {
    return !this.isEmpty() ? this.data[0] : undefined;
  }

  length() {
    return this.data.length;
  }
}

export class CapacityQueue {
  _stack: any;

  _size: number;

  constructor(data = [], size = 100) {
    this._stack = data;
    this._size = size;
  }

  insert(datum = {}) {
    this._stack.push(datum);

    if (this._stack.length > this._size) {
      this.shift();
    }
  }

  pop() {
    this._stack.pop();
  }

  shift() {
    this._stack.shift();
  }

  toString() {
    return this._stack.toString();
  }
}

export type Jobs = {
  [group: string]: {
    [id: string]: Job;
  };
};

export type Job =
  | {
      id: string;
      group: string;
    }
  | any;

export class StaggeredQueue {
  cache: {
    [group: string]: number;
  };

  stagger: number;

  jobs: Jobs;

  intervals: {
    [group: string]: any;
  };

  resetters: {
    [group: string]: any;
  };

  constructor(shouldRegister = true, stagger = 5) {
    this.cache = {};
    this.stagger = stagger;
    this.jobs = {};
    this.intervals = {};
    this.resetters = {};

    if (shouldRegister) {
      ipcMain.on(IPCKeys.ChangeStagger, (_, stagger) => {
        const amount = Number(stagger);

        if (!amount || Number.isNaN(amount)) {
          this.stagger = 1;
          Object.keys(this.jobs).forEach(group => {
            this.cache[group] = 1;
          });

          return;
        }

        this.stagger = amount;
        Object.keys(this.jobs).forEach(group => {
          this.cache[group] = amount;
        });
      });
    }
  }

  check = (group: string) => {
    if (!Object.values(this.jobs[group]).length) {
      clearInterval(this.intervals[group]);
      this.intervals[group] = null;

      return;
    }

    for (const job of Object.values(this.jobs[group])) {
      if (this.cache[group] === 0) {
        break;
      }

      const { callback, ...data } = job;
      callback(data);

      delete this.jobs[group][job.id];
      this.cache[group] -= 1;
    }
  };

  start = (group: string) => {
    if (this.resetters[group]) {
      return;
    }

    this.resetters[group] = setInterval(
      () =>
        Object.keys(this.jobs).forEach(group => {
          if (this.stagger === this.cache[group]) {
            clearInterval(this.resetters[group]);
            this.resetters[group] = null;

            return;
          }

          this.cache[group] = this.stagger;
        }),
      250
    );
  };

  process = (group: string) => {
    if (this.intervals[group]) {
      return;
    }

    this.check(group);
    this.intervals[group] = setInterval(() => this.check(group), 250);
  };

  getJob = (group: string, id: string) => {
    if (!this.jobs[group]) {
      this.jobs[group] = {};
    }

    return this.jobs[group][id];
  };

  removeJob = (group: string, id: string) => {
    if (!this.jobs[group]) {
      this.jobs[group] = {};
    }

    delete this.jobs[group][id];
  };

  add = (group: string, id: string, callback: any, ...args) => {
    if (!this.jobs[group]) {
      this.jobs[group] = {};
    }

    // we wanna delete and insert to the end in this case
    if (this.jobs[group][id]) {
      delete this.jobs[group][id];
    }

    this.jobs[group][id] = {
      id,
      group,
      callback,
      ...args.reduce(
        (prev, current) => ({
          ...prev,
          ...current
        }),
        {}
      )
    };

    this.process(group);
    this.start(group);
  };

  clear = () => {
    Object.keys(this.jobs).forEach(group => {
      this.jobs[group] = {};
    });
  };
}
