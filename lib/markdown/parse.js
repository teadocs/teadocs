const cheerio = require('cheerio')
const marked = require('marked')
const utils = require('../utils')

const reHid = function (htmlContent) {
    let $ = cheerio.load(htmlContent, { decodeEntities: false })

    const reId = function (hEle) {
        $(hEle).each((i, elem) => {
            let id = utils.strClear($(elem).text())
            id = utils.mergeStr(id, '-')
            $(elem).attr("id", id)
            $(elem).prepend("<a href='#" + id + "' class='header-anchor'>#</a>")
        })
        return reId
    }
    
    let h1 = $("h1"),
        h2 = $("h2"),
        h3 = $("h3"),
        h4 = $("h4"),
        h5 = $("h5"),
        h6 = $("h6")
    reId(h1)(h2)(h3)(h4)(h5)(h6)
    return $.html()

}

const escapePre = function (htmlContent) {
    let $ = cheerio.load(htmlContent, { decodeEntities: false })
    let tagCode = $("pre code")
    tagCode.each((i, elem)=> {
        let html = $(elem).html()
        $(elem).html("")
        $(elem).text(utils.escapeHtml(html))
    })
    return $.html()
}

module.exports = function parse (mdContent) {
    let mdHtmlContent = marked(mdContent)
    mdHtmlContent = reHid(mdHtmlContent)
    mdHtmlContent = escapePre(mdHtmlContent)
    return mdHtmlContent
}