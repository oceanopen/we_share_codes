/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
const Koa = require('koa');

const app = new Koa();
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const KoaStatic = require('koa-static');

let currentUserName = '';

// 使用  koa-static  使得前后端都在同一个服务下
app.use(KoaStatic(__dirname));

app.use(bodyParser()); // 处理post请求的参数

// 初始金额为 1000
let money = 1000;

// 调用登录的接口
function login(ctx) {
    const req = ctx.request.body;
    const userName = req.userName;
    currentUserName = userName;

    // 简单设置一个cookie
    ctx.cookies.set('name', userName, {
        domain: '127.0.0.1', // 写cookie所在的域名
        path: '/', // 写cookie所在的路径
        maxAge: 24 * 60 * 60 * 1000, // cookie有效时长，单位毫秒。设置为24小时
        expires: new Date('2021-12-31'), // cookie失效时间
        overwrite: false, // 是否允许重写
        SameSite: 'None',
    });
    ctx.response.body = {
        data: {
            money,
        },
        msg: '登录成功',
    };
}

// 调用支付的接口
function pay(ctx) {
    // 根据有没有 cookie 来简单判断是否登录
    if (ctx.cookies.get('name')) {
        if (ctx.method === 'GET') {
            money = money - Number(ctx.request.query.money);
        } else {
            money = money - Number(ctx.request.body.money);
        }

        ctx.response.body = {
            data: {
                money,
            },
            msg: '支付成功',
        };
    } else {
        ctx.response.body = {
            data: {},
            msg: '未登录',
        };
    }
}

// 判断是否登录
function isLogin(ctx) {
    if (ctx.cookies.get('name')) {
        ctx.response.body = {
            data: true,
            msg: '登录成功',
        };
    } else {
        ctx.response.body = {
            data: false,
            msg: '未登录',
        };
    }
}

// 处理 options 请求
app.use(async (ctx, next) => {
    const headers = ctx.request.headers;

    ctx.set('Access-Control-Allow-Origin', headers.origin);
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    ctx.set('Access-Control-Allow-Credentials', 'true');

    if (ctx.method === 'OPTIONS') {
        ctx.status = 204;
    } else {
        await next();
    }
});

app.use(cors());

app.use(route.post('/login', login));
app.use(route.post('/pay', pay));
app.use(route.get('/pay', pay));
app.use(route.post('/isLogin', isLogin));

app.listen(3200, () => {
    console.log('启动成功');
});
