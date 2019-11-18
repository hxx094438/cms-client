import Vue from 'vue'
import Store from '../store'
import Router from 'vue-router'

const index = () => import('@/components/front/index')
const Home = () => import('@/components/front/Home')
const article = () => import('@/components/front/article')
const SearchResult = () => import('@/components/front/SearchResult')
const Articles = () => import('@/components/front/Articles')



Vue.use(Router)

const router = new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return {
                savedPosition
            }
        } else if(to.hash){
            selector: to.hash
        } else {
            return {x: 0, y: 0}
        }
    },
    routes: [
        {
            path: '/',
            redirect: '/home',
            component: index,
            children: [
                {path: 'home', name: 'home', component: Home, meta: {title: '博客首页'}},
                {path: 'articles', name: 'articles', component: Articles, meta: {title: '学习笔记分享'}},
                {path: 'articles/:id/:index/:page', name: 'article', component: article},
                {path: 'search/:text', name: 'SearchResult', component: SearchResult, meta: {title: '搜索结果'}}
            ]
        },
    ],
})

router.beforeEach((to, from, next) => {
 
 next()
})

export function createRouter () {
  return router
}
