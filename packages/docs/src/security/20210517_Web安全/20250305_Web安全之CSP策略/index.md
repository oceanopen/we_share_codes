# Web 安全之 CSP 策略

## 1. CSP 相关介绍

### 1.1 什么是 CSP?

`Content Security Policy` 是一种网页安全策略，现代浏览器使用它来增强网页的安全性。旨在缓解 XSS 和其他一些跨站脚本攻击等问题。
可以通过 `Content Security Policy` 来限制哪些资源(如 `JavaScript`、`CSS`、`图像`等)可以被加载，从哪些 `url` 加载。

`CSP` 本质上是白名单机制，开发者明确告诉浏览器哪些外部资源可以加载和执行，可以从哪些 `url` 加载资源。

浏览器已经有了“同源策略”，简而言之，就是说一个页面的资源只能从与之同源的服务器获取，而不允许跨域获取。
这样可以避免页面被注入恶意代码，影响安全。为什么还需要这个 CSP 呢？

因为这个“同源策略”是把双刃剑，挡住恶意代码的同时也限制了前端的灵活性。
通过这个 CSP，就可以制定一系列的策略，从而只允许我们页面向我们允许的域名发起跨域请求，而不符合我们策略的恶意攻-击则被挡在门外。
这样既能保证网站的安全性，又可以灵活的加载非同域下的其他资源。

### 1.2 启用 CSP 的两种方法

#### 1.2.1 设置 HTTP 响应头

在服务器端通过设置 `Content-Security-Policy` 这个 `HTTP` 响应头来启用 `CSP`。

如 `Nginx` 服务器上，则可以在 `nginx.conf` 文件中添加：

```ini
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://example.com; img-src 'self';"。
```

#### 1.2.2 使用 HTML 的 meta 标签

在 HTML 页面的 `<head>` 标签内添加 `<meta>` 标签来设置 `CSP`。
例如 `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';"/>`，这表示默认只允许从同域加载资源，图片可以从 `任何 https` 来源加载，不允许加载 `iframe` 内容。

### 1.3 若两者都有设置呢？

如果同时通过 `HTTP 响应头`和 `HTML 的 meta 标签` 设置了 `CSP`，通常以 `HTTP 响应头` 中的设置为准。
因为 `HTTP 响应头`是由服务器端发送的，在浏览器解析 `HTML` 页面之前就已经确定了 `CSP` 策略。
而 `meta 标签`是在 `HTML` 页面中，浏览器在解析到该标签时才会读取其中的 `CSP` 设置，但此时可能已经根据 `HTTP 响应头`中的 `CSP` 策略开始进行资源加载等操作了。

例如，如果 `HTTP` 响应头设置了 `Content-Security-Policy: img-src 'self';`，而 `HTML` 的 `meta 标签`设置了 `<meta http-equiv="Content-Security-Policy" content="img-src 'self' https://example.com;"`，那么浏览器会遵循 `HTTP 响应头`的设置，只允许从同源加载图片，而不会加载 `https://example.com` 的图片。

### 1.4 内容安全策略（CSP）的报告模式

`Content-Security-Policy-Report-Only` 是 `HTTP` 响应头字段，用于内容安全策略（CSP）的报告模式。
不能通过 `meta 标签` 设置。
表示不执行限制选项，只是记录违反限制的行为，必须与 `report-uri` 值选项配合使用。

具体作用如下：

- 仅报告不拦截
  与 `Content-Security-Policy` 不同，使用 `Content-Security-Policy-Report-Only` 时，浏览器不会阻止违反策略的资源加载或执行操作，只是会收集和报告违规行为相关信息，让网站管理员可以在不影响网站正常功能的情况下，了解哪些资源可能存在安全风险，以便对 `CSP` 策略进行调整和完善。
- 收集违规信息
  当浏览器发现有资源违反了 `Content-Security-Policy-Report-Only` 中定义的策略时，会生成包含详细违规信息的报告，如被阻塞的资源的 `URL`、出现资源阻塞的页面 `URL`、违规的代码行号和列号、生效的指令等。这里并不是真的阻塞，只是表示如果处于正常的 `Content-Security-Policy` 策略（非 `Report-Only` 模式）下，这些资源会被拦截。主要目的是为了让开发者了解哪些资源可能存在风险，以便后续调整策略。
- 配合报告指令
  需要与 `report-uri` 或 `report-to` 指令配合使用来指定报告的发送地址。
  `report-uri` 是较旧的方式，直接指定一个 `URI` 地址来接收报告；
  `report-to` 是更现代的方式，配合 `Reporting-Endpoints` 使用，可以更灵活地配置报告端点等信息。

`report-uri` 例子：

例如，在服务器端配置 `Content-Security-Policy-Report-Only: script-src 'self'; report-uri https://example.com/csp-reports`，
表示只允许执行同源脚本，若有其他来源的脚本加载请求，浏览器不会阻止，但会将违规信息报告到 `https://example.com/csp-reports` 这个地址。

`report-to` 例子：

```
Reporting-Endpoints: main-endpoint="https://example.com/csp-reports"
Content-Security-Policy-Report-Only: script-src ''; connect-src ''; frame-ancestors ''; report-to main-endpoint;
```

这个例子中，这里先通过 `Reporting-Endpoints` 定义了一个名为 `main-endpoint` 的报告端点，然后在 `Content-Security-Policy-Report-Only` 中使用 `report-to` 指令指定将 `CSP` `违规报告发送到main-endpoint` 对应的 `https://example.com/csp-reports` 地址。

`CSP` 报告发送示例：

