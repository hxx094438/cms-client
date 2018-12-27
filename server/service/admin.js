import sha1 from 'sha1'
import rand from 'csprng'
import User from '../database/schema/user'

class UserService {
  async checkPassword (name, password) {
    let match = false
    let user = await this.findOne(name)
    console.log('checkuser',user)
    if (user) {
      match = await user.comparePassword(password, user)
    }

    return {
      match,
      user
    }
  }

  async findOne (name = null) {
    let searchParam = {},result

    if( name) {
      searchParam.name = name
    }

    try{
      result = await User.findOne(searchParam).exec()
    } catch (e) {
      console.log(e)
    }
    return result
  }

  async update (id ,params){
    let result = null
    try {
      result = await User.findByIdAndUpdate(id, {
        $set: params
      }, {
        new: true
      }).exec()
    } catch (e) {
      console.log(e)
      throw e
    }
    return result
  }


  async seed() {
    let user = await this.findOne()
    let result = null

    if(user === null ) {
      const salt = rand(160, 36)
      console.log('user null')
      user = new User({
        name: 'admin',
        password: sha1('admin' + salt),
        salt: salt,
      })
      try {
        result = user.save()
      } catch (e) {
        console.log(e)
        throw e
      }
      console.log('result',result)
      return result
    }
  }

}

module.exports = new UserService()



