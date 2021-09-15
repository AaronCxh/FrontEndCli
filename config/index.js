// eslint-disable-next-line import/no-commonjs
const path = require('path')

const config = {
  projectName: 'web',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  assetsPublicPath: '/',
  sourceRoot: 'src',
  outputRoot: path.resolve(__dirname, '../dist'),
  cssSourceMap: true,
  assetsSubDirectory: 'assets',
  copy: {
    patterns: [],
  },
  showEslintErrorsInOverlay: true,
}

module.exports = function () {
  if (process.env.NODE_ENV === 'production') {
    return Object.assign({}, config, require('./prod'))
  }
  return Object.assign({}, config, require('./dev'))
}
