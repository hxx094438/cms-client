/**
 * @author Huangxiaoxun<hxx09448@gmail.com>
 * @date 2018/11/10
 */
const db = require('../model/db')
const sha1 = require('sha1')
let User = db.User

exports.getLogin = async ctx => {
  let request = ctx.request,
    query = request.query


  db.User.findOne({name:query.name}, (err,doc) => {
    if(err) {
      console.log(err)
    } else if (doc) {
      if(doc.password === sha1(query.password + doc.salt)) {
        console.log('密码正确')
        verify = true
      }
    }
  })


}