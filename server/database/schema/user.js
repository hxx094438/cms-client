const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema(
  {
      name: String,
      password: String,
      salt: String            // 使用csprng随机生成的盐
  },
  {versionKey: false}
)


UserSchema.methods = {
  comparePassword:  (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password,  (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },




}

module.exports = mongoose.model('User', UserSchema)
