'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ExtractTextPlugin = require('extract-text-webpack-plugin')


// const defaultPlugin = !isDev
//   ? [
//     new webpack.optimize.UglifyJsPlugin({
//       compress: { warnings: false }
//     }),
//     new webpack.optimize.ModuleConcatenationPlugin(),
//     new ExtractTextPlugin({
//       filename: 'common.[chunkhash].css'
//     })
//   ]
//   :
//   [
//     new FriendlyErrorsPlugin()
//   ]

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// console.log(isDev,'path',isDev ? '/dist/' : '/')
// const isDev = process.env.NODE_ENV === 'development'
// console.log('process.env.NODE_ENV',process.env.NODE_ENV,process.env.NODE_ENV === 'development', isDev) 
// const p = isDev ? '/' : '/dist/'

// const ppb = '/'
// console.log('ppb',ppb)
console.log('process.env.NODE_ENV',process.env.NODE_ENV,process.env)
module.exports = {

  // context: path.resolve(__dirname, '../'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js'
  },


  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false,
            extractCSS: !isDev,
            // cssModules: {
            //   localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
            //   camelCase: true
            // },
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
        // include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.scss$/,
        use: !isDev
          ? ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: { minimize: true }
              },
              'sass-loader'
            ],
            fallback: 'vue-style-loader'
          })
          : ['vue-style-loader', 'css-loader', 'sass-loader']
      },

    ]
  },


  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },

  performance: {
    maxEntrypointSize: 300000,
    hints: !isDev ? 'warning' : false
  },

  plugins: [
    // ...defaultPlugin,
    new VueLoaderPlugin(),
  ]
}
