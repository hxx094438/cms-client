/*
 * @Author: huangxiaoxun 
 * @Date: 2018-11-24 14:57:29 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2018-11-25 17:03:22
 */

const KoaRouter = require('koa-router')
const {
    resolve
} = require('path')
const glob = require('glob')

const symbolPrefix = Symbol('prefix')
const routerMap = new Map()
const normalizePath = path => path.startsWith('/') ? path : `/${path}`

export class Route {
  constructor(app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new KoaRouter()
  }
  init() {
    const {app , router, routesPath } = this
    glob.sync(resolve(this.apiPath,'./**/*.js')).forEach(require)
  
    for( let [conf, controller] of routerMap) {
      const controllers = Array.isArray(controller) ? controller : [controller]
      const prefixPath = conf.target[symbolPrefix]
      if(prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.methods](routerPath, ...controllers)
    }
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())

  }

}

const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path)
  routerMap.set({
    target:target,
    ...conf
  },target[key])

  
}

export const controller = path => target => (target.prototype[symbolPrefix] = path)

export const get = path => router({
  methods:'get',
  path: path
})

export const post = path => router({
  methods:'put',
  path: path
})

export const del = path => router({
  methods:'del',
  path: path
})

export const put = path => router({
  methods:'put',
  path: path
})

export const use = path => router({
  methods:'use',
  path: path
})

export const all = path => router({
  methods:'all',
  path: path
})


