# 菜单配置文件说明
The menu configuration file is located in the root of the `tree.html`.

## complete menu
A complete structure is as follows:

```html
<ul>
    <li><a href="/index">介绍</a></li>
    <li><a href="/quick_start">快速入门</a></li>
    <li><a href="/install">安装</a><li>
    <li>
        <a>配置介绍</a>
        <ul data-show="1">
            <li><a href="/config/structure">文档目录结构介绍</a></li>
            <li><a href="/config/main">主配置文件说明</a></li>
            <li><a href="/config/nav">菜单配置文件说明</a></li>
        </ul>
    </li>
    <li><a href="/template_markdown">markdown模版</a></li>
    <li><a href="/custom_theme">自定义主题</a></li>
    <li><a href="/deploy">部署</a></li>
</ul>
```

### ul
tag ul will packgae li

### li
tag li will packge ul

### href
The href attribute represents the path ot the document.

### data-show
This property determines whether to expand your menu at the beginning.

expand:
```
data-show="1"
```
collapse:
```
data-show="0"
```