const webpack = require('webpack');
const path = require('path');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const cssProcessor = require('cssnano');
const loaders = require('./helpers/loaders');
const { fromWorkspace, fromProject } = require('./helpers/paths');
const pkg = require('../package.json');
const mode = process.env.NODE_ENV;

const {
  BUNDLE_NAME,
  IS_POS,
  DEBUG_LVL,
  IS_BROWSER,
  IS_DEV,
  IS_PROD,
  NODE_ENV,
  APP_ENV,
} = require('@mamba/webpack/helpers/consts.js');

module.exports = function createWebpackConfig(type) {
  return {
    // Sapper just ignore this property
    stats: 'verbose',

    resolve: {
      symlinks: false,
      mainFields: ['svelte', 'browser', 'module', 'main', 'dist'],
      extensions: ['.js', '.json', '.css', '.pcss', '.html'],
      // modules: [
      //   path.resolve(
      //     __dirname,
      //     '../mamba-sdk/packages/styles/src/assets/fonts',
      //   ),
      // ],
      alias: {
        '@components': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/',
        ),
        '@mamba/app': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/App',
        ),
        '@mamba/appbar': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/AppBar',
        ),
        '@mamba/barcode': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Barcode',
        ),
        '@mamba/brands': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Brands',
        ),
        '@mamba/button': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Button',
        ),
        '@mamba/carousel': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Carousel',
        ),
        '@mamba/collection': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Collection',
        ),
        '@mamba/container': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Container',
        ),
        '@mamba/dialog': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Dialog',
        ),
        '@mamba/flatlist': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Flatlist',
        ),
        '@mamba/icon': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Icon',
        ),
        '@mamba/input': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Input',
        ),
        '@mamba/printable': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Printable',
        ),
        '@mamba/progress': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Progress',
        ),
        '@mamba/qrcode': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/QRCode',
        ),
        '@mamba/radio': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Radio',
        ),
        '@mamba/range': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Range',
        ),
        '@mamba/sprite': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Sprite',
        ),
        '@mamba/switch': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Switch',
        ),
        '@mamba/tabs': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Tabs',
        ),
        '@mamba/toast': path.resolve(
          __dirname,
          '../mamba-sdk/packages/components/Toast',
        ),
        '@mamba/styles': path.resolve(
          __dirname,
          '../mamba-sdk/packages/styles',
        ),
        '@mamba/pos': path.resolve(__dirname, '../mamba-sdk/packages/pos'),
        '@mamba/utils': path.resolve(__dirname, '../mamba-sdk/packages/utils'),
        './assets/fonts/': path.resolve(
          __dirname,
          '../mamba-sdk/packages/styles/src/assets/fonts/',
        ),
      },
    },
    /* node: {
      __dirname: false,
    }, */
    module: {
      rules: [
        {
          test: /NAV_COMPONENTS$/,
          exclude: [/node_modules/],
          loader: require.resolve('./navigation-loader'),
          options: {
            localPath: path.join(
              __dirname,
              '..',
              'mamba-sdk/packages/components',
            ),
          },
        },
        {
          test: /\.(html|svelte)$/,
          exclude: [/node_modules/],
          // include: [/mamba-sdk\/packages\/.+\/src/],
          use: [loaders.babel, loaders.svelte(type)],
        },
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, '../src')],
          exclude: [/node_modules/],
          use: [loaders.babel],
        },
        {
          test: /\.(css|pcss)$/,
          resolve: { mainFields: ['style', 'main'] },
          // include: [/mamba-sdk\/packages\/.+\/src/],
          exclude: [/node_modules/],
          use: [
            loaders.styleLoader,
            loaders.css,
            loaders.postcss,
            loaders.resolveUrl,
          ],
        },
        {
          test: /\.(eot|woff2?|otf|ttf)$/,
          use: loaders.fonts,
          exclude: [/node_modules/],
        },
        {
          test: /\.(gif|jpe?g|png|ico)$/,
          include: [/assets/, /\/assets\/images\//, /\/example\/static\//],
          use: loaders.images,
        },
        {
          test: /\.svg$/,
          use: loaders.icons,
        },
        {
          test: /\.md$/,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            emitFile: false,
            context: '',
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __NODE_ENV__: JSON.stringify(NODE_ENV),
        __APP_ENV__: JSON.stringify(APP_ENV),
        __PROD__: IS_PROD,
        __STAGING__: NODE_ENV === 'staging',
        __TEST__: NODE_ENV === 'test',
        __DEV__: IS_DEV,
        __POS__: IS_POS,
        __BROWSER__: IS_BROWSER,
        __DEBUG_LVL__: DEBUG_LVL,
      }),
    ],
    mode,
    optimization: {
      minimize: IS_PROD,
      minimizer: [
        /** Minify the bundle's css */
        new OptimizeCSSAssetsPlugin({
          /** Default css processor is 'cssnano' */
          cssProcessor,
          cssProcessorOptions: {
            core: IS_PROD,
            discardComments: IS_PROD,
            autoprefixer: false,
          },
        }),
        /** Minify the bundle's js */
        new UglifyJsPlugin({
          cache: true, // Enables file caching
          parallel: true, // Use multiple CPUs if available,
          sourceMap: false, // Enables sourcemap
          uglifyOptions: {
            compress: {
              reduce_funcs: false,
              keep_fnames: false,
              /** Functions that doesn't have side-effects */
              pure_funcs: [
                'classCallCheck',
                '_classCallCheck',
                '_possibleConstructorReturn',
                'Object.freeze',
                'invariant',
                'warning',
              ],
            },
            mangle: {
              keep_fnames: false,
              /** Prevent renaming of `process.env...` */
              reserved: ['process'],
            },
            output: {
              comments: false,
            },
          },
        }),
      ],
    },
  };
};
