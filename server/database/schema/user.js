import mongoose from 'mongoose'
const Schema = mongoose.Schema


const UserSchema = new Schema(
  {
    name: String,
    password: String,
    weak_pwd: Boolean,
    salt: String,            // 使用csprng随机生成的盐
    nickname: String,
    mobilephone: Number,
    avatar: String,
    role: String,
    from: String,
    gender: String,
    songList: Object,
    meta: {
      createdAt: {
        type: Date,
        default: Date.now()
      },
      updatedAt: {
        type: Date,
        default: Date.now()
      }
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0
    },
  },
  {versionKey: false}
)


UserSchema.methods = {
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },


}

module.exports = mongoose.model('User', UserSchema)
