/*
 * @Author: huangxiaoxun 
 * @Date: 2018-10-28 15:24:14 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2018-11-25 20:21:25
 */

const config = require('./config/index')

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
// const onerror = require('koa-onerror')
const mongoose = require('mongoose')
const router = require('koa-router')
import { join } from 'path'

// mongoose.Promise = global.Promise

const MIDDLEWARES = ['database', 'general', 'router', 'parcel']

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        e => e(app)
      ),
      require,
      name => join(__dirname, `./middleware/${name}`)
    )
  )(MIDDLEWARES)
}

;(async function () {
  // mongoose.connect(config.mongoConfig.url, {useNewUrlParser: true}, (err) => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     console.log('Connection success!')
  //   }
  // })
  /**
   * 将config注入中间件的ctx
   * */
  app.context.config = config


  const app = new Koa()
  await useMiddlewares(app)

  app.use(require('./routes/index.js').routes())
  
  app.listen(config.app.port, () => {
    console.log('app is listening on port ' + config.app.port)
  })
})().catch(err => {
  console.log(err)
})
