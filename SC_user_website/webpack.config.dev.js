var path              = require('path');
var webpack           = require('webpack');
var node_modules_dir  = path.join(__dirname, 'node_modules');
var app_dir           = path.join(__dirname, 'app');

var deps = [
  'react/dist/react.min.js',
  'moment/min/moment.min.js',
  'jquery/dist/jquery.min.js'
];

var config = {
  devtool: 'cheap-module-inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './app/app.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ],
  module: {
    noParse: [],
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],//use babelify for jsx + ES6 support
        include: app_dir,
        exclude: [node_modules_dir]
      },
      { test: /\.less$/, loader: "style!css!less" },
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
