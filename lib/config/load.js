const fs = require('fs-extra')
const path = require('path')
const utils = require('../utils')
const chalk = require('chalk')
const config = require('./config')

module.exports = function (docsDir, options = {}) {
    const configPath = path.resolve(docsDir, config.CONFIG_NAME)
    const defaultConfig = {
        doc: {
            name: "欢迎使用Teadocs文档生成系统",
            description: "欢迎使用Teadocs文档生成系统",
            version: "0.0.1",
            dir: "./docs",
            outDir: "./build",
            staticDir: "./static"
        },
        theme: {
            dir: __dirname + '/../themes/default',
            title: "欢迎使用Teadocs文档生成系统",
            headHtml: `
            <meta name="description" content="欢迎使用Teadocs文档生成系统" />
            <meta name="keywords" content="teadocs, 文档生成器" />
            `,
            footerHtml: "",
            isMinify: false,
            rootPath: "/"
        },
        nav: {
            tree: "<ul><li><a>欢迎使用Teadocs文档生成系统</a></li></ul>"
        }
    }
    // resolve siteConfig
    let siteConfig = {}
    if (fs.existsSync(configPath)) {
        if ( options.dev ) {
            delete require.cache[configPath]
        }
        siteConfig = require(configPath)
    } else {
        console.log(chalk.red("The configuration file does not exist"))
        process.exit(1)
    }

    let newConfig = {
        doc: utils.mergeObj(siteConfig.doc, defaultConfig.doc),
        theme: utils.mergeObj(siteConfig.theme, defaultConfig.theme),
        nav: utils.mergeObj(siteConfig.nav, defaultConfig.nav)
    }

    if (newConfig.nav.tree[0] !== "<") {
        newConfig.nav.treeHtml = utils.readFile(newConfig.nav.tree)
    }
    return newConfig
}
