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
    _articles.total = await Article.count({
      isPublish: true
    }).exec((err, count) => {
      if(err) {
        console(err) 
      } else {
        return Math.ceil(count / limit)
      }
    })
    if (value && value !== '全部') {
      Article.find({
          tags: value,
          isPublish: true
        }).sort({
          date: -1
        }).limit(limit).skip(skip).exec()
        .then((articles) => {
          _articles.articles = articles
        }).catch(err => console.log(err))
    } else {
      Article.find({
          isPublish: true
        }).sort({
          date: -1
        }).limit(limit).skip(skip).exec()
        .then((articles) => {
          _articles.articles = articles
        }).catch(err => console.log(err))
    }
    return _articles
  }
}

module.exports = new ArticleService()
