# 前端性能优化总结

## 1. 前言

**为什么要做性能优化？性能优化到底有多重要？**

网站的性能优化对于用户的留存率、转化率有很大的影响，所以对于前端开发来说性能优化能力也是重要的考察点。

可以将性能优化分为两个大的分类：

- 加载时优化；
- 运行时优化；

### 1.1 加载时性能

顾名思义加载时优化，主要解决的就是让一个网站加载过程更快，比如压缩文件大小、使用 CDN 加速等方式可以优化加载性能。

检查加载性能的指标一般看：白屏时间和首屏时间：

- 白屏时间：指从输入网址，到页面开始显示内容的时间。
- 首屏时间：指从输入网址，到首屏页面内容渲染完毕的时间。

**白屏时间计算**

将代码脚本放在 `</head>` 前面就能获取白屏时间：

```html
<script>
  new Date().getTime() - performance.timing.navigationStart;
</script>
```

**首屏时间计算**

在 `window.onload` 事件中执行以下代码，可以获取首屏时间：

```js
window.onload = function () {
  new Date().getTime() - performance.timing.navigationStart;
};
```

### 1.2 运行时性能

运行时性能是指页面运行时的性能表现，而不是页面加载时的性能。

可以通过 `chrome` 开发者工具中的 `Performance` 面板来分析页面的运行时性能。

> 接下来就从`加载时性能`和`运行时性能`两个方面来讨论`网站优化`具体应该怎么做。

## 2. 加载时性能优化

我们知道浏览器如果输入的是一个网址，首先要`交给 DNS 域名解析 -> 找到对应的 IP 地址 -> 然后进行 TCP 连接 -> 浏览器发送 HTTP 请求 -> 服务器接收请求 -> 服务器处理请求并返回 HTTP 报文 -> 以及浏览器接收并解析渲染页面`。

从这一过程中，其实就可以挖出优化点，缩短请求的时间，从而去加快网站的访问速度，提升性能。

这个过程中可以提升性能的优化的点：

- `DNS` 解析优化，浏览器访问 `DNS` 的时间就可以缩短；
- 使用 `HTTP2`；
- 减少 `HTTP` 请求数量；
- 减少 `http` 请求大小；
- 服务器端渲染；
- 静态资源使用 `CDN`；
- 资源缓存，不重复加载相同的资源；

> 从上面几个优化点出发，有以下几种实现性能优化的方式。

### 2.1 DNS 解析

#### 2.1.1 DNS 预解析

`DNS` 作为互联网的基础协议，其解析的速度似乎容易被网站优化人员忽视。现在大多数新浏览器已经针对 `DNS` 解析进行了优化，典型的一次 `DNS` 解析耗费 20-120 毫秒，减少 `DNS` 解析时间和次数是个很好的优化方式。`DNS Prefetching` 是具有此属性的域名不需要用户点击链接就在后台解析，而域名解析和内容载入是串行的网络操作，所以这个方式能减少用户的等待时间，提升用户体验。

浏览器对网站第一次的域名 DNS 解析查找流程依次为：

`浏览器缓存 -> 系统缓存 -> 路由器缓存 -> ISP DNS 缓存 -> 递归搜索`。

`DNS` 预解析的实现：

用 `meta` 信息来告知浏览器, 当前页面要做 `DNS` 预解析：

```html
<meta http-equiv="x-dns-prefetch-control" content="on" />
```

在页面 `header` 中使用 `link` 标签来强制对 `DNS` 预解析：

```html
<link rel="dns-prefetch" href="http://www.test.com" />
```

> 注意：`dns-prefetch` 需慎用，多页面重复 `DNS` 预解析会增加重复 `DNS` 查询次数。

#### 2.1.2 减少 DNS 解析次数

如果一个页面请求多个域名，那么就会进行多个 `DNS` 解析，增加 `DNS` 解析的时间。
但是一个域名并行请求次数是有限制的。所以需要考虑多个域名分担并行请求。

所以综合以上两点，结合实际项目经验，一个页面包含的域名个数在 `2~4` 个为佳。

