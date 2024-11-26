const Koa = require('koa');

const app = new Koa();
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');

// 临时用一个变量来存储，实际应该存在数据库中
const currentUserName = '';

app.use(bodyParser()); // 处理post请求的参数

function home(ctx) {
    // 简单设置一个cookie
    if (ctx.cookies.get('cid')) {
        console.log('cookie || cid:', ctx.cookies.get('cid'));
    } else {
        ctx.cookies.set('cid', 'hello world', {
            domain: '127.0.0.1', // 写cookie所在的域名
            path: '/', // 写cookie所在的路径
            expires: new Date('2021-05-19'), // cookie失效时间
            httpOnly: true, // 是否只用于http请求中获取
            overwrite: false, // 是否允许重写
        });
    }

    ctx.body = currentUserName;
}

app.use(cors());

app.use(route.get('/home', home));

app.listen(3200, () => {
    console.log('启动成功');
});
