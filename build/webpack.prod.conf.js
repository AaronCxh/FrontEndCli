'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')()
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.cssSourceMap,
      extract: true,
      usePostCSS: true,
    }),
  },
  devtool: config.devtool,
  output: {
    path: config.outputRoot,
    filename: 'js/[name].js',
    // chunkFilename: 'js/chunk.[chunkhash].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': config.env,
    }),

    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      // chunkFilename: 'css/[id].css',
      // filename: 'css/main.[chunkhash].css',
    }),

    /**
     * @return Array<HtmlWebpackPlugin>
     */
    ...utils.createHtmlTemplate({
      minify: false,
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),

    // copy custom static assets
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../static'),
    //     ignore: ['.*'],
    //   },
    // ]),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // styles: {
        //   name: 'styles',
        //   test: /scss|css$/,
        //   chunks: 'all',
        //   enforce: true,
        // },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
        common: {
          // test: (module, chunks) => {
          //   return /[\\/]src[\\/].*\.js/.test(module.nameForCondition())
          // },
          name: 'common',
          minChunks: 2,
          chunks: 'initial',
        },
      },
    },
    runtimeChunk: 'single',
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {},
        },
        sourceMap: config.productionSourceMap,
        parallel: true,
      }),
      // duplicated CSS from different components can be deduped.
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: false } }],
        },
        canPrint: true,
      }),
    ],
  },
})

if (config.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' + config.build.productionGzipExtensions.join('|') + ')$'
      ),
      threshold: 10240,
      minRatio: 0.8,
    })
  )
}

if (config.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
