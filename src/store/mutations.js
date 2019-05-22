export default {


  // 对话框
  SET_DIALOG: (state, payload) => {
    console.log('state', state, state.dialog)
    state.dialog = payload
    state.dialog.resolveFn = () => {
    }
    state.dialog.rejectFn = () => {
    }
  },
  // 设置页面标题
  SET_HEADLING: (state, headline) => {
    state.headline = headline
  },
  // login
  set_user: (state, user) => {
    localStorage.setItem('token', user.token)
    localStorage.setItem('userName', user.name)
    state.user = user
  },
  unset_user: (state) => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    state.user = {}
  },

  isSaving_toggle: (state, isSaving) => {
    state.isSaving = isSaving
  },
  isSend_toggle: (state, isSend) => {
    state.isSend = isSend
  },
  isLoading_toggle: (state, isLoading) => {
    state.isLoading = isLoading
  },
  loadMore_toggle: (state, loadMore) => {
    state.loadMore = loadMore
  },
  moreArticle_toggle: (state, flag) => {
    state.moreArticle = flag
  },
  noMore_toggle: (state, flag) => {
    state.noMore = flag
  },
  // pageTotal
  set_pageTotal: (state, total) => {
    state.pageTotal = total
  },
  // tags
  set_tags: (state, tags) => {
    state.tags = tags
  },
  set_curtag: (state, tag) => {
    state.curTag = tag
  },
  // article
  /*  update_post_title: (state, title) => {
        state.article.title = title
    },
    update_post_content: (state, content) => {
        state.article.content = content
    },*/

  set_all_articles: (state, articles) => {
    state.articles = articles
    // localStorage.setItem('articles',window.JSON.stringify(articles))
  },
  get_all_articles: (state, articles) => {
    state.articles = articles
  },
  add_articles: (state, articles) => {    //
    state.articles = state.articles.concat(articles)
    // localStorage.setItem('articles', window.JSON.stringify(state.articles))
  },
  // comment
  set_comments: (state, comments) => {
    state.comments = comments
  },
  update_comment: (state, comment) => {
    state.comment = comment
  },
  set_likeArr: (state, likeArr) => {
    state.likeArr = likeArr
  },

}
