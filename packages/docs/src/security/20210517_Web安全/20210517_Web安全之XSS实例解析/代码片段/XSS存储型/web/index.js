const Koa = require('koa');

const app = new Koa();
const KoaStatic = require('koa-static');

app.use(KoaStatic(__dirname));

app.listen(8080, () => {
    console.log('启动成功');
});