### 2.2 使用 HTTP2

`HTTP2` 带来了非常大的加载优化，所以在做优化上首先就想到了用 `HTTP2` 代替 `HTTP1.1`。

`HTTP2` 相对于 `HTTP1` 有这些优点：

**解析速度快**

服务器解析 `HTTP1.1` 的请求时，必须不断地读入字节，直到遇到分隔符 `CRLF` 为止。
而解析 `HTTP2` 的请求就不用这么麻烦，因为 `HTTP2` 是基于帧的协议，每个帧都有表示帧长度的字段。

**多路复用**

在 `HTTP2` 上，多个请求可以共用一个 `TCP` 连接，这称为多路复用。

当然 `HTTP1.1` 有一个可选的 `Pipelining` 技术，说的意思是当一个 `HTTP` 连接在等待接收响应时可以通过这个连接发送其他请求。
听起来很棒，其实这里有一个坑，处理响应是按照顺序的，也就是后发的请求有可能被先发的阻塞住，也正因此很多浏览器默认是不开启 `Pipelining` 的。

`HTTP1` 的 `Pipelining` 技术会有阻塞的问题，`HTTP/2` 的多路复用可以粗略的理解为非阻塞版的 `Pipelining`。
即可以同时通过一个 `HTTP` 连接发送多个请求，谁先响应就先处理谁，这样就充分的压榨了 `TCP` 这个全双工管道的性能。
加载性能会是 `HTTP1` 的几倍，需要加载的资源越多越明显。当然多路复用是建立在加载的资源在同一域名下，不同域名复用不了。

**首部压缩**

`HTTP2` 提供了首部压缩功能。（这部分了解一下就行）

`HTTP 1.1` 请求的大小变得越来越大，有时甚至会大于 `TCP` 窗口的初始大小，因为它们需要等待带着 `ACK` 的响应回来以后才能继续被发送。
`HTTP/2` 对消息头采用 `HPACK`（专为 `http/2` 头部设计的压缩格式）进行压缩传输，能够节省消息头占用的网络的流量。
而 `HTTP/1.1` 每次请求，都会携带大量冗余头信息，浪费了很多带宽资源。

**服务器推送**

服务端可以在发送页面 `HTML` 时主动推送其它资源，而不用等到浏览器解析到相应位置，发起请求再响应。

### 2.3 减少 HTTP 请求数量

`HTTP` 请求建立和释放需要时间。

`HTTP` 请求从建立到关闭一共经过以下步骤：

1. 客户端连接到 `Web` 服务器；
2. 发送 `HTTP` 请求；
3. 服务器接受请求并返回 `HTTP` 响应；
4. 释放连接 `TCP` 链接；

这些步骤都是需要花费时间的，在网络情况差的情况下，花费的时间更长。
如果页面的资源非常碎片化，每个 `HTTP` 请求只带回来 `几K` 甚至不到 `1K` 的数据（比如各种小图标）那性能是非常浪费的。

### 2.4 压缩、合并文件

- 压缩文件 -> 减少 `HTTP` 请求大小，可以减少请求时间；
- 文件合并 -> 减少 `HTTP` 请求数量；

我们可以对 `html`、`css`、`js` 以及图片资源进行压缩处理，现在可以很方便的使用 `webpack` 实现文件的压缩：

- `js` 压缩：`UglifyPlugin`；
- `CSS` 压缩：`MiniCssExtractPlugin`；
- `HTML` 压缩：`HtmlWebpackPlugin`；
- 图片压缩：`image-webpack-loader`；

**提取公共代码**

合并文件虽然能减少 `HTTP` 请求数量， 但是并不是文件合并越多越好，还可以考虑按需加载方式。
什么样的文件可以合并呢？可以提取项目中多次使用到的公共代码进行提取，打包成公共模块。

可以使用 `webpack4` 的 `splitChunk` 插件 `cacheGroups` 选项。

```js
const config = {
  // ...
  optimization: {
    runtimeChunk: {
      name: 'manifest', // 将 webpack 的 runtime 代码拆分为一个单独的 chunk。
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
  },
  // ...
};
```

