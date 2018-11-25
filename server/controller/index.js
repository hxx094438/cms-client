/**
 * @author Huangxiaoxun<hxx09448@gmail.com>
 * @date 2018/11/10
 */
const db = require('../model/db')
const sha1 = require('sha1')

exports.getLogin = async ctx => {
    const { name,password } = ctx.request.body

    console.log(`账号:${name},密码:${password}`)
    db.User.findOne({name:name}, (err,doc) => {
    if(err) {
      console.log(err)
    } else if (doc) {
       if(doc.password === sha1(password + doc.salt)) {
         console.log('密码正确')
         verify = true
       }
      let password = doc.password
      ctx.body = {
        password
      }

    }
  })

  let html =     '<p>你好</p>'

  ctx.body = {
    html
  }
}

exports.getArticle = async ctx => {
  let request = ctx.request

}