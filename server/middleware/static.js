// 处理静态文件
const Router = require('koa-router');
const send = require('koa-send');
const c2k = require('koa-connect');
const proxy = require('http-proxy-middleware')

export default (app) => {
  const staticRouter = new Router({ prefix: '/dist' });
  // app.use('/api', proxy({target: 'http://localhost:3001/', changeOrigin: true}))
  staticRouter
  .get('/*', c2k(proxy({
    target: "http://localhost:8083",
    changeOrigin:true,
  })))
  .get('/*', async ctx => {
    console.log('ctx.url',ctx.url)
    await send(ctx, ctx.path);
  });
  app.use(staticRouter.routes()).use(staticRouter.allowedMethods());

} 
