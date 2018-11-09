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
const router = require('./routes')
 
mongoose.Promise = global.Promise

;(async function () {
    mongoose.connect(config.mongoConfig.url, {useNewUrlParser:true}, (err) => {
        if(err) {
            console.log(err)
        } else {
            console.log('Connection success!')
        }
    })
    /**
     * 将config注入中间件的ctx
     * */
    app.context.config = config
    app.use(router.routes()).use(router.alloweMethods())

    app.use(async (ctx, next) => {
        ctx.body = '嘻嘻'
    })
    app.listen(config.app.port, () => {
        console.log('app is listening on port ' + config.app.port)
    })
})().catch( err =>{
    console.log(err)
})
