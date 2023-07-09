dns-prefetch 用于告知浏览器提前 dns lookup
preconnect 用于告知浏览器提前建立连接（dns lookup+tcp handshake+tls handshake），会占用连接端口，需要谨慎使用，同时对于 cors 请求（web font 之类的）浏览器会和非 cors 请求使用不同的连接

```
Link: <https://www.example.ai>; rel="preconnect"; crossorigin,<https://www.example.ai>; rel="preconnect";
```

或者放在 head 标签里

```html
<!-- 用于非cors请求，比如说external css和js -->
<link rel="preconnect" href="https://cdn.vrbo.com" />
<!-- 用于cors请求，比如说web font之类的 -->
<link rel="preconnect" href="https://cdn.vrbo.com" crossorigin />
```

### 参考资料

https://medium.com/expedia-group-tech/dns-prefetch-preconnect-7-tips-tricks-and-pitfalls-82d633c7f210
