'use strict';

// Gulp
var gulp = require('gulp');

// Utils
var del = require('del');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var $ = require("gulp-load-plugins")();

// Browserify
var browserify = require('browserify');
// var reactify = require('reactify');
var babelify = require('babelify');
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var assign = require('lodash.assign');

// Server
if(gutil.env.dev === true) {
  var watchify = require('watchify');
  var browserSync = require('browser-sync');
  var history = require('connect-history-api-fallback');
}

// Edit this values to best suit your app
var APP_DIR = './app';
var BUILD_DIR = './dist';

var paths = {
  html: APP_DIR + '/*.html',
  images: APP_DIR + '/img/*',
  icons: APP_DIR + '/icon/*.png',
  mainstyle: APP_DIR + '/style/styles.less',
  styles: [APP_DIR + '/style/*.less', '!'+APP_DIR+'/style.styles.less'],
  scripts: [APP_DIR + '/**/*.+(js|jsx)', '!' + APP_DIR + '/bundle.js', '!gulpfile.js'],
  vendors: [APP_DIR + '/lib/**/*'],
  mainjs: APP_DIR + '/app.jsx'
};

// Compile LESS & auto-inject into browsers
gulp.task('less', function() {
  return gulp.src(paths.mainstyle)
    .pipe($.sourcemaps.init())
    .pipe($.less().on('error', function(err) {
      console.log(err);
      // End the stream to prevent gulp from crashing
      this.emit('end');
    }))
    .pipe($.autoprefixer('last 2 version'))
    .pipe($.csso())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(APP_DIR + '/style'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('less:build', function() {
  return gulp.src(paths.mainstyle)
    .pipe($.less())
    .pipe($.autoprefixer('last 2 version'))
    .pipe($.csso())
    .pipe(gulp.dest(BUILD_DIR + '/style'))
    .pipe($.size());
});

// html
gulp.task('html:build', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(BUILD_DIR))
    .pipe($.size());
});

// img
gulp.task('image:build', function() {
  return gulp.src(paths.images)

  .pipe(gulp.dest(BUILD_DIR + '/img'))
    .pipe($.size());
});

gulp.task('vendor:build', function () {
  return gulp.src(paths.vendors)

  .pipe(gulp.dest(BUILD_DIR + '/lib'))
    .pipe($.size());
});

// Make browserify bundle
gulp.task('browserify', function() {
  var customOpts = {
    entries: [paths.mainjs],
    insertGlobals: true,
    debug: true,
    transform: [babelify]
  };
  var opts = assign({}, watchify.args, customOpts);
  var b = watchify(browserify(opts));
  b.on('update', bundle);
  b.on('log', gutil.log);
  function bundle() {
    return b.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      // optional, remove if you don't need to buffer file contents
      .pipe(buffer())
      // optional, remove if you dont want sourcemaps
      .pipe($.sourcemaps.init({
        loadMaps: true
      })) // loads map from browserify file
      // Add transformation tasks to the pipeline here.
      .pipe($.sourcemaps.write('./')) // writes .map file
      .pipe(gulp.dest(APP_DIR))
      .pipe(browserSync.reload({
        stream: true
      }));
  }

  return bundle();
});

gulp.task('browserify:build', function() {
  var customOpts = {
    entries: [paths.mainjs],
    debug: false,
    transform: [babelify]
  };
  var b = browserify(customOpts);
  return b.bundle()
    // log errors if they happen
    .on('error', function (err) {
      throw new gutil.PluginError({
          plugin: "browserify",
          message: err.message
        });
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe($.uglify().on('error',gutil.log))
    .pipe(gulp.dest(BUILD_DIR))
    .pipe($.size());
});

// Jest
gulp.task('test', function() {});

// Start the server
gulp.task('browser-sync', function() {
  browserSync.init({
    port: 3000,
    server: {
      baseDir: APP_DIR,
      middleware: [history()]
    }
  });
});

gulp.task('default', ['browserify', 'less'], function() {
  gulp.start('browser-sync');
  gulp.watch(paths.styles, ['less']);
  gulp.watch(paths.html).on('change', browserSync.reload);
});

gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del([BUILD_DIR], cb);
});

gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del([BUILD_DIR], cb);
});

gulp.task('build:only', ['browserify:build', 'less:build', 'image:build', 'html:build', 'vendor:build']);

gulp.task('build', ['clean'], function(cb) {
  runSequence('clean', 'build:only', cb);
});
