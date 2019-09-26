const fs = require('fs-extra')
const path = require('path')
const utils = require('../utils')
const chalk = require('chalk')
const config = require('./config')
const marked = require('marked')
const cheerio = require('cheerio')

const parseTree = function (mdTree) {
    let htmlTree = marked(mdTree)
    let $ = cheerio.load(htmlTree, { decodeEntities: false })
    let liEles = $("ul li")
    liEles.each((i, elem) => {
        let title = ""
        if ( $(elem).children("a").length === 0 ) {
            title = $(elem).text().split("\n")[0]
            subUl = $(elem).children("ul")
            $(elem).text("")
            $(elem).prepend("<a>" + title + "</a>")
            $(elem).append(subUl)
        }
        title = $(elem).children("a").text()
        if ( title[0] === "+" ) {
            $(elem).children("a").text(title.replace("+", ""))
            $(elem).children("ul").attr("data-show", "1")
        }
    })
    return $("body").html()
}

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
            dir: path.resolve(__dirname, '../themes/default'),
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
        newConfig.nav.treeHtml = parseTree(utils.readFile(newConfig.nav.tree + ".md"))
    }
    let _config = {}
    if ( options.dev ) {
        _config = newConfig;
        _config.doc.outDir = defaultConfig.doc.outDir;
        _config.theme.rootPath = defaultConfig.theme.rootPath;
    } else {
        _config = newConfig;
    }
    return _config
}
