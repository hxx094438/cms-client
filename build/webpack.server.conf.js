'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const VueServerPlugin = require('vue-server-renderer/server-plugin')
const nodeExternals = require('webpack-node-externals')

const plugins = [
  new VueServerPlugin(),
  new ExtractTextPlugin('styles.[contentHash:8].css'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VUE_ENV': '"server"'
  }),
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
  plugins,
  externals: Object.keys(require('../package.json').dependencies),

  module: {
    rules: [
      {
        test: /\.css$/,
        // 服务端使用style-loader会导致window is not defined，
        use: ['vue-style-loader','css-loader']
      },
    ]
  },
})

module.exports = config;

