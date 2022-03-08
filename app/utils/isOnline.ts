import dns from 'dns';

export const isConnected = () =>
  new Promise(resolve => {
    dns.lookup('google.com', err => {
      if (err && err.code === 'ENOTFOUND') {
        resolve(false);
        return null;
      }
      return resolve(true);
    });
  });
