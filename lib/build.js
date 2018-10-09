const fs = require('fs-extra')
const cheerio = require('cheerio')
const path = require('path')
const ejs = require('ejs')
const chalk = require('chalk')

const load = require('./config/load')
const utils = require('./utils')
const parse = require('./markdown/parse')
const renderConst = require('./config/render')
const minifyJs = require('./minify/minifyJS')
const minifyHTML = require('./minify/minifyHTML')

const devHTML = `
<script src="/__webscoket__/socket.io.js"></script>
<script src="/__webscoket__/socket.client.js"></script>
`

module.exports = {
    rebuild() {
        console.log("remove build dir.")
        utils.remove(this.buildDir)
        console.log("make build dir.")
        utils.mkdirs(this.buildDir)
        console.log("copy static to build dir.")
        fs.copySync(this.config.theme.dir + "/static", this.buildDir + "/static")
        if ( fs.existsSync(this.config.doc.staticDir) ) {
            let files = fs.readdirSync(this.config.doc.staticDir)
            files.forEach(name => {
                fs.copySync(this.config.doc.staticDir + "/" + name, this.buildDir + "/static/" + name)
            })
        }
    },

    writeSearchData(searchDataset) {
        let dataTpl = utils.readFile(__dirname + "/client-js/dataTpl.js")
        dataTpl = dataTpl.replace("'content';", "<%- content %>;")
        let jsContent = ejs.render(dataTpl, {
            content: searchDataset
        })
        console.log("wrtie data of the search:", this.buildDir + "/data.js")
        let minifyJsCode = minifyJs.compressJs(jsContent)
        utils.writeFile(this.buildDir + "/data.js", minifyJsCode)
        console.log(chalk.bgGreen(" DONE ") + " Compiled successfully.")
        if ( !this.options.dev ) {
            process.exit(1)
        }
    },

    writeHtml() {
        let errorFrameHtml = ""
        let $ = cheerio.load(this.config.nav.treeHtml, { decodeEntities: false })
        $("ul").eq(0).addClass("tea-menu-list")
        let tagsA = $("ul li a")
        let paths = []
        let searchDataset = []
        tagsA.each((i, elem) => {
            let siblings = $(elem).siblings()
            let href = $(elem).attr("href")
            let title = $(elem).text()
            $(elem).attr("title", title)
            if ( siblings.length > 0 ) {
                $(elem).append($("<i class='fa fa-angle-down'></i>"))
            }
            if ( href ) {
                href = utils.escapeSlash(href)
                if ( href[href.length-1] === "/" ) {
                    href = href + "index"
                }
                $(elem).attr("href", this.rootPath + href + ".html")
                paths.push({
                    node: $(elem),
                    title: title,
                    input: this.config.doc.dir + href + ".md",
                    output: this.buildDir + href + ".html"
                })
            }
        })
        paths.forEach((path, index) => {
            let activeA = $("a.active")
            activeA.each((i, elem) => {
                $(elem).removeClass("active")
            })

            let unfoldis = $("i.unfold")
            unfoldis.each((i, elem) => {
                $(elem).removeClass("unfold")
            })

            let unfoldUls = $("ul.unfold")
            unfoldUls.each((i, elem) => {
                $(elem).removeAttr("class")
            })

            tagsA.each((i, elem) => {
                let title = $(elem).text()
                let href = $(elem).attr('href')
                let _href = href
                if ( typeof href === "string" ) {
                    _href = href.substring(this.rootPath.length)
                }
                if ( title === path.title && 
                    (this.buildDir + _href) === path.output ) {
                    let parents = $(elem).parents()
                    parents.each((i, parent) => {
                        if ( parent.name === 'li' ) {
                            $(parent).children("a").addClass("active")
                        }
                    })
                }
            })

            //show for attr as 1 
            let ulEles = $("ul[data-show='1']")
            ulEles.each((i, elem) => {
                $(elem).prev().find("i").addClass("unfold")
                $(elem).addClass("unfold")
            })
            //show activated elements
            ulEles =  $("a.active")
            ulEles.each((i, elem) => {
                $(elem).find("i").addClass("unfold")
                $(elem).next().addClass("unfold")
            })

            //remove attr data-show
            let _html = $.html()
            let _$ = cheerio.load(_html, { decodeEntities: false })
            ulEles = _$("ul[data-show='1']")
            ulEles.each((i, elem) => {
                _$(elem).removeAttr("data-show")
            })

            if ( !fs.existsSync(path.input) ) {
                utils.writeFile(path.input, "# " + path.title)
            }
            let mdNativeContent = utils.readFile(path.input)
            mdNativeContent = ejs.render(mdNativeContent, this.data)
            let mdHtmlContent = parse(mdNativeContent)
            this.data.__MARKDOWN_CONTENT__ = mdHtmlContent
            this.data.__CUR_TITLE__ = path.title
            this.data.__NAV_HTML__ = _$.html()

            let htmlContent = ejs.render(this.themeBase, this.data)
            if ( this.config.theme.isMinify ) {
                htmlContent = minifyHTML(htmlContent)
            }
            console.log(chalk.green(">>>"), "output:", path.output)
            searchDataset.push({
                context: this._getParents($, path.node),
                content: mdHtmlContent
            })

            if ( this.options.dev ) {
                htmlContent = htmlContent + devHTML
            }

            if ( path.output !== this.buildDir + "/index.html" ) {
                htmlContent = this._mixinHead(htmlContent)
            } else {
                errorFrameHtml = htmlContent
            }
            utils.writeFile(path.output, htmlContent)
        })
        //build error page
        this._buildErrorPage(errorFrameHtml)
        //build search data
        this.writeSearchData(JSON.stringify(searchDataset))
    },

    _getParents($, node) {
        let nodeParents = node.parents()
        let liParents = [{
            title: $(node).text(),
            link: $(node).attr("href")
        }]
        nodeParents.each((i, elem) => {
            if ( i > 0 && elem.name === "li" ) {
                let _a = $(elem).children("a")
                let title = $(_a).text()
                let link = $(_a).attr("href")
                liParents.push({
                    title: title,
                    link: link ? link : "javascript:void(0)"
                })
            }
        })
        return liParents.reverse()
    },

    _buildErrorPage(errorFrameHtml) {
        let $ = cheerio.load(errorFrameHtml, { decodeEntities: false })
        let p404 = {
            title:  "页面未找到 - " + this.config.doc.name,
            path: this.buildDir + "/teadocs_error_pages/404.html",
            description: "404错误！该页面未找到，试试从左边菜单栏访问别的页面，或者从左上角搜索你想要的内容。"
        }
        $(".top-title span").text('404页面未找到')
        $("meta[name='keywords']").attr("content", p404.title)
        $("meta[name='description']").attr("content", p404.description)
        $("title").text(p404.title)
        $("article.markdown-body").html(p404.description)
        console.log(chalk.green(">>>"), "output:", p404.path)
        let liEls = $("ul > li > a.active")
        liEls.each((i, elem) => {
            $(elem).removeClass("active")
        })
        utils.writeFile(p404.path, $.html())
    },

    _getMdHead($) {
        let title = $("article.markdown-body title").text()
        let description = $("article.markdown-body meta[name='description']").attr("content")
        let keywords = $("article.markdown-body meta[name='keywords']").attr("content")
        $("article.markdown-body title").remove()
        $("article.markdown-body meta[name='description']").remove()
        $("article.markdown-body meta[name='keywords']").remove()
        return {
            title: title,
            description: description,
            keywords: keywords
        }
    },

    _mixinHead(htmlContent) {
        let $ = cheerio.load(htmlContent, { decodeEntities: false })
        let metaInfo = this._getMdHead($)
        let title = $("head title").text()
        let description = $(".markdown-body p").eq(0).text()
        $("head meta[name='keywords']").attr("content", title)
        $("head meta[name='description']").attr("content", description)
        if ( metaInfo.title ) {
            $("head title").text(metaInfo.title)
        }
        if ( metaInfo.keywords ) {
            $("head meta[name='keywords']").attr("content", metaInfo.keywords)
        }
        if ( metaInfo.description ) {
            $("head meta[name='description']").attr("content", metaInfo.description)
        }
        return $.html()
    },

    async build(sourceDir, options = {}) {
        
        this.options = options
        this.sourceDir = sourceDir

        if (options.dev) {
            this.config = load(this.sourceDir, {
                dev: true
            })
        } else {
            this.config = load(this.sourceDir)
        }
        
        this.buildDir = utils.escapeSlash(options.outDir ? options.outDir : this.config.doc.outDir)
        this.themeDir = utils.escapeSlash(this.config.theme.dir)
        this.rootPath = utils.escapeSlash(this.config.theme.rootPath)
        this.rootPath = this.rootPath === "/" ? "" : this.rootPath
        this.rootPath = this.rootPath[this.rootPath.length - 1] === "/" ? this.rootPath.substring(0, this.rootPath.length - 1) : this.rootPath
        this.themeBase = utils.readFile(this.themeDir + "/base.html")

        if (this.config.toString() === "" || this.config.toString() === "{}") {
            throw new Error(`No configuration information`)
        }

        this.data = Object.assign(renderConst(this.config), {})

        this.rebuild()
        this.writeHtml()
    }
}