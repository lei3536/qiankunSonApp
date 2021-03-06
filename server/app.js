const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const compress = require('koa-compress');
const historyApiFallback = require('koa2-connect-history-api-fallback');

const app = new Koa();
const port = parseInt(process.env.PORT, 10) || 8000;

app.use(compress());

app.use(async (ctx, next) => {
  await next();

  if (ctx.path === '/' || ctx.path === '/index.html') {
    ctx.set('cache-control', 'no-cache');
  }
});

const serveOptions = {
  maxage: 30 * 24 * 60 * 60 * 1000,
};

app.use(historyApiFallback());
app.use(serve('./build', serveOptions));
app.use(mount('/guocha', serve('./build', serveOptions)));

app.listen(port);
console.log('> start ${port}');
