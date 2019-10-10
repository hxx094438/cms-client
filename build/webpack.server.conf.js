'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const VueServerPlugin = require('vue-server-renderer/server-plugin')
const nodeExternals = require('webpack-node-externals')

const plugins = [
  // new ExtractTextPlugin('styles.[contentHash:8].css'),
  new ExtractTextPlugin({
    filename: 'common.[chunkhash].css'
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VUE_ENV': '"server"'
  }),
  new VueServerPlugin()
]

let config

config = merge(baseWebpackConfig, {
  target: 'node',
  entry: path.join(__dirname, '../src/entry-server.js'),
  devtool: 'source-map',
  output:{
    libraryTarget: 'commonjs2',
    filename: 'server-bundle.js',
  },
  // externals: Object.keys(require('../package.json').dependencies),
  externals: Object.keys(require('../package.json').dependencies),

  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   // 服务端使用style-loader会导致window is not defined，
      //   use: ['vue-style-loader','css-loader']
      // },
      // {
      //   test: /\.scss$/,
      //   use:
      //     ExtractTextPlugin.extract({
      //       use: [
      //         {
      //           loader: 'css-loader',
      //           options: { minimize: true }
      //         },
      //         'sass-loader'
      //       ],
      //       fallback: 'vue-style-loader'
      //     })
      //
      // },
      {
        test: /\.css/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      }
    ]
  },

  plugins,

})

module.exports = config;

