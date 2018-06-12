const fs = require('fs-extra')
const Koa = require('koa')
const chalk = require('chalk')
const path = require('path')
const static = require('koa-static')
const open = require("open")
const chokidar = require('chokidar')

const build = require('./build')
const config = require('./config/config')
const load = require('./config/load')

const TIME = 3000;
let io = ""
module.exports = {

    createWebSocket: function (app) {
        const server = require('http').Server(app.callback())
        io = require('socket.io')(server)

        io.sockets.on('connection', function (socket) {  
            socket.emit('news', { hello: 'world' });  
            socket.on('my other event', function (data) {  
                console.log(data);  
            });
        });

    },

    createServe: function () {
        const app = new Koa()

        const staticPath = this.buildDir
        const port = this.options.port ? this.options.port : 3210
        const host = this.options.host ? this.options.host : '0.0.0.0'
        app.use(static(
            path.join(staticPath)
        ))

        app.listen(port, host, () => {
            console.log('The server is based on ' + staticPath + ' directory running on \n' + '[http://' + host + ':' + port + ']')

            if (host === '0.0.0.0') {
                open('http://127.0.0.1:' + port, 'chrome')
            } else {
                open('http://' + host + ':' + port, 'chrome')
            }
        })
        
        this.createWebSocket(app)
    },

    watchFile: function () {
        let count = 0
        const _devBuild = (event, path) => {
            if (count === 0) {
                console.log(chalk.green("[" + new Date() + "]" + event + ": " + path))
                count = 1
                build.build(this.sourceDir, {
                    dev: true
                })
            }
            setTimeout(function () {
                count = 0;
            }, 2000);
        }

        chokidar.watch(this.config.theme.dir + "/").on('all', _devBuild)
        chokidar.watch(this.config.doc.dir + "/").on('all', _devBuild)
        chokidar.watch(this.sourceDir + "/" + config.CONFIG_NAME).on('all', _devBuild)
        chokidar.watch(this.sourceDir + "/" + config.NAV_NAME).on('all', _devBuild)
    },

    dev: async function (sourceDir, options = {}) {
        console.log("you run: serve")
        console.log("--sourceDir:", sourceDir)
        console.log("--options:", options)
        console.log(__dirname);
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