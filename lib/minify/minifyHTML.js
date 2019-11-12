const minify = require('html-minifier').minify

module.exports = function minifyHTML(htmlContent) {
  const result = minify(htmlContent, {
    removeComments: true,
    collapseWhitespace: true,
    minifyJS: true,
    minifyCSS: true
  })
  return result
}
