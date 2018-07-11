# 快速入门

## 安装它

需要nodejs版本 >= 8.0，npm 版本 > 3.
```
$ npm install -g teadocs
```

## 使用它

### 第一步

初始化一个文档项目

```
$ teadcos init mydocs
```

### 第二步

进入这个文档目录

```
$ cd mydocs
```

### 第三步

此步骤是进入文档编辑模式（开发模式），此模式将监视markdown文件的变化，实时热替换html页面。

```
$ teadocs dev
```

### 自动生成项目初始结构

如果你想偷懒，那么你可以在编写好tree.md（菜单的配置文件）的情况下，直接运行以下命令，teadocs可以自动帮你生成md文件。

```
$ teadocs init
```

### 编译成html

```
$ teadocs build
```