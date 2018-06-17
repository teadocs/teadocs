const cheerio = require('cheerio')
const utils = require('../utils')

const marked = require('marked')
const renderer = new marked.Renderer();

renderer.code = function(code, lang) {
  var language = lang && (' language-' + lang) || '';
  return '<pre class="prettyprint' + language + '">'
    + '<code>' + utils.escapeHtml(utils.escapeHtml(code)) + '</code>'
    + '</pre>';
};

marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true
});


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

module.exports = function parse (mdContent) {
    let mdHtmlContent = marked(mdContent)
    mdHtmlContent = reHid(mdHtmlContent)
    return mdHtmlContent
}