const { IS_PROD } = require('../../app/constants/env');

const { PORT: PORT_PROD } = require('./env.prod');
const { PORT: PORT_DEV } = require('./env.dev');

module.exports.PORT = IS_PROD ? PORT_PROD : PORT_DEV;
