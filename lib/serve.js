const Koa = require('koa')
const path = require('path')
const static = require('koa-static')
const open = require("open");

module.exports = async function serve (sourceDir, options = {}) {
    console.log("you run: serve");
    console.log("--sourceDir:", sourceDir);
    console.log("--options:", options);

    const app = new Koa()
    
    const staticPath = sourceDir + "/build";
    const port = options.port ? options.port : 3210;
    const host = options.host ? options.host : '0.0.0.0';
    app.use(static(
      path.join(staticPath)
    ))
    
    app.listen(port, host, () => {
      console.log('The server is based on '+ staticPath +' directory running on \n' + '[http://' + host + ':' + port + ']')

      open('http://' + host + ':' + port, 'chrome')
    })
}