// eslint-disable-next-line import/no-commonjs
const path = require('path')

// const outputRootStrtegy = {
//   h5: 'dist_h5',
//   weapp: 'dist_weapp',
//   alipay: 'dist_alipay',
//   swan: 'dist_swan',
//   ['undefined']: 'dist',
// }
// const env = JSON.parse(process.env.npm_config_argv).cooked[1].split(':')[1]

// const outputRoot = outputRootStrtegy[env]

const config = {
  projectName: '亚信',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2,
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
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 10240, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    output: {
      filename: 'js/bundle.[hash:8].js',
      chunkFilename: 'js/chunk.[chunkhash:8].js',
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8'],
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[local]__[hash:base64:5]',
        },
      },
    },
    devServer: {
      port: 8080,
    },
  },
}

module.exports = function () {
  if (process.env.NODE_ENV === 'production') {
    return Object.assign({}, config, require('./prod'))
  }
  return Object.assign({}, config, require('./dev'))
}
