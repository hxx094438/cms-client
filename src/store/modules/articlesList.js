

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
    articlesLikeArr: [], // 子项为文章aid
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

    UPDATE_ARTICLE_LIKE(state, payload) {
      if(state.payload.action === 'add') {
        state.articlesLikeArr.push(payload.aid)
      } else {
        let index = state.articlesLikeArr.findIndex(payload.aid)
        state.articlesLikeArr.splice(index,1)
      }
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
        const {data, message, code} = res
        console.log('all','data:',data.articles,'code:',code)
        if( code === 0) {
          console.log('------------------11111111111')
          if(params.add) {
            commit('ADD_ARTICLES',data.articles)
          } else {
            console.log('------------------222222222',{...params,...data.articles})

            commit('SET_POSTS_BASE_INFO', {...params,...data})
          }
        }

      })
    },


    DEL_ARTICLE({dispatch}, payload) {
      return model.delArticle(payload.aid)
        .then(() => {
          const {data, message} = res
          if( data.code === 0) {
            if (payload.route.name === 'posts') dispatch('GET_ALL_ARTICLES', {page: payload.page, limit: 4})
            if (payload.route.name === 'drafts') dispatch('getAllDrafts', {page: payload.page, limit: 4})
            if (payload.route.name === 'search') router.push({name: 'posts'})
          }

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
          const {data, message} = res
          if( data.code === 0) {
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


  }
};
