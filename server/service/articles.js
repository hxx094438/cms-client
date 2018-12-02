import mongoose from 'mongoose'

const article = mongoose.model('Article')

export const getAllArticles = async (type, year) => {
  let query = {}
  
  //do sth

  const articles = await article.find(query)

  return articles
}

