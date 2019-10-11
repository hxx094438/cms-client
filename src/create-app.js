import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import App from './app.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'



import './assets/css/index.scss'

import axios from 'axios'
import dialog from '../src/modules/dialog'
import toast from '../src/components/toast/toast'
axios.defaults.withCredentials = true
Vue.prototype.$http = axios

Vue.use(Meta)
Vue.use(dialog)
Vue.use(toast)

Vue.filter('toDate', (date) => {
  if (date) {
      const d = new Date(date)
      const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' +
          d.getDate() + '日 ' + hours + ' : ' + minutes
  }
})

Vue.filter('to_date', (date) => {
  if (date) {
      const d = new Date(date)
      const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' +
          d.getDate() + ' ' + hours + ': ' + minutes
  }
})

Vue.filter('toTag', (arr) => {
  if (arr) {
      return arr.join('，')
  }
})

// 用于处理行尾省略号的过滤器
Vue.filter('textLineBreak', (text, maxLength, lineBreakMode) => {
  if (lineBreakMode === null || lineBreakMode === undefined) {
    lineBreakMode = LineBreakMode.EllipsisTruncatingTail
  }
  switch (lineBreakMode) {
    case LineBreakMode.WrappingTruncatingTail:
      return text.substr(0, maxLength);
    case LineBreakMode.WrappingTruncatingHead:
      return text.substr(-maxLength);
    case LineBreakMode.EllipsisTruncatingTail:
      return text.substr(0, maxLength) + (text.length > maxLength ? '...' : '');
    case LineBreakMode.EllipsisTruncatingMiddle:
      let resultText = text.substr(0, maxLength);
      if (text.length > maxLength) {
        return resultText.substr(0, parseInt(maxLength / 2)) + '...' + resultText.substr(parseInt(maxLength / 2));
      }
      return resultText;
    case LineBreakMode.EllipsisTruncatingHead:
      return (text.length > maxLength ? '...' : '') + text.substr(-maxLength);
  }
  return text;
})




Vue.use(VueRouter)
Vue.use(Vuex)


export default () => {
  const router = createRouter()
  const store = createStore()
  sync(store, router)

  console.log('create app')
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return { app, router, store }
}
