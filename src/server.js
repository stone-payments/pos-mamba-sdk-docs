import dotenv from 'dotenv';
import express from 'express';
import serve from 'serve-static';
import compression from 'compression';
import { Store } from 'svelte/store.js';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';
import * as sapper from '../__sapper__/server.js';
// import serverConfig from './config.js';
// import createCredentials from './createCredentials.js';

// const { credentials } = serverConfig;

console.log(process.env);

dotenv.config();

const app = express();

const components = p => `${process.cwd()}/mamba-sdk/packages/components/${p}`;

[
  'Icon',
  'Icon/assets',
  'Icon/specialized-icons',
  'Brands',
  'Range/example',
  'Sprite/example',
  'QRCode/example',
].forEach(path => {
  app.use(serve(components(path), { dotfiles: 'ignore', etag: false }));
});

app.use('/framed/assets', express.static(components('Icon/assets')));

app.use(
  bodyParser.json({ limit: '300kb' }),
  compression({ threshold: 0 }),
  serve('static'),
  sapper.middleware({
    store: () =>
      new Store({
        guide_contents: [],
      }),
  }),
);

// const envPort = IS_DEV ? 3000 : process.env.PORT || 8080;
// console.log(`credentials path parsed ${JSON.stringify(credentials, null, 2)}`);
// const secureConfig = IS_DEV ? credentials.dev : credentials.prod;
const host = process.env.HOST || '127.0.0.1';

const httpServer = http.createServer(app, host);
// const httpsServer = https.createServer(createCredentials(secureConfig), app);

httpServer.listen(3000);
// httpsServer.listen(443);
