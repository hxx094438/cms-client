import Vue from 'vue'
import Vuex from 'vuex'
import defaultState from './state.js';
import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'


import back from './modules/back'




Vue.use(Vuex)

export function createStore() {
  let store = new Vuex.Store({
    // state: {
    //   user: {},
    //   headline: {},
    //   /**/
    //   keys: [],
    //   items: [],
    //   loading: true,
    //   pageSize: 9,
    //   /**/

    //   isLoading:
    //     false,
    //   moreArticle:
    //     true,
    //   loadMore:
    //     false,
    //   isSaving:
    //     false,
    //   isSend:
    //     false,
    //   noMore:
    //     false,
    //   dialog:
    //     {
    //       show: false,
    //       hasTwoBtn:
    //         false,
    //       info:
    //         'hey',
    //       resolveFn:
    //         () => {
    //         },
    //       rejectFn:
    //         () => {
    //         }
    //     }
    //   ,
    //   tags: [],
    //   curTag:
    //     '',
    //   article:
    //     {}
    //   ,
    //   articles: [],
    //   draft:
    //     {}
    //   ,
    //   drafts: {}
    //   ,
    //   pageTotal: '',
    //   comments:
    //     [],
    //   likeArr:
    //     []
    //   // comment:{},
    //   // like:''
    // },
    state: defaultState,
    getters,
    actions,
    mutations,
    modules: {
      back,
    }
  })

  if (module.hot) {
    module.hot.accept([
      './state',
      './mutations',
      './actions',
      './getters',
      './modules/back',
    ], () => {
      const newState = require('./state').default;
      const newMutations = require('./mutations').default;
      const newActions = require('./actions').default;
      const newGetters = require('./getters').default;
      store.hotUpdate({
        state: newState,
        mutations: newMutations,
        getters: newGetters,
        actions: newActions,
        modules: {
          back,
        }
      });
    });
  }


  return store;

}

