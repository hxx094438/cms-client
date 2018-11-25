import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import onerror from 'koa-onerror'

export const addBodyParser = app => {
  app.use(bodyParser())
}

export const addLogger = app => {
  app.use(logger())
}

export const errorHandle = app => {
  onerror(app, {
    json (err) {
      Object.keys(err).reduce((body, key) => {
        body[key] = err[key]
        return body
      }, this.body = {})
      this.body.error = err.name
    }
  })
}

