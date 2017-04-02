var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var node_modules_dir = path.join(__dirname, 'node_modules');
var app_dir = path.join(__dirname, 'app');

var deps = [
  'react/dist/react.min.js',
  'moment/min/moment.min.js',
  'jquery/dist/jquery.min.js'
];

var config = {
  debug: false,
  entry: [
    './app/app.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new ExtractTextPlugin('styles.css', {
      allChunks: true
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    noParse: [],
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: app_dir,
        exclude: [node_modules_dir]
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1!autoprefixer?browsers=last 2 version!less'),
        include: app_dir
      },
      { test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/, loader: "url-loader?limit=100000" },
      { test: /\.(ttf|eot)$/, loader: "file-loader" }
    ]
  },
  resolve: {
    alias: {},
    modulesDirectories: [
      'app',
      'node_modules'
    ],
    extensions: ['', '.json', '.js']
  }
};

deps.forEach(function (dep) {
  var depPath = path.resolve(node_modules_dir, dep);
  config.resolve.alias[dep.split(path.sep)[0]] = depPath;
  config.module.noParse.push(depPath);
});

module.exports = config;
