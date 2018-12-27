import {
  Controller,
  Post,
  Auth,
  Get,
  Required,
} from '../decorator/router'
import UserService from '../service/admin'



@Controller('/api/admin')
export default class AdminRouter {
  @Post('/login')
  @Required({
    body: ['name', 'password']
  })
  // @Auth
  async adminLogin (ctx, next) {
    console.log('ctx','撒的撒的撒的撒的旦撒旦撒')

    const { name, password } = ctx.request.body

    const data = await UserService.checkPassword(name, password)
    const { user, match } = data
    if (match) {

      ctx.session.user = {
        _id: user._id,
        name: user.name,
        role: user.role,
        username: user.username
      }
      return (ctx.body = {
        success: true,
        data: {
          name: user.name,
          username: user.username
        }
      })
    }

    return (ctx.body = {
      success: false,
      err: '密码错误'
    })
  }







}
