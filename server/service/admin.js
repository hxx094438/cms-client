import mongoose from 'mongoose'

const User = mongoose.model('User')

export async function checkPassword(name, password) {
  let match = false

  const user = await User.findOne({ name: name }).exec()

  if (user) {
    match = await user.comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}