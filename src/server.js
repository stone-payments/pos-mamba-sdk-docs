import dotenv from 'dotenv';
import express from 'express';
import serve from 'serve-static';
import compression from 'compression';
import { Store } from 'svelte/store.js';
import * as sapper from '../__sapper__/server.js';
import http from 'http';
import https from 'https';
import fs from 'fs';
import serverConfig from './config.js';
import createCredentials from './createCredentials.js';

const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = process.env.NODE_ENV === 'production';

const {
  server: { credentials, port },
} = serverConfig;

dotenv.config();

const app = express();

const serveMisc = [
  'Icon',
  'Range/example',
  'Sprite/example',
  'QRCode/example',
].map(path =>
  serve(`packages/components/${path}`, { dotfiles: 'ignore', etag: false }),
);

app.use(
  compression({ threshold: 0 }),
  serve('static'),
  serveMisc,
  sapper.middleware({
    store: req => {
      return new Store({
        guide_contents: [],
      });
    },
  }),
);

const secureConfig = IS_DEV ? credentials.dev : credentials.prod;
const envPort = process.env.PORT || 3000;

const httpServer = http.createServer(app);
const httpsServer = https.createServer(createCredentials(secureConfig), app);

httpServer.listen(envPort);
httpsServer.listen(443);
