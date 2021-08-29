const loaderutils = require('loader-utils')
const fs = require('fs')

function loader(content, options) {
  const html = fs.readFileSync(options.layout, { encoding: 'utf-8' })
  content = html.replace('{{__content__}}', content)
  return `export default ${JSON.stringify(content)}`
}

module.exports = function (content) {
  const options = loaderutils.getOptions(this)
  // const callback = this.async()
  // this.addDependency(options.layout)
  return loader(content, options)
  // return callback(null, someSyncOperation(content, options))
  /* someAsyncOperation(content, function (err, result, sourchMaps, ast) {
    callback(null, result, sourchMaps, ast)
  }) */
}

// module.exports.pitch = function (remainingRequest, precedingRequest, data) {
//   data.value = 42
// }
/* 通过设置raw, loader可以接受原始的Buffer.每一个loader都可以用string或Buffer的形式传递它的处理结果 */
// module.exports.raw = true
