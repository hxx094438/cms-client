/*
 * @Author: huangxiaoxun 
 * @Date: 2018-11-24 14:57:29 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2018-12-23 23:02:25
 */

import KoaRouter from 'koa-router'
import { resolve } from 'path'
import glob from 'glob'
import R from 'ramda'

const symbolPrefix = Symbol('prefix')
const routeMap = []
let logTimes = 0

// const normalizePath = path => path.startsWith('/') ? path : `/${path}`
const resolvePath = R.unless(
  R.startsWith('/'),
  R.curryN(2, R.concat)('/')
)

const changeToArr = R.unless(
  R.is(Array),
  R.of
)

export class Route {
  
  constructor(app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new KoaRouter()
  }

  init = ()=> {
    const { app, router, apiPath } = this
    // console.log('routeMap',routeMap)

    glob.sync(resolve(apiPath, './*.js')).forEach(require)
    // console.log(apiPath,'哈哈哈')
    // console.log('routeMap',routeMap)
    R.forEach(
      ({ target, method, path, callback }) => {
        const prefix = resolvePath(target[symbolPrefix])
        console.log('挂载router',callback)
        router[method](prefix + path, ...callback)
      }
    )(routeMap)
  
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}

export const setRouter = method => path => (target, key, descriptor) => {
  routeMap.push({
    target,
    method,
    path: resolvePath(path),
    callback: changeToArr(target[key])
  })
  return descriptor
}

/**
 * 
 * @param {fn} middleware 
 * 将函数转化为数组中间件
 */

export const convert = middleware => (target, key, descriptor) => {
  target[key] = R.compose(
    R.concat(
      changeToArr(middleware)
    ),
    changeToArr
  )(target[key])
  return descriptor
}

export const Controller = path => target => (target.prototype[symbolPrefix] = path)

export const Get = setRouter('get')

export const Post = setRouter('post')

export const Patch = setRouter('patch')

export const Put = setRouter('put')

export const Delete = setRouter('delete')

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
  // console.log('ctx',ctx.request)
  R.forEachObjIndexed(
    (val, key) => {
      errs = errs.concat(
        R.filter(
          name => !R.has(name, ctx.request[key])
        )(val)
      )
    }
  )(paramsObj)
  // console.log('paramsObj',paramsObj,ctx.request.body,'err',errs)
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
  console.log('auth自动登录',ctx.session)
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