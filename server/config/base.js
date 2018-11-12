/*
 * @Author: huangxiaoxun 
 * @Date: 2018-10-28 15:51:57 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2018-11-12 21:45:22
 */

const path = require('path')

// 生产环境配置
module.exports = {
    // 应用配置
    app: {
        name: 'koa-blog',
        port: 3002,
        // 后台路径
        apiPath: '/api'
    },

    // 是否开启 debug
    debug: false,

    // mongo 数据库配置
    mongoConfig: { // 数据库配置
        url: 'mongodb://127.0.0.1:27017/hxx',
        opts: {
            user: '',
            pass: ''
        }
    },

    // jwt 私钥
    jwt: {
        'cert': 'hxx-blog'
    },

}
