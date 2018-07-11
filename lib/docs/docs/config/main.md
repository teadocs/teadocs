# 主配置文件说明

菜单的配置文件是你文档根目录下面的 ``teadocs.config.js``，它是一个javascript的文件。

主配置文件的所有配置项都不是必填你完全可以什么也不填写，它的代码如下：

```javascript
'use strict';
const path = require('path')

module.exports = {
    doc: {
        name: "", //文档名称
        description: "", //文档的描述
        version: "", //文档的版本
        dir: "", //文档的目录
        outDir: "", //文档编译成html时输出的目录
        staticDir: "" //文档所用到的静态文件的地址
    }, 
    theme: {
        dir: "", //主题的目录，可自定义主题
        title: "", //html的title标签
        headHtml: "", //html head 的代码
        footHtml: "", //html 底部 的代码
        isMinify: true, //是否为输出的html启用压缩
        rootPath: "/" //表示根路径，如果部署在深目录下面，这个配置项必填，不然会出现找不到资源路径的错误。
    },
    nav: {
        tree: "./tree"
    }
}
```

## 默认配置

```javascript
module.exports = {
    doc: {
        name: "欢迎使用Teadocs文档生成系统",
        description: "欢迎使用Teadocs文档生成系统",
        version: "0.0.1",
        dir: "./docs",
        outDir: "./build",
        staticDir: "./static"
    },
    theme: {
        dir: __dirname + '/../themes/default',
        title: "欢迎使用Teadocs文档生成系统",
        headHtml: `
        <meta name="description" content="欢迎使用Teadocs文档生成系统" />
        <meta name="keywords" content="teadocs, 文档生成器" />
        `,
        footerHtml: "",
        isMinify: false,
        rootPath: "/"
    },
    nav: {
        tree: "<ul><li><a>欢迎使用Teadocs文档生成系统</a></li></ul>"
    }
}
```