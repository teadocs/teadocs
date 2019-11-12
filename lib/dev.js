const fs = require('fs-extra')
const Koa = require('koa')
const Router = require('koa-router')
const chalk = require('chalk')
const path = require('path')
const koaStatic = require('koa-static')
const open = require("open")
const chokidar = require('chokidar')
const cheerio = require('cheerio')
const detect = require('detect-port')

const utils = require('./utils')
const build = require('./build')
const CONFIG = require('./config/config')
const load = require('./config/load')

let io = ""
let socket = ""

class Dev {

  constructor(options = {}) {
    this.options = options
    this.port = this.options.port || 3210
    this.host = this.options.host || '0.0.0.0'

    this.sourceDir = process.cwd()
    this.config = load(this.sourceDir, { dev: true })
    this.buildDir = this.config.doc.outDir
  }

  async start() {
    const app = this._createServe()
    
    const webSocket = this._createWebSocket(app)
    
    // Detects if the port is occupied and returns a free port
    // ref: https://github.com/teadocs/teadocs/issues/25
    this.port = await detect(this.port)
    
    webSocket.listen(this.port, this.host, () => {
      console.log('The server is based on ' + this.buildDir + ' directory running on \n' + '[http://' + this.host + ':' + this.port + ']')

      if (this.host === '0.0.0.0') {
        open('http://127.0.0.1:' + this.port, 'chrome')
      } else {
        open('http://' + this.host + ':' + this.port, 'chrome')
      }
    })

    this._watchFile()
  }

  _createServe() {
    const app = new Koa()

    app.use(koaStatic(
      path.join(this.buildDir)
    ))

    let router = new Router()

    router.get('/__webscoket__/socket.client.js', (ctx, next) => {
      let content = utils.readFile(__dirname + "/client-js/socket.client.js")
      ctx.response.body = content
    })

    router.get('/__webscoket__/socket.io.js', (ctx, next) => {
      let content = utils.readFile(__dirname + "/client-js/socket.io.js")
      ctx.response.body = content
    })

    app
      .use(router.routes())
      .use(router.allowedMethods())

    return app
  }

  _createWebSocket(app) {
    const server = require('http').Server(app.callback())
    io = require('socket.io')(server)

    io.sockets.on('connection', function (s) {
      socket = s
    })

    return server
  }

  _watchFile() {
    // 编译间隔：1s，避免 1s 内保存数次文件，触发编译多次的操作
    let count = 0
    const _devBuild = (event, path, action) => {
      if (count === 0) {
        count = 1

        if (event !== 'unlink') {
          const bu = new build.Build({ dev: true })
          if (action === 'hot-replace') {
            // 编译单个md文件
            bu.buildMd({
              input: './' + path,
              output: './' + path
                .replace('docs', 'build')
                .replace('.md', '.html'),
            })
          } else if (action === 'static-hot-replace') {
            const basePath = path.split('/').slice(1).join('/')
            fs.copySync(this.config.doc.staticDir + "/" + basePath, this.buildDir + "/static/" + basePath)
          } else {
            // 全量编译
            bu.build()
          }
        }

        console.clear()
        console.log(chalk.green(">>>"), event + " \"" + path + "\" ")
        console.log(chalk.bgGreen(" DONE ") + " Compiled successfully.")
        console.log('The server is based on ' + this.buildDir + ' directory running on \n' + '[ http://' + this.host + ':' + this.port + ' ]')

        if (action) {
          this._sendMsg(path, action)
        }
      }

      setTimeout(function () {
        count = 0
      }, 1000)
    }

    /**
     * watch themes：全量编译 
     */
    chokidar.watch(this.config.theme.dir + "/").on('all', (event, path) => {
      _devBuild(event, path, "hot-refresh")
    })

    /**
     * watch teadocs.config.js：全量编译
     */
    chokidar.watch(this.sourceDir + "/" + CONFIG.CONFIG_NAME).on('all', (event, path) => {
      _devBuild(event, path, "hot-refresh")
    })

    /**
     * watch tree.md：全量编译
     */
    chokidar.watch(this.config.nav.tree + ".md").on('all', (event, path) => {
      _devBuild(event, path, "hot-refresh")
    })

    /**
     * md 文件修改/新增：编译单个md文件
     * md 文件删除：不编译
     */
    chokidar.watch(this.config.doc.dir + "/").on('all', (event, path) => {
      _devBuild(event, path, "hot-replace")
    })

    /**
     * 用户自定义 static 目录
     */
    chokidar.watch(this.config.doc.staticDir + '/').on('all', (event, path) => {
      _devBuild(event, path, "static-hot-replace")
    })
  }

  _sendMsg(_path, action) {
    if (!socket.emit) return false
    if (action === "hot-replace") {
      let docDir = path.resolve(this.config.doc.dir)
      let buildDir = path.resolve(this.buildDir)
      let cPath = path.resolve(_path)
      cPath = cPath.replace(".md", ".html")
      cPath = cPath.replace(docDir, "")
      cPath = cPath.replace(/\\/g, "/")
      _path = path.resolve(_path)
      _path = _path.replace(".md", ".html")
      _path = _path.replace(docDir, buildDir)
      if (!fs.existsSync(_path)) return
      let html = utils.readFile(_path)
      let $ = cheerio.load(html, { decodeEntities: false })
      let content = $(".markdown-body").html()
      socket.emit('news', { action: action, path: cPath, content: content })
    } else if (action === "hot-refresh") {
      socket.emit('news', { action: action })
    }
  }
}

module.exports = {
  Dev
}