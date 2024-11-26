// server.js

const path = require('node:path');
const Buffer = require('node:buffer').Buffer;

const Koa = require('koa');
const koaStatic = require('koa-static');

const app = new Koa();

app.use(
    // 使用静态资源中间件
    koaStatic(path.join(__dirname, '/public')),
);

function parse(req) {
    return new Promise((resolve) => {
        const chunks = [];

        req.on('data', (buf) => {
            chunks.push(buf);
        });
        req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer.toString());
        });
    });
}

app.use(async (ctx, next) => {
    await next();

    if (ctx.path === '/ajax') {
        const req = ctx.req;

        const body = await parse(req);
        ctx.status = 200;

        console.log(body);
    }
});

app.listen(3000, () => {
    console.log('app starting at port 3000');
});
