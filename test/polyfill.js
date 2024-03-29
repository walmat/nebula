/* eslint-disable func-names */

import fetch from 'isomorphic-fetch';

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  // eslint-disable-next-line global-require
  require('promise/lib/rejection-tracking').enable();
  // eslint-disable-next-line global-require
  window.Promise = require('promise/lib/es6-extensions');
}

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');

global.fetch = fetch;

// localStorage mock
const localStorageMock = (function () {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();
global.localStorage = localStorageMock;
