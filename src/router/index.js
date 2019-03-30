import Vue from 'vue'
import Store from '../store'
import Router from 'vue-router'

const index = () => import('@/components/front/index')
const Home = () => import('@/components/front/Home')
const article = () => import('@/components/front/article')
const SearchResult = () => import('@/components/front/SearchResult')
const Articles = () => import('@/components/front/Articles')
const login = () => import('@/components/back/login')

const admin = () => import('@/components/back/admin')
const posts = () => import('@/components/back/posts')
const editor = () => import('@/components/back/editor')
const drafts = () => import('@/components/back/drafts')
const search = () => import('@/components/back/search')
const account = () => import('@/components/back/account')


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
            redirect: 'home',
            component: index,
            children: [
                {path: 'home', name: 'home', component: Home, meta: {title: '博客首页'}},
                {path: 'articles', name: 'articles', component: Articles, meta: {title: '学习笔记分享'}},
                {path: 'articles/:id/:index/:page', name: 'article', component: article},
                {path: 'search/:text', name: 'SearchResult', component: SearchResult, meta: {title: '搜索结果'}}
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: login,
            meta: {title: '登录页面'}
        },
        {
            path: '/admin',
            redirect: 'admin/posts',
            component: admin,
            children: [
                {path: 'posts', name: 'posts', component: posts, meta: {requireAuth: true, title: '博客文章'}},
                {path: 'editor', name: 'editor', component: editor, meta: {requireAuth: true, title: '博客编辑'}},
                {path: 'drafts', name: 'drafts', component: drafts, meta: {requireAuth: true, title: '博客草稿'}},
                {path: 'search', name: 'search', component: search, meta: {requireAuth: true, title: '搜索结果'}},
                {path: 'account', name: 'account', component: account, meta: {requireAuth: true, title: '修改账户'}}
            ]
        }
    ],
})

router.beforeEach((to, from, next) => {
    // document.title = to.meta.title
 /*   let token = localStorage.getItem('token')
    if (Store.state.user.token && to.name === 'login') {
        next({name: 'posts'})
    } else if ((!token || token === null) && to.meta.requireAuth) {
        next({name: 'login'})
    } else {
        next()
    }*/
 next()
})

export function createRouter () {
  return router
}
