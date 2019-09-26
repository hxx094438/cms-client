import Vue from 'vue'
import Vuex from 'vuex'
import defaultState from './state.js';
import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'


import back from './modules/back'
import articlesList from './modules/articlesList'
import article from './modules/article'
Vue.use(Vuex)

export function createStore() {
  let store = new Vuex.Store({
    state: defaultState,
    getters,
    actions,
    mutations,
    modules: {
      back,
      articlesList,
      article
    }
  })


  if (module.hot) {
    module.hot.accept([
      './state',
      './mutations',
      './actions',
      './getters',
      './modules/back',
      './modules/articlesList',
      './modules/article',
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
          articlesList,
          article
        }
      });
    });
  }


  return store;

}

