# JS 实现网页截屏两种方法

![](./images/001_封面.png)

## 1. 前言

利用 `JavaScript` 实现网页截屏，包括在浏览器运行的 `JS`，以及在后台运行的 `nodeJs` 的方法。
这里主要介绍以下两个：

- `Puppeteer(chrome headless)`
- `html2canvas`

> 名词解释：**headless browser**: 无界面浏览器，多用于网页自动化测试、网页截屏、网页的网络监控等。

## 2. Puppeteer(chrome headless)

`Puppeteer` 是一个 `Node` 库，提供了控制 `chrome` 和 `chromium` 的 `API`。文档[这里](https://blog.csdn.net/mengxiangxingdong/article/details/99237204)。
默认运行 `headless` 模式，也支持界面运行。

环境：

```bash
npm init -y
npm install -S puppeteer
```

代码：

```js
// index.js

const puppeteer = require('puppeteer');

;(async () => {
  const browser = await puppeteer.launch({
    // 无头模式，不打开浏览器显示脚本运行过程，可以在调试过程中打开
    headless: false,
  });
  const page = await browser.newPage();
  // 进入目标页面，并等待直到没有网络连接的时候向下进行
  await page.goto('https://www.baidu.com', {
    waitUntil: 'networkidle2',
  });

  const mobile = puppeteer.devices['iPhone X'];
  page.emulate(mobile);
  // 等待 5 秒
  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'www.baidu.com.png' });

  await browser.close();
})();
```

执行：

```bash
node index.js
```

可看到自动生成移动端网页截图。

## 3. html2canvas 实现

我们这里通过组件库[html2canvas](https://github.com/niklasvh/html2canvas)实现。

初始化项目：

```bash
yarn create vite html2canvas --template vue-ts
yarn install
yarn add html2canvas
```

代码：

```html
<script setup lang="ts">
  // ...
  import html2canvas from "html2canvas";

  const clickScreenshotHandler = () => {
    html2canvas(document.body).then(function (canvas) {
      document.body.appendChild(canvas);
    });
  };
</script>

<template>
  <!-- ... -->
  <button @click="clickScreenshotHandler">截图</button>
</template>
```

## 4. 参考

- [JS 实现网页截屏五种方法](https://mp.weixin.qq.com/s/cRY93hT6nvhMHGo8smFLCA)
- [浅析 js 实现网页截图的两种方式](https://www.jb51.net/article/173308.htm)
