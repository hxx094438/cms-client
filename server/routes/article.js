/*
 * @Author: huangxiaoxun 
 * @Date: 2018-12-28 01:03:20 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2018-12-28 01:44:45
 */


import {
  Controller,
  Get,
  Post,
  Required,
  Auth
} from '../decorator/router'

import ArticleService from '../service/articles'


@Controller('/api/articles')
export class ArticleRouter {
  @Post('/send')
  @Required({
    body: ['article']
  })
  @Auth
  async sendArticle(ctx, next) {
    const { article} = ctx.request.body
    try {
      await ArticleService._sendArticle(article)
    } catch (e) {
      console.log(e)
      throw e
    }

    ctx.status = 200
    ctx.body = {
      msg: '保存成功',
      success: true
    }
  }


  @Get('/all')
  @Required({
    body: ['page', 'value', 'limit']
  })
  async getAllArticles(ctx, next) {
    let articles = null
    // console.log('ctx.request.body',ctx.request.body)
    const {page, value, limit} = ctx.request.body
    try {
      articles = await ArticleService._getAllArticles({
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
      article = await ArticleService._getArticle({
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