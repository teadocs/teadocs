const fs = require('fs-extra')
const chalk = require('chalk')
const cheerio = require('cheerio')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const utils = require('./utils')
const load = require('./config/load')

module.exports = async function init(sourceDir, options = {}) {
  let initDocs = __dirname + "/docs"
  let configPath = sourceDir + "/teadocs.config.js"
  let treePath = sourceDir + "/tree.html"
  let config = {}

  var reDocsByTree = function (treeHtml, dir) {
    console.log("remove docs dir:", dir)
    utils.remove(dir)
    let $ = cheerio.load(treeHtml, { decodeEntities: false })
    let tagsA = $("ul li a")
    if (tagsA.length === 0) {
      console.log(chalk.red("Invalid 'tree.html' file content"))
    }
    tagsA.each((i, elem) => {
      let href = $(elem).attr("href")
      let title = "# " + $(elem).text()
      if (href) {
        let path = dir + href + ".md"
        console.log(chalk.green(">>>"), "write file: ", path)
        utils.writeFile(path, title)
      }
    })
    process.exit(1)
  }

  if (fs.existsSync(configPath) && fs.existsSync(treePath)) {
    config = load(sourceDir)
    rl.question(chalk.yellow("This operation may overwrite existing document files.\nDo you want to continue? [y/n]"), function (answer) {
      if (answer === "" || answer === "y" || answer === "yes") {
        reDocsByTree(config.nav.treeHtml, config.doc.dir)
      }
      rl.close()
    })
  } else if (!fs.existsSync(configPath) && !fs.existsSync(treePath)) {
    let files = fs.readdirSync(initDocs)
    files.forEach(name => {
      let sourece = initDocs + "/" + name
      let target = sourceDir + "/" + name
      console.log(chalk.green(">>>"), "copy", "[" + sourece + "]", "to", "[" + target + "]")
      fs.copySync(sourece, target)
    })
    console.log("completed!")
    process.exit(1)

  } else if (fs.existsSync(configPath) && !fs.existsSync(treePath) ||
    !fs.existsSync(configPath) && fs.existsSync(treePath)
  ) {
    console.log(chalk.red("This is not a valid directory!"))
    process.exit(1)
  }
}
