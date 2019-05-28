import model from '../../model/client-model'

export default {
  namespaced: true,
  state: {
    page: 1,
    pageTotal: 0,
    articles: [],
    article: {},
    noMoreData: false,
    comments: [],
    likeArr: [],

  },
  mutations: {
    SET_POSTS_BASE_INFO(state, data) {
      const {total, articles, page} = data
      state.articles = articles
      state.noMoreData = page >= total
    },
    UPDATE_POST_TITLE: (state, title) => {
      state.article.title = title
    },
    UPDATE_POST_CONTENT: (state, content) => {
      state.article.content = content
    },
    UPDATE_POST_TAGS: (state, tags) => {
      state.article.tags = tasg
    },
    SET_ARTICLE: (state, article) => {
      state.article = article
    },
    UPDATE_LIKE: (state, action)  => {
      console.log('action',action)

      if(action === 'add') {
        state.article.ArticleLike = state.article.ArticleLike++
      } else {
        state.article.ArticleLike = state.article.ArticleLike--
      }
    }
  },
  actions: {
    // GET_ALL_ARTICLES ({state, commit}, params) {
    //   return model.getAllArticles(params).then( res => {
    //     commit('SET_POSTS_BASE_INFO', {...params,...res})
    //   })
    // },
    GET_ARTICLE({commit, state}, aid) {
      // const startTime = beginLoading(commit, false);
      // if (router.currentRoute.hash) {
      //   commit('isLoading_toggle', false)
      // }
      // document.title = '加载中...'
      return model.getArticle(aid)
        .then(res => {
          const {data, msg, code} = res
          console.log('-----------111',res)
          if( code === 0) {
            commit('SET_ARTICLE', data)
          }

          // commit('set_headline', {content: state.article.title, animation: 'animated rotateIn'})
          // document.title = state.article.title
          // endLoading(commit, startTime, 'isLoading_toggle')
        }).catch((err) => {
          console.log(err)
        })
    },

    SAVE_ARTICLE({state, commit}, payload) {
      return model.saveArticle({article: state.article, ...payload})
        .then(() => {
          const {data, message} = res
          if( data.code === 0) {
            console.log('保存成功')
          }
          // commit('isSaving_toggle', true)
          // commit('isSend_toggle', true)
        }).catch((err) => {
          console.log(err)
        })
      // }
    },
    /**
     *
     * @param state
     * @param commit
     * @param payload  {aid , action : 'add', 'reduce'}
     * @constructor
     */
    UPDATE_ARTICLE_LIKE(store, payload) {
      const {state, commit} = store
      console.log('store',store)
      console.log('UPDATE_ARTICLE_LIKE:payload',payload)
      return model.updateArticleLike(payload)
        .then( res => {
          const {data, message, code} = res
          console.log('UPDATE_ARTICLE_LIKE',res)
          if( code === 0) {
            commit('UPDATE_LIKE',{action: payload.action})
            commit('articlesList/UPDATE_ARTICLE_LIKE', payload)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },


    // 评论
    SUMMIT_COMMENT({commit}, payload) {
      return model.summitComment(payload)
    },
    GET_ALL_COMMENTS({commit}, payload) {
      return Vue.http.get('/api/comments', {params: {payload}})
        .then(res => {
          const {data, msg} = res
          if( data.code === 0) {
            commit('UPDATE_LIKE',{action: payload.action})
            commit('articlesList/UPDATE_ARTICLE_LIKE', payload)
          }
          return data.json()
        })         //箭头函数有{...}别忘了return...
        .then(comments => {
          commit('set_comments', comments)
        }).catch((err) => {
          console.log(err)
        })
    },

    UPDATE_LIKE({state, commit}, payload) {            //返回一个comment对象
      return Vue.http.patch('/api/comments/' + payload.id, {option: payload.option})
        .then(response => {
          return response.json()
        })
        .then(comment => {
          state.comments.splice(payload.index, 1, comment)
        })
        .catch((err) => {
          console.log(err)
        })
    },
  }
};