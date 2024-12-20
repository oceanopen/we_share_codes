// server.js

const path = require('node:path');

const Koa = require('koa');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const koaStatic = require('koa-static');

const app = new Koa();

app.use(conditional()); // 使用条件请求中间件
app.use(etag()); // 使用etag中间件
app.use(
  // 使用静态资源中间件
  koaStatic(path.join(__dirname, '/public'), {
    maxage: 10 * 1000, // 设置缓存存储的最大周期，单位为秒
  }),
);

app.listen(3000, () => {
  console.log('app starting at port 3000');
});
