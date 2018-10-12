const fs = require('fs-extra')
const nfs = require('fs')
const cheerio = require('cheerio')

/**
 * Ensures that the directory exists. If the directory structure does not exist, it is created. 
 * @param  {String} directory String.
 * @return {Boolean}          Boolean
 */

exports.mkdirs = function (directory) {
  fs.ensureDirSync(directory)
}

/**
 * read file
 * @param  {String} dir String.
 */

exports.readFile = function (dir) {
  return fs.readFileSync(dir, 'utf-8')
}

/**
 * write file
 * @param  {String} dir String.
 * @param  {String} content String.
 */

exports.writeFile = function (dir, content) {
  return fs.outputFileSync(dir, content)
}

/**
 * remove dir/file
 * @param  {String} src String.
 */

exports.remove = function (src) {
  fs.removeSync(src)
}

/**
 * merge object
 * @param  {Object} obj1 Object.
 * @param  {Object} obj2 Object.
 */

exports.mergeObj = function (obj1, obj2) {
  for (let key in obj1) {
    if ( obj1[key] === undefined || obj1[key] === "" ) {
      obj1[key] = obj2[key]
    }
  }
  return obj1
}

/**
 * merge string
 * @param  {String} str String.
 * @param  {String} spStr String.
 */
exports.mergeStr = function (str, spStr) {
  let strArr = str.split("")
  let newArr = []
  strArr.forEach(function (item, index) {
    let nextItem = strArr[index + 1]
    if (!(item === spStr && nextItem === spStr)) {
      newArr.push(item)
    }
  })
  return newArr.join("")
}

/**
 * clear for string
 * @param  {String} string String.
 */
exports.strClear = function (string) {
  string = string.replace(/\r\n/g, "")
  string = string.replace(/\n/g, "")
  string = string.replace(/ /g, "-")
  string = string.replace(/\s/g, "-")
  return string
}

/**
 * escape html
 * @param {String} html String.
 */
exports.escapeHtml = function (html) {
  let str = html;
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/"/g, '&quot;');  
  str = str.replace(/'/g, '&#039;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  return str;
}

/**
 * escape html
 * @param {String} html String.
 */
exports.escapeHtmlByDom = function (html) {
  let str = html;
  let $ = cheerio.load("<div id='temp'></div>", { decodeEntities: true });
  $("#temp").text(html);
  return $("#temp").html();
}

/**
 * escape slash
 * @param  {String} str String.
 */
exports.escapeSlash = function (str) {
  return str.replace(/\\/g, "/");
}