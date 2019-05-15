import model from '../../model/client-model'

export default {
  namespaced: true,
  state: {
    page: 1,
    pageTotal: 0,
    articles: undefined,
    noMoreData: false,
    defaultLimit: 4,
  },
  mutations: {
    SET_POSTS_BASE_INFO (state, data) {
      const {total , articles, page} = data
      console.log('page', page)
      state.articles = articles
      state.noMoreData = page >= total
      // localStorage.setItem('articles',window.JSON.stringify(articles))
    },







  },
  actions: {
    GET_ALL_ARTICLES ({state, commit}, params) {

      console.log('params',params)
      return model.getAllArticles(params).then( res => {
        commit('SET_POSTS_BASE_INFO', {...params,...res})
      })
    },


    DEL_ARTICLE({dispatch}, payload) {
      return model.delArticle(payload.aid)
        .then(() => {
          if (payload.route.name === 'posts') dispatch('GET_ALL_ARTICLES', {page: payload.page, limit: 4})
          if (payload.route.name === 'drafts') dispatch('getAllDrafts', {page: payload.page, limit: 4})
          if (payload.route.name === 'search') router.push({name: 'posts'})
        }).catch((err) => {
          console.log(err)
        })
    },
  }
};
