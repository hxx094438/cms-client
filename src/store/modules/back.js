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
      // commit('moreArticle_toggle', true)
      // const startTime = beginLoading(commit, payload.add)
      // if (params.value) {
      //   commit('isLoading_toggle', false, { root: true })
      // }
      console.log('params',params)
      return model.getAllArticles(params).then( res => {
        // console.log('action', {...params,...res})
        // const {total , articles} = res
        commit('SET_POSTS_BASE_INFO', {...params,...res})
        // console.log('total',total,'article',articles)
        // if (params.page > total) {
        //   commit('moreArticle_toggle', false)
        //   commit('noMore_toggle', true)
        // } else {
        //   commit('set_pageTotal', total)
        //   commit('noMore_toggle', false)
        // }
        // if (params.add) {
        //   commit('add_articles', articles)
        //   endLoading(commit, startTime, 'loadMore_toggle')
        // } else {
        //   commit('SET_ALL_ARTICLES', articles)
        //   // endLoading(commit, startTime, 'isLoading_toggle')
        // }
      })
    },


    DEL_ARTICLE({dispatch}, payload) {
      return Vue.http.delete('/api/article/' + payload.aid)
        .then(() => {
          if (payload.route.name === 'posts') dispatch('getAllArticles', {page: payload.page, limit: 4})
          if (payload.route.name === 'drafts') dispatch('getAllDrafts', {page: payload.page, limit: 4})
          if (payload.route.name === 'search') router.push({name: 'posts'})
        }).catch((err) => {
          console.log(err)
        })
    },
  }
};
