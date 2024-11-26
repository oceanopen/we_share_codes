const Koa = require('koa');

const app = new Koa();
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');

// 临时用一个变量来存储，实际应该存在数据库中
let currentUserName = '';

app.use(bodyParser()); // 处理post请求的参数

function login(ctx) {
    const req = ctx.request.body;
    const userName = req.userName;
    currentUserName = userName;

    ctx.response.body = {
        msg: '登录成功',
    };
}

function home(ctx) {
    ctx.body = currentUserName;
}

app.use(cors());

app.use(route.post('/login', login));
app.use(route.get('/home', home));

app.listen(3200, () => {
    console.log('启动成功');
});
