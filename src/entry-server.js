import createApp from './create-app'
import chalk from 'chalk';

const isDev = process.env.NODE_ENV !== 'production'
// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  /**
   * context即是在server-render.js中renderer.renderToString()方法传入的context
   * 可以给这个context赋其他的属性值
   *
   */
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now()
    const { app, router, store } = createApp()
    let { url } = context
    const { fullPath } = router.resolve(url).route
    console.log('fullPath',fullPath,'url',url)

    if(fullPath.indexOf('/static') > -1) {
      console.log('静态资源路径')
      return
    }

    if(url === '/') url = '/home'

    if (fullPath !== url) {
      return reject({ url: fullPath })
    }
    // set router's location
    router.push(url)
    console.log('entry server------------')
    // wait until router has resolved possible async hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes
      if (!matchedComponents.length) {
        return reject({ 
          code: 404,
          msg: `异常路由：${url}`
         })
      }
   
      // Call fetchData hooks on components matched by the route.
      // A preFetch hook dispatches a store action and returns a Promise,
      // which is resolved when the action is complete and store state has been
      // updated.
      Promise.all(matchedComponents.map(({ asyncData }) => {
        return asyncData && asyncData({
        store,
        route: router.currentRoute,
        //如果在asyncData中去赋值，那每一个asyncData中都需要写赋值操作，太麻烦
        // userAgent: context.userAgent,   
        // cookies: context.cookies, 
        isServer: true,
        isClient: false
      })
    })).then(() => {
        isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
        // After all preFetch hooks are resolved, our store is now
        // filled with the state needed to render the app.
        // Expose the state on the render context, and let the request handler
        // inline the state in the HTML response. This allows the client-side
        // store to pick-up the server-side state without having to duplicate
        // the initial data fetching on the client.
        context.state = store.state
        store.state.userAgent = context.userAgent
        store.state.ip = context.ip
        store.state.city = context.city
        store.state.mobileLayout = /(iPhone|iPod|Opera Mini|Android.*Mobile|NetFront|PSP|BlackBerry|Windows Phone)/gi.test(context.userAgent);
        context.meta = app.$meta();
        resolve(app)
      })
      .catch(error => {
        console.log(chalk.red('AsyncData Error Caused URL '), context.url);
        console.log(chalk.red('AsyncData Error Caused '), error);
        context.state = store.state;
        resolve(app);
      })
    })
  })
}
