# 菜单配置文件说明
菜单的配置文件是你文档根目录下面的 ``tree.md`` 文件，它采用了markdown语法来进行书写。

## 菜单结构
例如，本文档的菜单结构如下：

```markdown
- [介绍](/index)
- [快速入门](/quick_start)
- [安装](/install)
- +配置介绍
    - [文档目录结构介绍](/config/structure)
    - [主配置文件说明](/config/main)
    - [菜单配置文件说明](/config/nav)
- [markdown模版](/template_markdown)
- [自定义主题](/custom_theme)
- [部署](/deploy)
```

### 符号介绍

语法完全使用markdown里的无序列表定义语法，但是要特别注意以下几点：

- ``[]`` 里的内容表示菜单的标题，如果不写``[]``则代表这个菜单没有链接仅作为一个菜单名称。
- ``()`` 里的内容表示菜单的markdown文件的地址，``并且也代表了生成后的html文件url。``
- ``+`` 代表了在生成的html里默认展开这个菜单，需要注意的是，这不是markdown的语法，这是teadocs的规定，``+``一定要写在文本的前面，而不是``[``的前面。