### 2.5 采用 svg 图片或者字体图标

因为字体图标或者 `SVG` 是矢量图，代码编写出来的，放大不会失真，而且渲染速度快。
字体图标使用时就跟字体一样，可以设置属性，例如 `font-size`、`color` 等等，非常方便，还有一个优点是生成的文件特别小。

### 2.6 按需加载代码，减少冗余代码

**按需加载**

在开发 `SPA` 项目时，项目中经常存在十几个甚至更多的路由页面， 如果将这些页面都打包进一个 `JS` 文件， 虽然减少了 `HTTP` 请求数量， 但是会导致文件比较大，同时加载了大量首页不需要的代码，有些得不偿失，这时候就可以使用按需加载，将每个路由页面单独打包为一个文件，当然不仅仅是路由可以按需加载。

根据文件内容生成文件名，结合 `import` 动态引入组件实现按需加载。

通过配置 `output` 的 `filename` 属性可以实现这个需求。
`filename` 属性的值选项中有一个 `[contenthash]`，它将根据文件内容创建出唯一 `hash`。当文件内容发生变化时，`[contenthash]` 也会发生变化。

```js
const config = {
  // ...
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
  },
  // ...
};
```

**减少冗余代码**

一方面避免不必要的转义：`babel-loader` 用 `include` 或 `exclude` 来帮我们避免不必要的转译，不转译 `node_moudules` 中的 `js` 文件。
其次再缓存当前转译的 `js` 文件，设置 `loader: 'babel-loader?cacheDirectory=true'`

其次减少 `ES6` 转为 `ES5` 的冗余代码：`Babel` 转化后的代码想要实现和原来代码一样的功能需要借助一些帮助函数，比如：

```js
class Person {}
```

会被转换为：

```js
'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

const Person = function Person() {
  _classCallCheck(this, Person);
};
```

这里 `_classCallCheck` 就是一个 `helper` 函数，如果在很多文件里都声明了类，那么就会产生很多个这样的 `helper` 函数。

这里的 `@babel/runtime` 包就声明了所有需要用到的帮助函数，而 `@babel/plugin-transform-runtime` 的作用就是将所有需要 `helper` 函数的文件，从 `@babel/runtime` 包引进来：

```js
'use strict';
const _classCallCheck2 = require('@babel/runtime/helpers/classCallCheck');
const _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const Person = function Person() {
  ;(0, _classCallCheck3.default)(this, Person);
};
```

这里就没有再编译出 `helper` 函数 `classCallCheck` 了，而是直接引用了 `@babel/runtime` 中的 `helpers/classCallCheck`。

- 安装：

```bash
npm i -D @babel/plugin-transform-runtime @babel/runtime
```

- 使用

在 `.babelrc` 文件中：

```js
const config = {
  // ...
  plugins: ['@babel/plugin-transform-runtime'],
  // ...
};
```

### 2.7 服务器端渲染

> 非必要 `SEO` 需要，不建议采用服务端渲染，增加了部署流程，且 `html` 请求不能用 `cdn`，增加流量压力。

客户端渲染: 获取 `HTML` 文件，根据需要下载 `JavaScript` 文件，运行文件，生成 `DOM`，再渲染。

服务端渲染：服务端返回 `HTML` 文件，客户端只需解析 `HTML`。

优点：首屏渲染快，`SEO` 好。
缺点：配置麻烦，增加了服务器的计算压力。

### 2.8 使用 Defer 加载 JS

尽量将 `CSS` 放在文件头部，`JavaScript` 文件放在底部。

所有放在 `head` 标签里的 `CSS` 和 `JS` 文件都会堵塞渲染。如果这些 `CSS` 和 `JS` 需要加载和解析很久的话，那么页面就空白了。所以 `JS` 文件要放在底部，等 `HTML` 解析完了再加载 `JS` 文件。

那为什么 `CSS` 文件还要放在头部呢？

因为先加载 `HTML` 再加载 `CSS`，会让用户第一时间看到的页面是没有样式的、“丑陋”的，为了避免这种情况发生，就要将 `CSS` 文件放在头部了。

