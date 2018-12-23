const Router = require('koa-router')
const mongoose = require('mongoose')

const router = new Router()

import{
  Controller,
  Get,
  Required
} from '../decorator/router'

import {
  getAllArticles
} from '../service/articles'


@Controller('/api/articles')
export class ArticleRouter {
  @Get('/')
  async getArticles(ctx, next) {
    const Article = mongoose.model('article')
    const articles = await getAllArticles.find({})

    ctx.body = {
      data: articles,
      success: true
    }
  }
}