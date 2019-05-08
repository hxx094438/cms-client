
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
      state.articles = articles
      state.noMoreData = page >= total
      // localStorage.setItem('articles',window.JSON.stringify(articles))
    },

    ADD_PAGE(state) {
      state.page ++
    },

    REDUCE_PAGE(state) {
      state.page --
    }





  },
  actions: {
    GET_ALL_ARTICLES ({state, commit}, params) {
      commit('moreArticle_toggle', true)
      // const startTime = beginLoading(commit, payload.add)
      // if (params.value) {
      //   commit('isLoading_toggle', false, { root: true })
      // }
      return model.getAllArticles({...params,limit: state.defaultLimit}).then( res => {
        console.log('action', typeof res)
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
  }
};