另外，`JS` 文件也不是不可以放在头部，只要给 `script` 标签加上 `defer` 属性就可以了，`异步下载，延迟执行`。

### 2.9 静态资源使用 CDN

用户与服务器的物理距离对响应时间也有影响。
把内容部署在多个地理位置分散的服务器上能让用户更快地载入页面, `CDN` 就是为了解决这一问题，在多个位置部署服务器，让用户离服务器更近，从而缩短请求时间。

![](./images/001_静态资源使用CDN.png)

### 2.10 图片优化

**雪碧图**

图片可以合并么？当然。最为常用的图片合并场景就是`雪碧图（Sprite）`。

在网站上通常会有很多小的图标，不经优化的话，最直接的方式就是将这些小图标保存为一个个独立的图片文件，然后通过 `CSS` 将对应元素的背景图片设置为对应的图标图片。这么做的一个重要问题在于，页面加载时可能会同时请求非常多的小图标图片，这就会受到浏览器并发 `HTTP` 请求数的限制。

雪碧图的核心原理在于设置不同的背景偏移量，大致包含两点：

- 不同的图标元素都会将 `background-url` 设置为合并后的雪碧图的 `uri`；
- 不同的图标通过设置对应的 `background-position` 来展示大图中对应的图标部分。
  比较推荐的还是将雪碧图的生成集成到前端自动化构建工具中，例如在 `webpack` 中使用 `webpack-spritesmith`，或者在 `gulp` 中使用 `gulp.spritesmith`。
  它们两者都是基于 `spritesmith` 这个库。

**图片懒加载**

一般来说，我们访问网站页面时，其实很多图片并不在首屏中，如果我们都加载的话，相当于是加载了用户不一定会看到图片，这显然是一种浪费。
解决的核心思路就是懒加载：实现方式就是先不给图片设置路径，当图片出现在浏览器可视区域时才设置真正的图片路径。

实现上就是先将图片路径设置给 `original-src`，当图片元素不可见时，图片不会加载：

```html
<img original-src="http://www.test.com/test.png" />
```

通过监听页面滚动，等图片元素可见时设置图片 `src`：

```js
const img = document.querySelector('img');
img.src = img.getAttribute('original-src');
```

如果想使用懒加载，还可以借助一些已有的工具库，例如 `lazyload` 等。

**css 中图片懒加载**

除了对于 `<img>` 元素的图片进行懒加载，在 `CSS` 中使用的图片一样可以懒加载，最常见的场景就是 `background-url`。

```css
.login {
  background-url: url(/static/images/test.png);
}
```

对于上面这个样式规则，如果不应用到具体的元素，浏览器不会去下载该图片。
所以你可以通过切换 `className` 的方式，放心的进行 `CSS` 中图片的懒加载。

## 3. 运行时性能优化

### 3.1 减少重绘与重排

有前端经验的开发者对这个概念一定不会陌生，浏览器下载完页面需要的所有资源后，就开始渲染页面，主要经历这 `5` 个过程：

- 解析 `HTML` 生成 `DOM` 树；
- 解析 `CSS` 生成 `CSSOM` 规则树；
- 将 `DOM` 树与 `CSSOM` 规则树合并生成 `Render(渲染)` 树；
- 遍历 `Render(渲染)` 树开始布局，计算每一个节点的位置大小信息；
- 将渲染树每个节点绘制到屏幕上；

![](./images/002_浏览器渲染过程.png)

**重排**

当改变 `DOM` 元素位置或者大小时，会导致浏览器重新生成 `Render` 树，这个过程叫重排。

**重绘**

当重新生成渲染树后，将要将渲染树每个节点绘制到屏幕，这个过程叫重绘。

**重排触发时机**

重排发生的根本原理就是元素的几何属性发生改变， 所以从能够改变几何属性的角度入手：

- 添加|删除可见的 `DOM` 元素；
- 元素位置发生改变；
- 元素本身的尺寸发生改变；
- 内容变化；
- 页面渲染器初始化；
- 浏览器窗口大小发生改变；

