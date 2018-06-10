# markdown模版

你编写的markdown文件可以使用内置的ejs模版引擎，比如我们可以轻而易举的写个循环，像这样：

```javascript
&lt;% [1,2,3,4].forEach(function () { %&gt;	
### 欢迎使用Teadocs文档生成工具
&lt;% }) %&gt;
```

效果：

<% [1,2,3,4].forEach(function () { %>
### 欢迎使用Teadocs文档生成工具
<% }) %>