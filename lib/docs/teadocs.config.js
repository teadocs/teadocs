'use strict';
const path = require('path')

module.exports = {
    doc: {
        name: "",
        description: "",
        version: "",
        dir: "",
        outDir: "",
        staticDir: ""
    }, 
    theme: {
        dir: "", 
        title: "",
        headHtml: "",
        footHtml: "",
        isMinify: true,
        rootPath: "http://127.0.0.1:3210"
    },
    nav: {
        tree: "./tree.html"
    }
}