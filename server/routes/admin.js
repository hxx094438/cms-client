import mongoose from 'mongoose'
import {
  Controller,
  Post,
  Auth,
  Get,
  Required,
} from '../decorator/router'
import { checkPassword } from '../service/admin'

@Controller('/admin')
export default class AdminRouter {
  @Post('/login')
  @Required({
    body: ['name', 'password']
  })
  @Auth
  async adminLogin (ctx, next) {
    const { name, password } = ctx.request.body
    const data = await checkPassword(name, password)
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
