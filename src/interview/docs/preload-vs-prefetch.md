preload:强制浏览器预先加载资源（加载完会放入缓存，几秒钟内就要用到，否则浏览器会提示）
prefetch:加快二级页面的访问

```
Link: <critical.css>; rel="preload"; as="style", </script.js>; rel="preload"; as="script"

Link: </css/style.css>; rel=prefetch
```

```html
<link rel="prefetch" href="/products/" as="document" />
```

# 参考资料

https://blog.logrocket.com/understanding-css-preload-other-resource-hints/
