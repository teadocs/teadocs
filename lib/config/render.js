module.exports = function render (config) {
    return {
        __MARKDOWN_CONTENT__: "",
        __TITLE__: config.theme.title,
        __HEAD_HTML__: config.theme.headHtml,
        __FOOT_HTML__: config.theme.footHtml,
        __DOC_NAME__: config.doc.name,
        __DOC_VERSION__: config.doc.version
    }
}
