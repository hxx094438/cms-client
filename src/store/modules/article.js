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
      console.log('-----------111')
      return model.getArticle(aid)
        .then(res => {
          commit('SET_ARTICLE', res)
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
          // commit('isSaving_toggle', true)
          // commit('isSend_toggle', true)
        }).catch((err) => {
          console.log(err)
        })
      // }
    },

    UPDATE_ARTICLE_LIKE({state, commit}, aid) {
      return Vue.http.patch('/api/ArticleLike/' + aid, {aid: aid})
        .then(response => {
          console.log(response.data)
          commit('set_article', response.data)
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
        .then(response => {
          return response.json()
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