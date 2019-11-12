# Teadocs
> Teadocs is a quick and easy WEB document setup tool.

[![NPM](https://nodei.co/npm/teadocs.png)](https://nodei.co/npm/teadocs/)

![npm](https://img.shields.io/npm/dw/teadocs.svg)
![Bitbucket Pipelines](https://img.shields.io/bitbucket/pipelines/atlassian/adf-builder-javascript.svg)
![GitHub top language](https://img.shields.io/github/languages/top/badges/shields.svg) 
![CocoaPods](https://img.shields.io/cocoapods/l/AFNetworking.svg)

## 下一个版本 TODO

- 更新说明文档（中文、英文）💪
- dev 时候产生的目录改名为``.temp``，并且dev断开后自动删除该文件夹。💪
- 自动递增端口 by dkvirus [#25](https://github.com/teadocs/teadocs/issues/25) 👍
- tree.md 功能优化 by dkvirus [#24](https://github.com/teadocs/teadocs/issues/24) 👍
- 增加单元测试/页面测试 😘
- 函数/类增加完整注释说明 😘

## Documentation

- 中文: http://docs.teadocs.cn/cn
- english: http://docs.teadocs.cn/en

## Getting Started

### installation

Prerequisites: Nodejs(>=8.0), npm version 3+.

```
$ npm install -g teadocs
```

### usage

#### step 1

Initialize a new document project

```
$ teadcos init mydocs
```

#### step 2

Go to this folder

```
$ cd mydocs
```

#### step 3

This step is to enter the document editing mode, this mode will monitor the markdown file changes in real-time hot replacement of html pages.

```
$ teadocs dev
```

#### Automatically generate md

If you want to be lazy, you can run this command again. This command will automatically generate the relevant ``markdown file`` from ``tree.html``.

```
$ teadocs init
```

#### build docs

Build from ``./mydocs``
```
$ teadocs build
```

## LICENSE

MIT License

Copyright (c) 2019 ZhiBing(17560235@qq.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
