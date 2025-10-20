'use strict';
require('dotenv').config();
exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || 'iNotebook Backend'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  host: 'collector.newrelic.com',
  logging: {
    level: 'info',
  },
  allow_all_headers: false,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*',
    ],
  },
};