```
POST /csp-reports HTTP/1.1
Host: example.com
Content-Type: application/reports+json
[
  {
    "type": "csp",
    "age": 10,
    "url": "https://example.com/vulnerable-page/",
    "user_agent": "Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0",
    "body": {
      "blocked": "https://evil.com/evil.js",
      "directive": "script-src",
      "policy": "script-src 'self'; object-src 'none'",
      "status": 200,
      "referrer": "https://evil.com/"
    }
  }
]
```

这是浏览器向 `/csp-reports` 端点发送的一个 `CSP` 报告示例，包含了违规的相关信息，如被阻止的资源 `URL`、生效的指令、原始策略等。

### 1.5 CSP 指令介绍

`Content-Security-Policy` 值由一个或多个指令组成，多个指令用分号分隔。

#### 1.5.1 常用指令

| 指令            | 指令和指令值示例           | 指令说明                                                                                                                                                         |
| --------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default-src     | `'self' 'cdn.example.com'` | 默认加载策略                                                                                                                                                     |
| script-src      | `'self' 'js.example.com'`  | 对 `js` 的加载策略                                                                                                                                               |
| style-src       | `'self' 'css.example.com'` | 对样式的加载策略                                                                                                                                                 |
| img-src         | `'self' 'img.example.com'` | 对图片的加载策略                                                                                                                                                 |
| content-src     | `'self'`                   | 对 ajax，websocket 请求的加载策略。不允许的情况下浏览器会模拟一个状态为 `400` 的响应                                                                             |
| font-src        | `'font.cdn.example.com'`   | 针对 `webFont` 的加载策略                                                                                                                                        |
| object-src      | `'self'`                   | 指针或标签引入 `flash` 等插件的加载策略                                                                                                                          |
| media-src       | `'media.cdn.example.com'`  | 针对媒体引入的HTML多媒体的加载策略                                                                                                                               |
| frame-src       | `'self'`                   | 针对 `frame` 的加载策略                                                                                                                                          |
| frame-ancestors | `'self'`                   | 嵌入的外部资源（比如 `<frame>`、`<iframe>`、`<embed>` 和 `<applet>`）                                                                                            |
| connect-src     | `'self'`                   | HTTP 连接（通过 XHR、WebSockets、EventSource等）                                                                                                                 |
| worker-src      | `'self'`                   | worker 脚本                                                                                                                                                      |
| manifest-src    | `'self'`                   | manifest 文件                                                                                                                                                    |
| report-uri      | `'/report-uri'`            | 告诉浏览器如果请求的资源不被策略允许时，往哪个地址提交日志信息。特别的，如果想让浏览器只汇报日志，不阻止任何内容，可以改用 `Content-Security-Policy-Report-Only` |

#### 1.5.2 其他一些指令

| 指令            | 指令说明                                      |
| --------------- | --------------------------------------------- |
| sandbox         | 设置沙盒环境                                  |
| child-src       | 主要防御 frame, iframe                        |
| form-action     | 主要防御 form                                 |
| frame-ancestors | 主要防御 frame, iframe, object, embed, applet |
| plugin-types    | 主要防御 object, embed, applet                |

#### 1.5.3 指令值介绍

| 指令值            | 指令和指令值示例           | 指令值说明                                                                           |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------------ |
| `*`               | `img-src *`                | 允许任何内容                                                                         |
| `'none'`          | `img-src 'none'`           | 不允许任何内容                                                                       |
| `'self'`          | `img-src 'self'`           | 允许来自相同的来源的内容（相同的协议，域名和端口）                                   |
| `data:`           | `img-src data:`            | 允许 data 协议(如 base64 编码的图片)                                                 |
| `www.example.com` | `img-src img.example.com`  | 允许加载指定域名下的资源                                                             |
| `*.example.com`   | `img-src: *.example.com`   | 允许加载 `example.com` 任何子域下面的资源                                            |
| `'unsafe-inline'` | `script-src unsafe-inline` | 允许加载 `inline` 的资源 例如常见的 style 属性，onclick，inline js 和 inline css等等 |
| `'unsafe-eval'`   | `script-src 'unsafe-eval'` | 允许加载动态 js 代码，例如 `eval()`                                                  |

## 2. csp-html-webpack-plugin 使用

通过这个 webpack 插件可实现通过配置自动注入 html：

```js
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

// eslint-disable-next-line no-new
new CspHtmlWebpackPlugin({
  // eslint-disable-next-line style/quotes
  'script-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
  // eslint-disable-next-line style/quotes
  'style-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
  // eslint-disable-next-line style/quotes
  'img-src': ["data:", "blob:", "'self'"]
}, {
  enabled: true,
  hashEnabled: {
    'script-src': false,
    'style-src': false
  },
  nonceEnabled: {
    'script-src': false,
    'style-src': false
  },
});
```

等价于：

```html
<meta
  http-equiv="Content-Security-Policy"
  content="script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src data: blob: 'self';"
/>
```

## 3. 参考

- [内容安全策略（CSP）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
- [内容安全策略（CSP）：每个Web开发人员都必须知道的](https://juejin.cn/post/7352146376632467490)
- [内容安全策略（CSP）详解](https://juejin.cn/post/6844903841238876174)
- [HTTP中的CSP ( Content Security Policy )内容安全策略](https://juejin.cn/post/6856676636251652110)
- [Content Security Policy 入门教程](https://www.ruanyifeng.com/blog/2016/09/csp.html)
- [csp-html-webpack-plugin](https://github.com/slackhq/csp-html-webpack-plugin)
