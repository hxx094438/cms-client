/*
 * @Author: huangxiaoxun 
 * @Date: 2018-12-28 01:03:15 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2018-12-28 01:38:55
 */



import Article from '../database/schema/article'


class ArticleService {

  /**
   *
   * @param {opt} param0
   *
   */
  async getAllArticles({
    value,  //tags
    limit,  //最大值
    skip  // 页码
  }) {
    let _articles = {}
    //文章总数
    try {
      _articles.total = await Article.countDocuments({
        isPublish: true
      }).exec()
    } catch (e) {
      console.log(e)
      throw e
    }

    if (value && value !== '全部') {
      try {
        _articles.articles = await Article.find({
          tags: value,
          isPublish: true
        }).sort({
          date: -1
        }).limit(limit).skip(skip).exec()
      } catch (e) {
        console.log(e)
        throw e
      }
    } else {
      try{
        _articles.articles = await Article.find({
          isPublish: true
        }).sort({
          date: -1
        }).limit(limit).skip(skip).exec()
      } catch (e) {
        console.log(e)
        throw e
      }
    }
    return _articles
  }


//   router.get('/api/article/:aid', (req, res) => {
//   db.Article.findOne({aid: req.params.aid}, (err, doc) => {
//   if (err) {
//     console.log(err)
//   } else {
//     res.status(200).send(doc)
//   }
// })
// })

  async getArticle ({aid}) {
    let article = null
    try{
      article = await Article.findOne({
        aid: aid
      })
        .exec()
    } catch (e) {
      console.log(e)
      throw e
    }
    return article
  }






}

module.exports = new ArticleService()
