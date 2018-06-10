# Teadocs
> Teadocs is a quick and easy WEB document setup tool.

## Getting Started

### installation

Prerequisites: Nodejs(>=8.0), npm version 3+.

```
$ npm install -g teadocs
```

### usage

#### step 1
Create a new folder

```
$ mkdir mydocs
```

#### step2
Go to this folder

```
$ cd mydocs
```

#### step4

The command pulls the template from default docs, and generates the project at  ``./mydocs``

```
$ teadocs init
```

#### step5
If you want to be lazy, you can run this command again. This command will automatically generate the relevant ``markdown file`` from ``tree.html``.

```
$ teadocs init
```

#### build docs
Build from ``./mydocs``
```
$ teadocs build
```

#### local preview
if you need a simple web server for previewing:
```
$ teadocs serve
```
it will create a web server as the root in your configured build directory.


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