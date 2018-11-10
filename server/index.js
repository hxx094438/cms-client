/*
 * @Author: huangxiaoxun 
 * @Date: 2018-10-28 15:24:14 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2018-11-08 00:31:17
 */

const config = require('./config/index')

const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const onerror = require('koa-onerror')
const mongoose = require('mongoose')
const router = require('koa-router')

mongoose.Promise = global.Promise

;(async function () {
  mongoose.connect(config.mongoConfig.url, {useNewUrlParser: true}, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Connection success!')
    }
  })
  /**
   * 将config注入中间件的ctx
   * */
  app.context.config = config


  onerror(app, {
    json (err) {
      Object.keys(err).reduce((body, key) => {
        body[key] = err[key]
        return body
      }, this.body = {})
      this.body.error = err.name
    }
  })

  app.use(bodyParser())
  app.use(require('./routes/index.js').routes())

  app.listen(config.app.port, () => {
    console.log('app is listening on port ' + config.app.port)
  })
})().catch(err => {
  console.log(err)
})
