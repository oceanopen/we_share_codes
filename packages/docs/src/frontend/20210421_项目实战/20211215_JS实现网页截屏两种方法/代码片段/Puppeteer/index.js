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
