const fs = require('fs-extra')
const cheerio = require('cheerio')
const { join } = require('path')
const ejs = require('ejs')
const chalk = require('chalk')
const fm = require('front-matter')

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

/**
 * build()      // 全量编译
 * buildMd()    // 增量编译：只编译某一个 md 文件
 */
class Build {

    constructor (options = {}) {
        this.options = options

        this.sourceDir = process.cwd()
        this.config = load(this.sourceDir, { dev: options.dev })

        if (this.config.toString() === "" || this.config.toString() === "{}") {
            throw new Error(`No configuration information`)
        }

        this.buildDir = utils.escapeSlash(options.outDir ? options.outDir : this.config.doc.outDir)
        this.themeDir = utils.escapeSlash(this.config.theme.dir)
        this.rootPath = utils.escapeSlash(this.config.theme.rootPath)
        this.themeBase = utils.readFile(this.themeDir + "/base.html")
        this.data = Object.assign(renderConst(this.config), {})

        // this.config.theme.rootPath   "/"         "/user/"
        // this.rootPath                ""          "/user"
        if (this.rootPath.charAt(this.rootPath.length - 1) === '/') {
            this.rootPath = this.rootPath.substring(0, this.rootPath.length - 1)
        }

        // parse tree.md
        this._parseTree()
    }

    _parseTree () {
        let $ = cheerio.load(this.config.nav.treeHtml, { decodeEntities: false })
        $("ul").eq(0).addClass("tea-menu-list")
        let tagsA = $("ul li a")
        let paths = []

        tagsA.each((i, elem) => {
            /**
             * a 标签有兄弟元素，只能是 ul，表示这个菜单有子菜单，可折叠
             * 添加下拉箭头 fa-angle-down
             * 
             * example：
             * 
             * <li>
             *      <a>一级菜单</a>
             *      <ul>
             *          <li><a>二级菜单</a></li>
             *      </ul>
             * </li>
             */
            let siblings = $(elem).siblings()
            if ( siblings.length > 0 ) {
                $(elem).append($("<i class='fa fa-angle-down'></i>"))
            }

            const title = $(elem).text()
            $(elem).attr("title", title)

            let href = $(elem).attr("href")
            if (href) {
                href = utils.escapeSlash(href)
                if ( href[href.length-1] === "/" ) {
                    href = href + "index"
                }
                $(elem).attr("href", this.rootPath + href + ".html")
                paths.push({
                    node: $(elem),
                    title: title,
                    href: this.rootPath + href + ".html",
                    input: this.config.doc.dir + href + ".md",
                    output: this.buildDir + href + ".html"
                })
            }
        })

        this._treePaths = paths
        this._treeDom = $
        this._treeHtml = $.html()
    }

    build () {
        // rm build directory
        this._rmBuildDirectory()
        
        // new build directory
        this._newBuildDirectory()
        
        // copy static source:
        // include teadocs themes/static and user define static(for example: static/images)
        this._copyStaticWithThemes()
        this._copyStaticWithUserDefine()

        // docs/xx.md => build/xx.md，Compile xx.md in the tree.md
        const searchDataset = []
        this._treePaths.forEach(item => {
            if ( !fs.existsSync(item.input) ) {
                utils.writeFile(item.input, "# " + item.title)
            }

            this.buildMd(item)

            searchDataset.push({
                context: this._getParents(this._treeDom, item.node),
                content: this.data.__MARKDOWN_CONTENT__,
            })
        })

        // _buildErrorPage??
        // this._buildErrorPage(errorFrameHtml)
        this._writeSearchData(JSON.stringify(searchDataset))

        console.log(chalk.bgGreen(" DONE ") + " Compiled successfully.")
        
        if ( !this.options.dev ) {
            process.exit(0)
        }
    }

    _rmBuildDirectory () {
        utils.remove(this.buildDir)
    }

    _newBuildDirectory () {
        utils.mkdirs(this.buildDir)
    }

    _copyStaticWithThemes () {
        fs.copySync(this.themeDir + "/static", this.buildDir + "/static")
    }

