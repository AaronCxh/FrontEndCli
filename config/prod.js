const path = require('path')
module.exports = {
  env: {
    NODE_ENV: '"production"',
  },
  cssSourceMap: true,
  defineConstants: {},
  devtool: '#source-map',
  assetsSubDirectory: 'assets',
  assetsPublicPath: '/',
  productionSourceMap: false,
  assetsRoot: path.resolve(__dirname, '../dist'),
}
