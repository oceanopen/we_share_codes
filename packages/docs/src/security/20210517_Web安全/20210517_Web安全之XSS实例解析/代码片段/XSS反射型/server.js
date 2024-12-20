const Koa = require('koa');
// Koa官网：https://koa.bootcss.com/
const app = new Koa();
const cors = require('@koa/cors'); // https://github.com/koajs/cors/
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');

app.use(bodyParser()); // 处理post请求的参数

function xssServer(ctx) {
  // ctx.body 即服务端响应的数据
  ctx.body = '<script>alert("反射型 XSS 攻击")</script>';
}

function xssParams(ctx) {
  // ctx.body 即服务端响应的数据
  ctx.body = ctx.query.userName;
}

app.use(cors());

// XSS反射型之网络请求恶意脚本
app.use(route.get('/xss-server', xssServer));
// XSS反射型之请求恶意参数
app.use(route.get('/xss-params', xssParams));

app.listen(3000, () => {
  console.log('启动成功');
});
