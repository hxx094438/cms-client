import axios from 'axios'
import {createError} from './util'
const isDev = process.env.NODE_ENV !== 'production'

// const baseUrl = typeof window === 'object' ? '/api' : 'http://127.0.0.1:3002/api'
const baseUrl = isDev ? 'http://127.0.0.1:3002/api' : `http://shawsen.site/api`

axios.defaults.withCredentials = true



const request = axios.create({
  baseURL: baseUrl
})

request.interceptors.request.use(
  config => {
    if(config.method === 'get') {
      config.params && (config.params = JSON.stringify(config.params))
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)



console.log('window', typeof window === 'object', request.baseURL)

const handleRequest = (request) => {
  return new Promise((resolve, reject) => {
    request.then(resp => {
      const {data, status, code} = resp
      console.log('data',data)
      resolve(data)
    }).catch(err => {
      // return reject(createError(data.code, data.message))
      console.log('ERROR:',err)
      // if (resp.status === 401) {
      //   reject(createError(401, 'need auth'))
      // }
    })
  })
}

export default {
 
  login(payload) {
    return handleRequest(request.post('/admin/login', payload))
  },

  getAllArticles(payload) {
    return handleRequest(request.get('/articles/all', {
      params: payload
    }))
  },

  getAllTags(payload) {
    return handleRequest(request.get('/articles/tags')) 
  },

  getArticle(aid) {
    return handleRequest(request.get(`/articles/${aid}`))
  },

  delArticle(aid) {
    return handleRequest(request.delete(`/articles/${aid}`))
  },

  updateArticleLike({ aid,action }) {
    return handleRequest(request.patch(`/articles/like`, {
      aid: aid,
      action: action
    }))
  },

  saveArticlePatch(payload) {

  },

  saveArticle(payload) {
    console.log('payload', payload)
    if (payload.aid) {
      return handleRequest(request.patch(`/articles/save/${payload.aid}`, {
        article: payload.article,
        isPublish: payload.isPublish
      }))
    } else {
      return handleRequest(request.post(`/articles/save`, {
        article: payload.article,
        isPublish: payload.isPublish
      }))
    }
  },

  // 草稿
  saveDrafts(payload) {
    if (payload.aid) {
      //局部更新
      return handleRequest(request.patch(`/api/draft/${payload.aid}`, payload.draft))
    } else {
      return handleRequest(request.post(`/api/draft/`, payload.draft))
    }
  },



  // 评论

  summitComment(payload) {
    return handleRequest(request.post('/comment/save',payload))
  },

  getAllComments(payload) {
    const {articleId, sort} = payload
    console.log('payload',articleId, sort)
    return handleRequest(request.get('/comment/all', {
      params: {
        articleId: articleId,
        sort : sort
      }
    }))
  },


  updateCommentLike(payload) {
    return handleRequest(request.patch('/comment/like', payload))
  }




}
