const package = require('../package.json')
const fs = require('fs')
const path = require('path')
const { log } = require('./utils')
const shell = require('shelljs')
const pages = require('../pages.json')
const minimist = require('minimist')

const args = minimist(process.argv.slice(2), {
  alias: {
    version: ['v'],
    help: ['h'],
  },
  boolean: ['version', 'help'],
})

const _ = args._
let srcRoot = path.join(process.cwd(), './src')
let pageRoot = path.join(srcRoot, './pages')
let page = _[0]
let pageTitle = args.name


if (!page || !pageTitle) {
  log.error('Usage: yarn|npm new <page> <--name=pageTitle>')
  shell.exit(1)
}
let dir = path.join(pageRoot, page)


if (fs.existsSync(dir)) {
  log.error(`已存在页面${page}`)
  shell.exit(1)
}
if (!pageTitle) {
}

page = page.split('/')[1] ? page.split('/')[1] : page.split('/')[0]
let pagePath = (dir + `/${page}`).split(`\\src\\`)[1].replace(/\\/gi, '/')

pages.push({
  title: pageTitle,
  chunk: page,
  url: pagePath,
})

// let scss = `@import "${path
//   .relative(dir, path.join(__dirname, '../src/scss'))
//   .replace(/\\/gi, '/')}/minxi/minxi.scss";
// @import "${path
//   .relative(dir, path.join(__dirname, '../src/scss'))
//   .replace(/\\/gi, '/')}/variable/variable.scss";
// `
let scss = `@import "@/scss/minxi/minxi.scss";
       @import "@/scss/variable/variable.scss";`

fs.mkdirSync(dir)
// console.log(page)
fs.writeFileSync(path.join(dir, `${page}.js`), '')
fs.writeFileSync(path.join(dir, `${page}.scss`), scss)


fs.writeFileSync(
  path.join(dir, `${page}.html`),
  fs.readFileSync(path.resolve(__dirname, 'index.html'), { encoding: 'utf-8' })
)

fs.writeFileSync(
  path.resolve(__dirname, `../pages.json`),
  JSON.stringify(pages, null, 2)
)

log.info(`成功创建页面${page}，需要重启服务...`)
