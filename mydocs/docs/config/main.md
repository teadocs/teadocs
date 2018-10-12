# 主配置文件说明
`teadocs.config.js` it is a Js file, like this:

```javascript
'use strict';
const path = require('path')

module.exports = {
    doc: {
        name: "", // of your document
        description: "", // of your description
        version: "", // of your version
        dir: "", // the directory representing your document, which defaults to ./docs
        outDir: "", //the generated directory representing your document, which defaults to ./build
        staticDir: "" //this directory that represents your static resource, which defaults to ./static
    }, 
    theme: {
        dir: "", // Fill in this if you have a custom theme file, otherwise leave it blank.
        title: "", //site title.
        headHtml: "", // stie head with html.
        footHtml: "", // site footer with html.
        isMinify: true // Wheter to compress your document.
    },
    nav: {
        tree: "./tree.html" //the path of your menu's configuration file.
    }
}
```