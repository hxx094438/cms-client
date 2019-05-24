

import model from '../../model/client-model'

export default {
  namespaced: true,
  state: {
    page: 1,
    pageTotal: 0,
    articles: [],
    noMoreData: false,
    defaultLimit: 4,
    article: {},
  },
  mutations: {
    SET_POSTS_BASE_INFO (state, data) {
      const {total , articles, page} = data
      console.log('page', page)
      state.articles = articles
      state.noMoreData = page >= total
      // localStorage.setItem('articles',window.JSON.stringify(articles))
    },

    ADD_ARTICLES(state, articles) {
      state.articles = [...state.articles, ...articles]
    },




    //草稿

    SET_DRAFT: (state, draft) => {
      state.draft = draft
    },

  },
  actions: {
    GET_ALL_ARTICLES ({state, commit}, params) {
      console.log('params',params)
      return model.getAllArticles(params).then( res => {
        if(params.add) {
          commit('ADD_ARTICLES',res)
        } else {
          commit('SET_POSTS_BASE_INFO', {...params,...res})
        }
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


  }
};
