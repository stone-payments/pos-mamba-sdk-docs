const path = require('path');

const cas = process.env.HTTPS_CA_PATH_LIST;

const certs = {
  key: process.env.HTTPS_KEY_PATH ? process.env.HTTPS_KEY_PATH : path.join(process.cwd(), 'localhost.key'),
  cert: process.env.HTTPS_CERT_PATH ? process.env.HTTPS_CERT_PATH : path.join(process.cwd(), 'localhost.cert'),
};

if (process.env.HTTPS_CA_PATH_LIST) {
  try {
    certs.ca = String(process.env.HTTPS_CA_PATH_LIST)
      .split(',')
      .map(f => String(f).trim());
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  credentials: {
    dev: {
      ...certs,
      requestCert: false,
      rejectUnauthorized: false,
    },
    prod: certs,
  },
};
