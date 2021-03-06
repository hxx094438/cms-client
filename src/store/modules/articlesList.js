import model from '../../model/client-model'
import marked from 'marked'

export default {
  namespaced: true,
  state: {
    page: 1,
    pageTotal: 0,
    articles: [],
    noMoreData: false,
    defaultLimit: 8,
    article: {},
    tags:[],
    curTag: undefined,
    articlesLikeArr: [], // 子项为文章aid
  },


  getters: {
    reducedArticles: (state) => (articlesList) => {
      const articles = articlesList.map(article => {
        //遍历处理已经请求到的articles
        let newArticle = {};
        for (let i in article) {
          newArticle[i] = article[i];
        }
        newArticle.content = marked(article.content || '').replace(/<[^>]*>/g, '').slice(0, 200) + '......'
        return newArticle
      })
      return articles
    },

    allTags: (state) => {
      return ['全部',...state.tags]
    },
  },

  mutations: {
    SET_POSTS_BASE_INFO (state, data) {
      const {total , articles, page, limit} = data
      console.log('page', page)
      state.defaultLimit = limit || state.defaultLimit
      state.pageTotal = total
      state.articles = articles
      state.noMoreData = page * limit >= total
      // localStorage.setItem('articles',window.JSON.stringify(articles))
    },

    SET_TAGS(state, data) {
      state.tags = data
    },

    SET_CURTAG(state, tag) {
      state.curTags = tag
    },

    ADD_ARTICLES(state, articles) {
      state.articles = [...state.articles, ...articles]
    },

    ADD_PAGE(state) {
      state.page ++
      state.noMoreData = state.page * state.defaultLimit >= state.pageTotal
    },

    UPDATE_ARTICLE_LIKE(state, payload) {
      console.log('payload',payload)
      if(payload.action === 'add') {
        console.log('1111111111')
        state.articlesLikeArr.push(payload.aid)
      } else {
        console.log('state.articlesLikeArr',typeof state.articlesLikeArr.findIndex)
        let index = (state.articlesLikeArr).findIndex((item) => {
          item === payload.aid
        })
        state.articlesLikeArr.splice(index,1)
      }
    },




    //草稿

    SET_DRAFT: (state, draft) => {
      state.draft = draft
    },

  },
  actions: {
    /**
     * 
     * @param {*} param0 
     * @param {*} params 
     */
    GET_ALL_ARTICLES ({state, commit}, params) {
      if(typeof(params.isPublish) === 'undefined') params.isPublish = true
      return model.getAllArticles(params).then( res => {
        const {data, message, code} = res
        if( code === 0) {
          if(params.add) {
            commit('ADD_ARTICLES',data.articles)
          } else {
            commit('SET_POSTS_BASE_INFO', {...params,...data})
          }
        } else {

        }
      })
    },

    GET_ALL_TAGS({state, commit}, params){
      return model.getAllTags().then( res => {
        const {data, code} = res
        if( code === 0) {
          commit('SET_TAGS', data)
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

    UPDATE_ARTICLE_LIKE_ARR({state, commit}, payload) {
      commit('UPDATE_ARTICLE_LIKE',payload)
    }


  }
};
