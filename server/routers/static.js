// 处理静态文件
const Router = require('koa-router');
const send = require('koa-send');

const staticRouter = new Router({ prefix: '/dist' });

staticRouter.get('/*', async ctx => {
  console.log('ctx.url',ctx.url)
  await send(ctx, ctx.path);
});

module.exports = staticRouter;
