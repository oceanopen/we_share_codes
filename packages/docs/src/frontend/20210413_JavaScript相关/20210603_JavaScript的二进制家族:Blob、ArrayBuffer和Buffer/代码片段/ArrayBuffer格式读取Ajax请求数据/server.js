// server.js

const path = require('node:path');

const Koa = require('koa');
const koaStatic = require('koa-static');

const app = new Koa();

app.use(
    // 使用静态资源中间件
    koaStatic(path.join(__dirname, '/public')),
);

app.use(async (ctx, next) => {
    await next();

    if (ctx.path === '/ajax') {
        ctx.body = 'hello world';
        ctx.status = 200;
    }
});

app.listen(3000, () => {
    console.log('app starting at port 3000');
});
