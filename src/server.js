import dotenv from 'dotenv'
import express from 'express'
import serve from 'serve-static'
import compression from 'compression'
import { Store } from 'svelte/store.js'
import http from 'http'
import https from 'https'
import serverConfig from './config.js'
import * as sapper from '../__sapper__/server.js'
import createCredentials from './createCredentials.js'

const IS_DEV = process.env.NODE_ENV === 'development'

const {
  server: { credentials },
} = serverConfig

dotenv.config()

const app = express()

const serveMisc = [
  'Icon',
  'Range/example',
  'Sprite/example',
  'QRCode/example',
].map(path =>
  serve(`packages/components/${path}`, { dotfiles: 'ignore', etag: false }),
)

if(!IS_DEV) {
  app.enable('trust proxy');
  
  app.use(function(req, res){
    if(!req.secure){
      res.redirect(`https://${req.headers.host}${req.url}`);
    }
  });
}

app.use(
  compression({ threshold: 0 }),
  serve('static'),
  serveMisc,
  sapper.middleware({
    store: () =>
      new Store({
        guide_contents: [],
      }),
  }),
)

const secureConfig = IS_DEV ? credentials.dev : credentials.prod
const envPort = IS_DEV ? 3000 : 80

const httpServer = http.createServer(app)
const httpsServer = https.createServer(createCredentials(secureConfig), app)

httpServer.listen(envPort)
httpsServer.listen(443)
