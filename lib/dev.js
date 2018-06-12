const fs = require('fs-extra')
const Koa = require('koa')
const Router = require('koa-router');
const chalk = require('chalk')
const path = require('path')
const static = require('koa-static')
const open = require("open")
const chokidar = require('chokidar')
const cheerio = require('cheerio')

const utils = require('./utils')
const build = require('./build')
const config = require('./config/config')
const load = require('./config/load')

let io = ""
let socket = ""
module.exports = {

    sendMsg: function (_path) {
        let docDir = path.resolve(this.config.doc.dir)
        let buildDir = path.resolve(this.buildDir)
        let cPath = path.resolve(_path)
        cPath = cPath.replace(".md", ".html")
        cPath = cPath.replace(docDir, "")
        _path = path.resolve(_path)
        _path = _path.replace(".md", ".html")
        _path = _path.replace(docDir, buildDir)
        let html = utils.readFile(_path)
        let $ = cheerio.load(html, { decodeEntities: false })
        let content = $(".markdown-body").html()
        socket.emit('news', { path: cPath, content: content })
    },

    createWebSocket: function (app) {
        const server = require('http').Server(app.callback())
        io = require('socket.io')(server)

        io.sockets.on('connection', function (s) {  
            socket = s
        })

        return server
    },

    createServe: function () {
        const app = new Koa()

        const staticPath = this.buildDir
        const port = this.options.port ? this.options.port : 3210
        const host = this.options.host ? this.options.host : '0.0.0.0'

        app.use(static(
            path.join(staticPath)
        ))

        let router = new Router();
 
        router.get('/__webscoket__/socket.client.js', (ctx, next) => {
            let content = utils.readFile(__dirname + "/client-js/socket.client.js")
            ctx.response.body = content
        });

        router.get('/__webscoket__/socket.io.js', (ctx, next) => {
            let content = utils.readFile(__dirname + "/client-js/socket.io.js")
            ctx.response.body = content
        });

        app
        .use(router.routes())
        .use(router.allowedMethods());

        let webSocket = this.createWebSocket(app)

        webSocket.listen(port, host, () => {
            console.log('The server is based on ' + staticPath + ' directory running on \n' + '[http://' + host + ':' + port + ']')

            if (host === '0.0.0.0') {
                open('http://127.0.0.1:' + port, 'chrome')
            } else {
                open('http://' + host + ':' + port, 'chrome')
            }
        })
    },

    watchFile: function () {
        let count = 0
        const _devBuild = (event, path, type) => {
            if (count === 0) {
                console.log(chalk.green("[" + new Date() + "]" + event + ": " + path))
                count = 1
                build.build(this.sourceDir, {
                    dev: true
                }) 
                if ( type === "doc" ) {
                    this.sendMsg(path)
                }
            }
            setTimeout(function () {
                count = 0
            }, 1000)
        }

        chokidar.watch(this.config.theme.dir + "/").on('all', _devBuild)
        chokidar.watch(this.config.doc.dir + "/").on('all', (event, path)=>{
            _devBuild(event, path, "doc")
        })
        chokidar.watch(this.sourceDir + "/" + config.CONFIG_NAME).on('all', _devBuild)
        chokidar.watch(this.sourceDir + "/" + config.NAV_NAME).on('all', _devBuild)
    },

    dev: async function (sourceDir, options = {}) {
        console.log("you run: serve")
        console.log("--sourceDir:", sourceDir)
        console.log("--options:", options)
        console.log(__dirname)
        this.isDev = __dirname.index

        this.sourceDir = sourceDir
        this.options = options
        this.config = load(sourceDir)
        this.buildDir = this.config.doc.outDir

        //create serve
        this.createServe()
        //watch file
        this.watchFile()
    }
}