> 二者关系：重排会导致重绘，但是重绘不会导致重排。

了解了重排和重绘这两个概念，我们还要知道重排和重绘的开销都是非常昂贵的，如果不停的改变页面的布局，就会造成浏览器消耗大量的开销在进行页面的计算上，这样容易造成页面卡顿。
那么回到我们的问题`如何减少重绘与重排呢？`

#### 3.1.1 避免 table 布局

不要使用 `table` 布局，可能很小的一个改动会造成整个 `table` 重新布局。

#### 3.1.2 分离读写操作

`DOM` 的多个读操作（或多个写操作），应该放在一起。不要两个读操作之间，加入一个写操作。

```js
// bad 强制刷新 触发四次重排+重绘
div.style.left = `${div.offsetLeft + 1}px`;
div.style.top = `${div.offsetTop + 1}px`;
div.style.right = `${div.offsetRight + 1}px`;
div.style.bottom = `${div.offsetBottom + 1}px`;

// good 缓存布局信息 相当于读写分离 触发一次重排+重绘
const curLeft = div.offsetLeft;
const curTop = div.offsetTop;
const curRight = div.offsetRight;
const curBottom = div.offsetBottom;

div.style.left = `${curLeft + 1}px`;
div.style.top = `${curTop + 1}px`;
div.style.right = `${curRight + 1}px`;
div.style.bottom = `${curBottom + 1}px`;
```

#### 3.1.3 样式集中改变

不要频发的操作样式，虽然现在大部分浏览器有渲染队列优化，但是在一些老版本的浏览器仍然存在效率低下的问题：

```js
// 三次重排
div.style.left = '10px';
div.style.top = '10px';
div.style.width = '20px';

// 一次重排
el.style.cssText = 'left: 10px;top: 10px; width: 20px;';
```

或者可以采用更改类名而不是修改样式的方式。

#### 3.1.4 position 属性为 absolute 或 fixed

使用绝对定位会使的该元素单独成为渲染树中 `body` 的一个子元素，重排开销比较小，不会对其它节点造成太多影响。
当你在这些节点上放置这个元素时，一些其它在这个区域内的节点可能需要重绘，但是不需要重排。

### 3.2 避免页面卡顿

我们目前大多数屏幕的刷新率为 `60 次/s`，浏览器渲染更新页面的标准帧率也为 `60 次/s` ---- `60FPS(frames/pre second)`。
那么每一帧的预算时间约为 `16.6ms ≈ 1s/60`，浏览器在这个时间内要完成所有的整理工作，如果无法符合此预算，帧率将下降，内容会在屏幕抖动，此现象通常称为卡顿。

浏览器需要做的工作包含下面这个流程：

![](./images/003_浏览器帧渲染.png)

首先你用 `js` 做了些逻辑，还触发了样式变化，`style` 把应用的样式规则计算好之后，把影响到的页面元素进行重新布局，叫做 `layout`，再把它画到内存的一个画布里面，`paint` 成了像素，最后把这个画布刷到屏幕上去，叫做 `composite`，形成一帧。

这几项的任何一项如果执行时间太长了，就会导致渲染这一帧的时间太长，平均帧率就会掉。
假设这一帧花了 `50ms`，那么此时的帧率就为 `1s / 50ms = 20fps`。

当然上面的过程并不一定每一步都会执行，例如：

- 你的 `js` 只是做一些运算，并没有增删 `DOM` 或改变 `CSS`，那么后续几步就不会执行；
- `style` 只改了颜色等不需要重新 `layout` 的属性就不用执行 `layout` 这一步；

### 3.3 滚动事件性能优化

前端最容易碰到的性能问题的场景之一就是监听滚动事件并进行相应的操作。
由于滚动事件发生非常频繁，所以频繁地执行监听回调就容易造成 `JavaScript` 执行与页面渲染之间互相阻塞的情况。

对应滚动这个场景，可以采用`防抖`和`节流`来处理。

