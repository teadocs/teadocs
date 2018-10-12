# Teadocs
> Teadocs is a quick and easy WEB document setup tool.

[![NPM](https://nodei.co/npm/teadocs.png)](https://nodei.co/npm/teadocs/)

![npm](https://img.shields.io/npm/dw/teadocs.svg)
![Bitbucket Pipelines](https://img.shields.io/bitbucket/pipelines/atlassian/adf-builder-javascript.svg)
![GitHub top language](https://img.shields.io/github/languages/top/badges/shields.svg) 
![CocoaPods](https://img.shields.io/cocoapods/l/AFNetworking.svg)

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

Copyright (c) 2016 Matt Mueller

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