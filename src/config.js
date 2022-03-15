const path = require('path')

module.exports = {
  credentials: {
    dev: {
      key: process.env.HTTPS_KEY_PATH
        ? process.env.HTTPS_KEY_PATH
        : path.join(process.cwd(), 'localhost.key'),
      cert: process.env.HTTPS_CERT_PATH
        ? process.env.HTTPS_CERT_PATH
        : path.join(process.cwd(), 'localhost.cert'),
      requestCert: false,
      rejectUnauthorized: false,
    },
    prod: {
      key: process.env.HTTPS_KEY_PATH
        ? process.env.HTTPS_KEY_PATH
        : path.join(process.cwd(), 'localhost.key'),
      cert: process.env.HTTPS_CERT_PATH
        ? process.env.HTTPS_CERT_PATH
        : path.join(process.cwd(), 'localhost.cert'),
      ca: JSON.parse(process.env.HTTPS_CA_PATH_LIST || '[]'),
    },
  },
}
