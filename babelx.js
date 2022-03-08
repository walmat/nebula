const config = require('./babel.config');

// eslint-disable-next-line no-global-assign
require = require('esm')(module, {
  mainFields: ['module'],
  force: true
});

require('@babel/register')({
  ...config,
  extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx']
});

require(process.argv[2]);
