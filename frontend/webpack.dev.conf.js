var path = require('path')
var autoprefixer = require('autoprefixer')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: 'tictail-todo.js',
    path: path.join(__dirname, './dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css'],
    root: [path.join(__dirname, './src')],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'utils': path.resolve(__dirname, './src/utils')
    }
  },
  module: {
    preLoaders: [
      { test: /\.jsx?$/, exclude: 'node_modules', loader: 'eslint' }
    ],
    loaders: [
      { test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style!css?modules=true&localIdentName=[name]__[local]___[hash:base64:5]!postcss' }
    ]
  },
  postcss: function () {
    return [autoprefixer]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify('development'),
      'API_ENDPOINT': JSON.stringify('http://localhost:5000')
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
}