    _copyStaticWithUserDefine () {
        if ( fs.existsSync(this.config.doc.staticDir) ) {
            let files = fs.readdirSync(this.config.doc.staticDir)
            files.forEach(name => {
                fs.copySync(this.config.doc.staticDir + "/" + name, this.buildDir + "/static/" + name)
            })
        }
    }

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
    }

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
    }

    _writeSearchData(searchDataset) {
        let dataTpl = utils.readFile(__dirname + "/client-js/dataTpl.js")
        dataTpl = dataTpl.replace("'content';", "<%- content %>;")
        let jsContent = ejs.render(dataTpl, {
            content: searchDataset
        })
        console.log("wrtie data of the search:", this.buildDir + "/data.js")
        let minifyJsCode = minifyJs.compressJs(jsContent)
        utils.writeFile(this.buildDir + "/data.js", minifyJsCode)
    }

    /**
     * pathItem = { 
     *     input: './docs/config/xxx.md', 
     *     output: './build/config/xxx.html', 
     * }
     */
    buildMd (pathItem) {
        // 生成模板文件所需要的所有数据
        this._geneTreeData(pathItem)
        this._geneContentData(pathItem)
        this._geneArticleCatalogData()

        let htmlContent = ejs.render(this.themeBase, this.data)

        if (this.config.theme.isMinify) {
            htmlContent = minifyHTML(htmlContent)
        }

        // dev 环境追加 websockets 代码，用于热更新
        if (this.options.dev) {
            htmlContent = htmlContent + devHTML
        }

        if (pathItem.output !== this.buildDir + "/index.html") {
            htmlContent = this._mixinHead(htmlContent)
            // errorFrameHtml = htmlContent
        } else if (pathItem.output === this.buildDir + "/index.html") {
            htmlContent = this._mixinHead(htmlContent, 'index')
        }

        utils.writeFile(pathItem.output, htmlContent)
        console.log(chalk.green(">>>"), "output:", pathItem.output)
    }

    _geneTreeData (pathItem) {
        const $ = cheerio.load(this._treeHtml, { decodeEntities: false })
        const tagsA = $("ul li a")

        tagsA.each((i, elem) => {
            const title = $(elem).text()
            const href = $(elem).attr('href')
            let _href = href
            if ( typeof href === "string" ) {
                _href = href.substring(this.rootPath.length)
            }
            if ( title === pathItem.title && 
                (this.buildDir + _href) === pathItem.output ) {
                $(elem).parents().each((i, parent) => {
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
            $(elem).removeAttr("data-show")
        })

        //show activated elements
        ulEles =  $("a.active")
        ulEles.each((i, elem) => {
            $(elem).find("i").addClass("unfold")
            $(elem).next().addClass("unfold")
        })

        this.data.__NAV_HTML__ = $.html()
    }

    _geneContentData (pathItem) {
        let mdNativeContent = utils.readFile(pathItem.input)

        // fmObj：
        // {
        //     attributes: {
        //         author: dkvirus
        //         date: 2018-08-14 08:55:10
        //         updated: 2018-08-14 16:26:48
        //     },
        //     body: '\nThis is some text about some stuff that happened sometime ago',
        //     frontmatter: 'title: Just hack\'n\ndescription: Nothing to see here'
        // }
        const fmObj = fm(mdNativeContent)
        let mdHtmlContent = parse(fmObj.body)

        // article meta data: author、date、updated
        // ref: https://github.com/teadocs/teadocs/issues/19
        const headerYaml = fmObj.attributes
        let author = ''
        if (Object.prototype.toString.call(headerYaml.author) === '[object String]') {
            author = headerYaml.author
        } else if (Object.prototype.toString.call(headerYaml.author) === '[object Array]') {
            author = headerYaml.author.join(', ')
        }
        this.data.__ARTICLE_AUTHOR__ = author || ''
        this.data.__ARTICLE_CREATE_DATETIME__ = utils.formateDatetime(headerYaml.date) || ''
        this.data.__ARTICLE_UPDATE_DATETIME__ = utils.formateDatetime(headerYaml.updated) || ''

        // add img src prefix <= rootPath
        // ref: https://github.com/teadocs/teadocs/issues/17
        if (this.rootPath) {
            const imgReg = /<img([^>]*)\ssrc=(['"])(\/[^\2*([^\2\s<]+)\2/gi
            mdHtmlContent = mdHtmlContent.replace(imgReg, (m, p1, p2, p3) => {
                return `<img${p1} src=${p2}${join(this.rootPath, p3)}${p2}`
            })
        }

        // md html、tree html、article title
        this.data.__MARKDOWN_CONTENT__ = mdHtmlContent
        this.data.__CUR_TITLE__ = pathItem.title

        // get prev-page url and next-page url
        // ref: https://github.com/teadocs/teadocs/issues/6
        const paths = this._treePaths
        const navIndex = paths.findIndex(item => item.title === pathItem.title)
        const prev = paths[navIndex - 1] 
        const next = paths[navIndex + 1]
        this.data.__PREV_PAGE_HREF__ = prev && prev.href
        this.data.__PREV_PAGE_TITLE__ = prev && prev.title
        this.data.__NEXT_PAGE_HREF__ = next && next.href
        this.data.__NEXT_PAGE_TITLE__ = next && next.title
    }

    _geneArticleCatalogData () {
        const mdHtmlContent = this.data.__MARKDOWN_CONTENT__
        if (!mdHtmlContent) {
            this.data.__ARTICLE_CATALOG__ = ''
            return
        }

        const $ = cheerio.load(mdHtmlContent)
    
        let hArr = [], highestLvl, hNum = 0
        $('h1, h2, h3, h4, h5, h6').each(function () {
            hNum++
            let lvl = $(this).get(0).tagName.substr(1)
            if(!highestLvl) highestLvl = lvl
            hArr.push({
                lvl: lvl - highestLvl + 1,
                content: $(this).find('span').text(),
                id: $(this).attr('id')
            })
        })

        let ulHtml = '<ul class="toc-affix">'
        hArr.forEach(h => {
            ulHtml += `
                <li class="toc-item text-elli" style="padding-left: ${h.lvl * 15}px" data-link="${h.id}">
                    <a href="#${h.id}" title="${h.content}">${h.content}</a>
                </li>
            `
        })
        ulHtml += '</ul>'

        this.data.__ARTICLE_CATALOG__ = ulHtml
    }

    _mixinHead (htmlContent, type) {
        let $ = cheerio.load(htmlContent, { decodeEntities: false })
        let metaInfo = this._getMdHead($)
        if ( type === "index" ) {
            $("head title").text(this.config.doc.name)
        } else {
            let title = $("head title").text()
            let description = $(".markdown-body p").eq(0).text()
            $("head meta[name='keywords']").attr("content", title)
            $("head meta[name='description']").attr("content", description)
        }
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
    }

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
    }
}

module.exports = {
    Build
}