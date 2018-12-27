import sha1 from 'sha1'
import rand from 'csprng'
import User from '../database/schema/user'


export const checkPassword = async (name, password) => {
  let match = false
  let user = await findOne(name)
  console.log('checkuser',user)
  if (user) {
    match = await user.comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}

export const findOne = async(name = null) => {
  let searchParam = {},result

  if( name) {
    searchParam.name = name
  }
  try{
    result = await User.findOne(searchParam).exec()
  } catch (e) {
    console.log(e)
  }
  //toObject  mongodb api
  return result
}

export const seed = async () => {
  let user = null,
    result = null

    user = await findOne()

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