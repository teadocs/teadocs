const cheerio = require('cheerio')
const utils = require('../utils')

const marked = require('marked')
const renderer = new marked.Renderer();

renderer.code = function(code, lang) {
  let language = lang && (' language-' + lang) || '';
  return '<pre class="prettyprint' + language + '">'
    + '<code>' + utils.escapeHtml(code) + '</code>'
    + '</pre>';
};

renderer.codespan = function (text) {
    return '<code>' + text + '</code>'
}

renderer.heading = function (text, level) {
    let $ = cheerio.load("<div id='temp'>" + text + "</div>", { decodeEntities: false })
    id = $("#temp").text()
    id = utils.strClear(id)
    id = utils.mergeStr(id, '-')
    return `
        <h${level}>
            <a href='#${id}' class='header-anchor'>#</a>
            <span>${text}</span>
        </h${level}>
    `
}

marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true
});

module.exports = function parse (mdContent) {
    let mdHtmlContent = marked(mdContent)
    return mdHtmlContent
}