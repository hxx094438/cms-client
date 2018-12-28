/*
 * @Author: huangxiaoxun 
 * @Date: 2018-12-28 01:03:20 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2018-12-28 01:44:45
 */


import {
  Controller,
  Get,
  Required
} from '../decorator/router'

import ArticleService from '../service/articles'


@Controller('/api/articles')
export class ArticleRouter {
  @Get('/all')
  @Required({
    body: ['page', 'value', 'limit']
  })
  async getAllArticles(ctx, next) {
    let articles = null
    // console.log('ctx.request.body',ctx.request.body)
    const {page, value, limit} = ctx.request.body
    try {
      articles = await ArticleService.getAllArticles({
        value: value,
        limit: limit - 0 || 4,
        skip: limit * (page - 1),
      })
    } catch (e) {
      console.log(e)
      throw e
    }
    console.log('rep', articles)

    ctx.status = 200
    ctx.body = {
      data: articles,
      success: true
    }
  }


  @Get('/:aid')
  async getArticle(ctx, next) {
    let article = null
    const { aid } = ctx.params
    try {
      article = await ArticleService.getArticle({
        aid : aid
      })
    } catch (e) {
      console.log(e)
      throw e
    }

    ctx.status = 200
    ctx.body = {
      success: true,
      data: article
    }
  }


}