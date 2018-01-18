const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  entry: ['babel-polyfill','./client/index.js'],
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js'
  }
,
devServer: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },

  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
 {test: /\.css$/,  loader:'style-loader!css-loader'},
 {
   test: /\.(jpg|jpeg|gif|png|ico)$/,
   exclude: /node_modules/,
   loader:'file-loader?name=img/[path][name].[ext]&context=./app/images'
}
    ]
  },
	
  plugins: [HtmlWebpackPluginConfig]
}
