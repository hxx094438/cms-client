/*
 * @Author: huangxiaoxun 
 * @Date: 2018-10-28 15:24:14 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-03-30 22:29:52
 */
import { join } from 'path'
import Koa from 'koa'
const send = require('koa-send');
const path = require('path');
import R from 'ramda'
import chalk from 'chalk'
import config from './config/index'
// import serve from 'koa-static'
const staticRouter = require('./routers/static');


const MIDDLEWARES = ['ssr']
const isDev = process.env.NODE_ENV === 'development';

const app = new Koa()

console.log('app',app)

// const useMiddlewares = (app) => {
//   R.map(
//     R.compose(
//       R.forEachObjIndexed(
//         e => e(app)
//       ),
//       require,
//       name => join(__dirname, `./middleware/${name}`)
//     )
//   )(MIDDLEWARES)
// }


;(async function () {
  /**
   * 将config注入中间件的ctx
   * */
  // app.context.config = config

  let pageRouter;
  if (isDev) {
    pageRouter = require('./routers/dev-ssr');
  } else {
    pageRouter = require('./routers/ssr');
  }

//   const staticPath = '../dist'
// // console.log('pathpath', path.join(__dirname, staticPath))
//   app.use(serve(
//     path.join(__dirname, staticPath)
//   ))


app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    await send(ctx, '/favicon.ico', {root: path.join(__dirname, '../')});
  } else {
    await next();
  }
});
  
  app.use(staticRouter.routes()).use(staticRouter.allowedMethods());

  app.use(pageRouter.routes()).use(pageRouter.allowedMethods());





 
  // await useMiddlewares(app)  


  // app.use(pageRouter.routes()).use(pageRouter.allowedMethods())


  // app.use(require('./routes/index.js').routes())
  
  app.listen(config.app.port, () => {
    console.log(`app is listening on port ${chalk.green(config.app.port)}`)
  })
})().catch(err => {
  console.log(err)
})
