/*
 * @Author: huangxiaoxun 
 * @Date: 2018-12-28 01:03:20 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2018-12-28 01:44:45
 */


import{
  Controller,
  Get,
  Required
} from '../decorator/router'

import ArticleService from '../service/articles'


@Controller('/api/articles')
export class ArticleRouter {
  @Get('/all')
  async getAllArticles(ctx, next) {
    const page = ctx.query.payload.page
    const articles = await ArticleService.getAllArticles({
      value : ctx.query.payload.value,
      limit : ctx.query.payload.limit - 0 || 4,
      skip : limit * (page - 1),
    })

    ctx.status = 200
    ctx.body = {
      data: articles,
      success: true
    }
  }
}