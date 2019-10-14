// 处理静态文件
const Router = require('koa-router');
const send = require('koa-send');
const c2k = require('koa-connect');
const proxy = require('http-proxy-middleware')

export default (app) => {
  const staticRouter = new Router({ prefix: '/dist' });
  staticRouter
  .get('/*', c2k(proxy({
    target: "http://localhost:8084",
    changeOrigin:true,
  })))
  .get('/*', async ctx => {
    console.log('ctx.url',ctx.url)
    await send(ctx, ctx.path);
  });
  app.use(staticRouter.routes()).use(staticRouter.allowedMethods());

} 
