/*
 * @Author: huangxiaoxun 
 * @Date: 2018-11-24 14:57:29 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2018-12-02 19:11:53
 */

import KoaRouter from 'koa-router'
import { resolve } from 'path'
import glob from 'glob'
import R from 'ramda'

const symbolPrefix = Symbol('prefix')
const routerMap = new Map()
const normalizePath = path => path.startsWith('/') ? path : `/${path}`

let logTimes = 0


export class Route {
  constructor(app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new KoaRouter()
  }
  // init() {
  //   const {app , router, apiPath } = this
  //   glob.sync(resolve(apiPath,'./**/*.js')).forEach(require)
  //   for( let [conf, controller] of routerMap) {
  //     const controllers = Array.isArray(controller) ? controller : [controller]
  //     const prefixPath = conf.target[symbolPrefix]
  //     if(prefixPath) prefixPath = normalizePath(prefixPath)
  //     const routerPath = prefixPath + conf.path
  //     router[conf.methods](routerPath, ...controllers)
  //   }
  //   app.use(router.routes())
  //   app.use(router.allowedMethods())
  // }

  init = () => {
    const { app, router, apiPath } = this

    glob.sync(resolve(apiPath, './*.js')).forEach(require)

    R.forEach(
      ({ target, method, path, callback }) => {
        const prefix = resolvePath(target[pathPrefix])
        router[method](prefix + path, ...callback)
      }
    )(routeMap)

    app.use(router.routes())
    app.use(router.allowedMethods())
  }

}

const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path)
  routerMap.set({
    target:target,
    ...conf
  },target[key])
}

export const convert = middleware => (target, key, descriptor) => {
  target[key] = R.compose(
    R.concat(
      changeToArr(middleware)
    ),
    changeToArr
  )(target[key])
  return descriptor
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

export const Log = convert(async (ctx, next) => {
  logTimes++
  console.time(`${logTimes}: ${ctx.method} - ${ctx.url}`)
  await next()
  console.timeEnd(`${logTimes}: ${ctx.method} - ${ctx.url}`)
})


/**
 * @Required({
 *   body: ['name', 'password']
 * })
 */
export const Required = paramsObj => convert(async (ctx, next) => {
  let errs = []

  R.forEachObjIndexed(
    (val, key) => {
      errs = errs.concat(
        R.filter(
          name => !R.has(name, ctx.request[key])
        )(val)
      )
    }
  )(paramsObj)

  if (!R.isEmpty(errs)) {
    return (
      ctx.body = {
        success: false,
        errCode: 412,
        errMsg: `${R.join(', ', errs)} is required`
      }
    )
  }
  await next()
})

export const Auth = convert(async (ctx, next) => {
  if (!ctx.session.user) {
    return (
      ctx.body = {
        success: false,
        errCode: 401,
        errMsg: '登陆信息已失效, 请重新登陆'
      }
    )
  }
  await next()
})