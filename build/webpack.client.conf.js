'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueClientPlugin = require('vue-server-renderer/client-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const devServer = {
  port: process.env.PORT || 8084,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  headers: { 'Access-Control-Allow-Origin': '*' },
  historyApiFallback: {
    index: '../index.html'
  },
  hot: true,
  disableHostCheck: true // 允许任何host域名访问
};


let webpackConfig = merge(baseWebpackConfig, {
    target: 'web',

    entry: {
      app: './src/entry-client.js',
      // vendor: ['vue', 'vue-router', 'vuex', 'vuex-router-sync', 'axios']
    },
    devServer,

    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader','css-loader']
        },
      ]
    },

    performance: {
      hints:false    // 去掉 超过250kb文件的warn提示
    },      
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.VUE_ENV': '"client"'
      }),
      new ExtractTextPlugin({
        filename: 'common.[chunkhash].css'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      }),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'vendor',
      //   filename: 'client-vendor-bundle.js',
      //   minChunks: function (module) {
      //     // a module is extracted into the vendor chunk if...
      //     return (
      //       // it's inside node_modules
      //       /node_modules/.test(module.context) &&
      //       // and not a CSS file (due to extract-text-webpack-plugin limitation)
      //       !/\.css$/.test(module.request)
      //     )
      //   }
      // }),
      //
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'manifest',
      //   chunks: ['vendor']
      // }),
      // new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
      // new HtmlWebpackPlugin({
      //   filename: 'index.html',
      //   template: 'index.html',
      //   inject: true
      // }),
      // new webpack.NoEmitOnErrorsPlugin(),
      new VueClientPlugin(),
    ]
  })


if(!isDev) {
  webpackConfig.plugins.push(
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'vue-hn',
      filename: 'service-worker.js',
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'networkFirst'
        },
        {
          urlPattern: /\/(top|new|show|ask|jobs)/,
          handler: 'networkFirst'
        },
        {
          urlPattern: '/item/:id',
          handler: 'networkFirst'
        },
        {
          urlPattern: '/user/:id',
          handler: 'networkFirst'
        }
      ]
    })
  )
}

module.exports = webpackConfig
