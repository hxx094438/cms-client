import axios from 'axios'
import {createError} from './util'
// import { createStore } from '../store'

// const baseUrl = typeof window === 'object' ? '/api' : 'http://127.0.0.1:3002/api'
const baseUrl = 'http://127.0.0.1:3002/api'
// const store = createStore()
// console.log('baseUrl',baseUrl)
axios.defaults.withCredentials = true
const request = axios.create({
  baseURL: baseUrl
})




console.log('window', typeof window === 'object', request.baseURL)

const handleRequest = (request) => {
  //todo:只能在serverRender时去设置，因为需要获取到来自远程的请求头部，现在的问题时serverRender时如何获取到store
  //或者在server-entry中获取到请求头
  // console.log('process',process)
  // const isServer = process && process.server;
  // console.log('isServerisServer',isServer)
  // const userAgent = isServer ? req.headers['user-agent'] : navigator.userAgent;
  // const isMobile = /(iPhone|iPod|Opera Mini|Android.*Mobile|NetFront|PSP|BlackBerry|Windows Phone)/gi.test(userAgent);
  // store.commit('SET_MOBILE_LAYOUT', isMobile);
  // store.commit('SET_USER_AGENT', userAgent);

  // console.log('baseUrl', baseUrl)
  return new Promise((resolve, reject) => {
    request.then(resp => {
      const {data, status} = resp
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
  // getAllTodos () {
  //   return handleRequest(request.get('/api/todos'))
  // },
  // login (username, password) {
  //   return handleRequest(request.post('/user/login', { username, password }))
  // },
  login(payload) {
    return handleRequest(request.post('/admin/login', payload))
  },

  getAllArticles(payload) {
    console.log('------------payload', payload)
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
