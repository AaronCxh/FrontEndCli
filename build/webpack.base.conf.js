'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')()
const CopyWebpackPlugin = require('copy-webpack-plugin')
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    emitWarning: !config.showEslintErrorsInOverlay,
  },
})

const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
module.exports = {
  mode: config.env.NODE_ENV === '"development"' ? 'development' : 'production',
  context: path.resolve(__dirname, '../'),
  entry: utils.createEntryPage(),
  // entry: {
  //   app: './src/app.js',
  // },
  output: {
    path: config.outputRoot,
    filename: 'js/[name].bundle.js',
    // chunkFilename: 'js/[id].[chunkhash].js',
    publicPath: config.assetsPublicPath,
  },
  externals: {
    jquery: 'jQuery',
    vue: 'Vue',
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src'),
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  module: {
    rules: [
      ...(config.useEslint ? [createLintingRule()] : []),
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@vue/babel-preset-jsx'],
          },
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: utils.cssLoaders({
            sourceMap: sourceMapEnabled,
            extract: isProduction,
          }),
          cssSourceMap: sourceMapEnabled,
          cacheBusting: true,
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href',
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false,
              attributes: {
                list: [
                  {
                    tag: 'img',
                    attribute: 'src',
                    type: 'src',
                  },
                  {
                    tag: 'image',
                    attribute: 'href',
                    type: 'src',
                  },
                  {
                    tag: 'audio',
                    attribute: 'src',
                    type: 'src',
                  },
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'image/[hash:7].[ext]',
          publicPath: '/',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        ignore: ['js/jquery-1.11.0.js'],
      },
    ]),
    ...utils.createHtmlTemplate({
      minify: false,
    }),
  ],
}
