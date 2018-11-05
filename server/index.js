/*
 * @Author: huangxiaoxun 
 * @Date: 2018-10-28 15:24:14 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2018-11-06 00:32:23
 */

 const config = require('./config/index')

 const Koa = require('koa')
 const app = new Koa()
 const bodyParser = require('koa-bodyparser')
 
 const onerror = require('koa-onerror')

 const mongoose = require('mongoose')


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
    app.listen(config.app.port, () => {
        console.log('app is listening on port ' + config.app.port)
    })
})().catch( err =>{
    console.log(err)
})
