# Teadocs

> Teadocs 简单快捷的Web文档生成工具。

[![NPM](https://nodei.co/npm/teadocs.png)](https://nodei.co/npm/teadocs/)

![npm](https://img.shields.io/npm/dw/teadocs.svg)
![Bitbucket Pipelines](https://img.shields.io/bitbucket/pipelines/atlassian/adf-builder-javascript.svg)
![GitHub top language](https://img.shields.io/github/languages/top/badges/shields.svg) 
![CocoaPods](https://img.shields.io/cocoapods/l/AFNetworking.svg)

# Teadocs V0.x

目前的 v0.x 版本相对稳定，如果你想使用 Teadocs V0.x 版本，请看查看这个分支：https://github.com/teadocs/teadocs/tree/v0.x

# Teadocs V1.x

Teadocs V1.x 还在开发中。

## 一个标准文档的目录结构

```python
mydocs
├─ build  #这个是编译输出的静态文件目录
├─ docs   #这个是文档的源文件目录，也就是markdown文件目录。
│    ├─ config
│    │    ├─ main.md
│    │    ├─ nav.md
│    │    └─ structure.md
│    ├─ custom_theme.md
│    ├─ deploy.md
│    ├─ index.md
│    ├─ install.md
│    ├─ quick_start.md
│    └─ template_markdown.md
├─ static # 这个地方是用于存放文档中需要用要的静态文件，例如图片等，它会自动copy到build目录下。
├─ teadocs.config.js # 这是teadocs的主配置文件
└─ tree.md # 这是文档的菜单配置文件，标准的markdown定义列表的语法
```

## Teadocs v1.0配置项详细解读

```js
'use strict';

module.exports = {
    html: { //html网页配置
        home: { //首页seo配置项
            title: "",
            description: "",
            keywords: ""
        },
        head: "", //在head下插入的代码
        body: "" //在head下插入的代码
    },
    docs: { //文档相关配置
        name: "", //文档的名称
        version: "", //文档的版本
        sourceDir: "", //文档markdown存放目录
        buildDir: "", //静态html文件存放的目录
        navPath: "", //文档目录配置文件路径
    }
    theme: { //主题配置
        dir: "", //主题的目录，请填写自定义主题的名称，不填写就使用默认主题。
        rootDir: "/" //表示文档资源的根目录，如果部署在深目录下面，这个配置项必填，不然会出现找不到资源路径的错误。
    }
}
```
