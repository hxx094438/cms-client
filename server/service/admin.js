import mongoose from 'mongoose'

const User = mongoose.model('User')


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
  return result && result.toObject()
}

export const seed = async () => {
  let user = null

  try {
    user = await findOne()

    if(user === null ) {
      user = new User()
    }


  }


}