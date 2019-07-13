const ejs = require('ejs');
const chalk = require('chalk');
const axios = require('axios');
const os = require('os')


function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
          var alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              return alias.address;
          }
      }
  }
}

module.exports = async (ctx, renderer, template) => {
  ctx.headers['Content-Type'] = 'text/html';
  // console.log('ctxctxctx',ctx.req.headers.cookie)
  const ip = ctx.req.headers['x-forwarded-for'] || ctx.req.headers['x-real-ip'] || getIPAdress()
  let city = '未知'

  // console.log('ctx.headers',ctx.headers,`ctx.req.headers['x-forwarded-for']`,ctx.req.headers['x-forwarded-for'])
  await axios.get(`https://restapi.amap.com/v3/ip?ip=${ip}&key=0486ef2ee9430d065fd6b4b3820e5f48`)
  .then(res => {
    const {data} = res
    city = (data.city.length && data.city) || city  //如果查询不到返回数组
  })
  

  /**
   * 用于在服务端渲染时传入到VueServerRender里面
   * VueServerRender会在渲染完成后在上面插入一些属性方便我们渲染HTML，如JS路径、CSS路径
   **/
  const context = { 
    url: ctx.url,
    cookie: ctx.req.headers['cookie'],
    userAgent: ctx.req.headers['user-agent'],
    city: city,
    ip: ip
   };
  try {
    const appString = await renderer.renderToString(context);
    // console.log('context',context)
    const meta = context.meta.inject();
    ctx.body = ejs.render(template, {
      appString,
      meta: meta,
      style: context.renderStyles(),
      scripts: context.renderScripts(),
      initialState: context.renderState()
    });
  } catch (err) {
    console.log(chalk.red('Render Error ', err));
    throw err;
  }
};
