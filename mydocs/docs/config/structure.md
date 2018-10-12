# 文档目录结构介绍

```
testdocs
├─ build # This is the directory where the generated document is located.
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
│    │    ├─ .DS_Store
│    │    ├─ css
│    │    ├─ font-awesome-4.7.0
│    │    ├─ fonts
│    │    ├─ images
│    │    └─ js
│    └─ template_markdown.html
├─ docs # This is the directory of the default markdown document.
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
├─ static # This is a static file directory, After the document is generated, it will becopied to the generated static file directory.
|
├─ teadocs.config.js # This is the main configuration file for teadocs
└─ tree.html # This is the document's menu configuration file
```