当一个事件频繁触发，而我们希望间隔一定的时间再触发相应的函数时，就可以使用`节流（throttle）`来处理。
比如拖拽某个元素到某个位置，就可以使用节流，在拖拽时每 `300ms` 进行一次计算位置，而不用每次拖拽回调都执行。

当一个事件频繁触发，而我们希望在事件触发结束一段时间后（此段时间内不再有触发）才实际触发响应函数时会使用防抖（debounce）。
例如用户一直点击按钮，但你不希望频繁发送请求，你就可以设置当点击后 `200ms` 内用户不再点击时才发送请求。

### 3.4 使用 Web Workers

大量数据列表的渲染我们可以采用虚拟列表的方式实现，但是大量数据的计算依然会产生浏览器假死或者卡顿的情况。

通常情况下我们 `CPU` 密集型的任务都是交给后端计算的，但是有些时候我们需要处理一些离线场景或者解放后端压力，这个时候此方法就不奏效了.

还有一种方法是计算切片，使用 `setTimeout` 拆分密集型任务，但是有些计算无法利用此方法拆解，同时还可能产生副作用，这个方法需要视具体场景而使用。

最后一种方法也是目前比较奏效的方法就是利用 Web Worker 进行多线程编程.

`Web Worker` 是一个独立的线程（独立的执行环境），这就意味着它可以完全和 `UI 线程（主线程）`并行的执行 `js` 代码，从而不会阻塞 `UI`，它和主线程是通过 `onmessage` 和 `postMessage` 接口进行通信的。

`Web Worker` 使得网页中进行多线程编程成为可能。
当主线程在处理界面事件时，`worker` 可以在后台运行，帮你处理大量的数据计算，当计算完成，将计算结果返回给主线程，由主线程更新 `DOM` 元素。

### 3.5 写代码时的优化点

提升性能，有时候在我们写代码时注意一些细节也是有效果的。

#### 3.5.1 使用事件委托

看一下下面这段代码：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>事件委托</title>
  </head>
  <body>
    <ul>
      <li>字节跳动</li>
      <li>阿里</li>
      <li>腾讯</li>
      <li>京东</li>
    </ul>
    <script>
      window.onload = function () {
        // good
        document.querySelector("ul").onclick = (event) => {
          const target = event.target;
          if (target.nodeName === "LI") {
            console.log("proxy:", target.innerHTML);
          }
        };

        // bad
        document.querySelectorAll("li").forEach((item) => {
          item.onclick = function (event) {
            const target = event.target;
            console.log("current:", target.innerHTML);
          };
        });
      };
    </script>
  </body>
</html>
```

绑定的事件越多，浏览器内存占有就越多，从而影响性能，利用事件代理的方式就可节省一些内存。

#### 3.5.2 if-else 对比 switch

当判定条件越来越多时，越倾向于使用 `switch`，而不是 `if-else`：

```js
const state = '';

if (state === 0) {
  console.log('待开通');
}
else if (state === 1) {
  console.log('学习中');
}
else if (state === 2) {
  console.log('休学中');
}
else if (state === 3) {
  console.log('已过期');
}
else if (state === 4) {
  console.log('未购买');
}

switch (state) {
  case 0:
    break;
  case 1:
    break;
  case 2:
    break;
  case 3:
    break;
  case 4:
    break;
}
```

向上面这种情况使用 `switch` 更好，假设 `state` 为 `4`，那么 `if-else` 语句就要进行 `4` 次判定，`switch` 只要进行一次即可。

但是有的情况下 `switch` 也做不到 `if-else` 的事情, 例如有多个判断条件的情况下，无法使用 `switch`。

#### 3.6.3 布局上使用 flexbox

在早期的 `CSS` 布局方式中我们能对元素实行绝对定位、相对定位或浮动定位。
而现在，我们有了新的布局方式 `flexbox`，它比起早期的布局方式来说有个优势，那就是性能比较好。

## 4. 参考

- [7000 字前端性能优化总结 | 干货建议收藏](https://mp.weixin.qq.com/s/SP3vN2Ki9RQ9tj22KP2J0g)
