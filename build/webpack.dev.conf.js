'use strict'

const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')()
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.cssSourceMap,
      usePostCSS: true,
    }),
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join(config.assetsPublicPath, 'index.html'),
        },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: config.host,
    port: PORT || config.port,
    open: config.autoOpenBrowser,
    overlay: config.errorOverlay ? { warnings: false, errors: true } : false,
    publicPath: config.assetsPublicPath,
    proxy: config.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.poll,
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev').env,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),

    /**
     * @return Array<HtmlTemplatePlugin>
     */
    ...utils.createHtmlTemplate(),
  ],
})

module.exports = new Promise((resolve, reject) => {
  // resolve(devWebpackConfig)
  portfinder.basePort = process.env.PORT || config.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`,
            ],
          },
          onErrors: config.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined,
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
