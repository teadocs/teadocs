# 文档目录结构介绍

```
testdocs
├─ build  #这个是编译输出的目录
│    ├─ config
│    │    ├─ main.html
│    │    ├─ nav.html
│    │    └─ structure.html
│    ├─ custom_theme.html
│    ├─ data.js
│    ├─ deploy.html
│    ├─ index.html
│    ├─ install.html
│    ├─ quick_start.html
│    ├─ static
│    │    ├─ css
│    │    ├─ font-awesome-4.7.0
│    │    ├─ fonts
│    │    ├─ images
│    │    └─ js
│    └─ template_markdown.html
├─ docs #这个是文档的源文件目录，也就是markdown文件目录。
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
|
├─ teadocs.config.js # 这是teadocs的主配置文件
└─ tree.html # 这是文档的菜单配置文件
```