/**
 * Constants
 * Note: Don't import log helper file from utils here
 */

module.exports.IS_DEV = process.env.NODE_ENV !== 'production';

module.exports.IS_PROD = process.env.NODE_ENV === 'production';

module.exports.DEBUG_PROD = false;

module.exports._LEVEL = 'silly';
