/*eslint no-shadow: 0 */
"use strict";
var gulp = require("gulp");
var buildConf = require("./build-config");
var production = process.env.NODE_ENV === "production";

module.exports = function (cb, watch) {
  var browserify = require("browserify");
  var watchify = watch? require("watchify") : function (b) { return b; };
  var vinylSource = require("vinyl-source-stream");
  var uglify = require('gulp-uglify');
  var streamify = require('gulp-streamify');
  var gulpIf = require("gulp-if");
  var mold = require("mold-source-map");
  var gutil = require("gulp-util");
  var path = require("path");
  var babelify = require("babelify");
  // these two things we load if we can, because they may not be installed in
  // production
  var reload;
  try {
    reload = require('browser-sync').reload;
  } catch (e) {
    reload = gutil.noop;
  }
  var notifier;
  try {
    notifier = require('node-notifier');
  } catch (e) {
    notifier = null;
  }


  var b = watchify(browserify({debug: !production, cache: {}, packageCache: {}})).
    require("react").
    exclude("react").
    exclude("react/addons").
    add("./src/main.js").
    transform(babelify.configure({
      modules: "common",
      optional: ["es7.asyncFunctions", "es7.objectRestSpread"]
    })).
    //transform({global: true}, "browserify-shim").
    //require("react/addons").
    external("jquery");

  function bundle () {
    return b.bundle().
      on("error", function (err) {
        // thanks to http://stackoverflow.com/a/24817446/212676
        console.error(err);
        if (notifier) {
          notifier.notify({
            'title': 'Kaboom! Gulp error:',
            'message': err,
            wait: false,
            //icon: path.join(__dirname, "error.png")
          });
        }
      }).
      // patch up crappy windowsy paths here using
      // https://github.com/thlorenz/mold-source-map
      pipe(gulpIf(!production, mold.transformSourcesRelativeTo(process.cwd()))).
      pipe(gulpIf(!production, mold.transformSources(function (source) {
        var after = source.replace(/\\/g, '/');
        return after;
      }))).
      pipe(gulpIf(!production, mold.transform(function (molder) {
        molder.sourceRoot("/");
        return molder.toComment();
      }))).
      pipe(vinylSource("main.js")).
      pipe(gulpIf(production, streamify(uglify()))).
      pipe(gulp.dest(buildConf.out + buildConf.outJS)).
      pipe(reload({stream: true}));
  }

  b.on("update", function (ids) {
    gutil.log("Script dependencies updated:");
    ids = ids.map(function (id) {
      return gutil.colors.magenta(path.relative(process.cwd(), id));
    });
    ids.forEach(function (id) { gutil.log(id); });
    bundle();
  });

  b.on("log", function (msg) {
    gutil.log(msg);
  });

  return bundle();
};
