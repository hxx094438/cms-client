import { join } from 'path'
import mongoose from 'mongoose'
import glob from 'glob'
import config from '../config/index'

mongoose.Promise = global.Promise

glob.sync(join(__dirname, '../database/schema', '**/*.js')).forEach(require)

export const database = app => {
  
  const { mongoConfig } = config

  if (config.env === 'development') {
    mongoose.set('debug', true)
  }

 /*  mongoose.connect(mongoConfig.url, {
    useMongoClient: true
  }) */

  mongoose.connection.on('disconnected', () => {
    mongoose.connect(mongoConfig.url, {
      useMongoClient: true
    })
  })

  mongoose.connection.on('error', err => {
    console.error(err)
  })

  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB -> ', mongoConfig.url)
  })
}
