# 快速入门

## installation

Prerequisites: Nodejs(>=8.0), npm version 3+.

```
$ npm install -g teadocs
```

## usage

### step 1
Create a new folder

```
$ mkdir mydocs
```

### step2
Go to this folder

```
$ cd mydocs
```

### step4

The command pulls the template from default docs, and generates the project at  ``./mydocs``

```
$ teadocs init
```

### step5
If you want to be lazy, you can run this command again. This command will automatically generate the relevant ``markdown file`` from ``tree.html``.

```
$ teadocs init
```

## build docs
Build from ``./mydocs``
```
$ teadocs build
```

## local preview
if you need a simple web server for previewing:
```
$ teadocs serve
```
it will create a web server as the root in your configured build directory.


