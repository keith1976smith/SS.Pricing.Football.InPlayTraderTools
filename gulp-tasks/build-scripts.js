/*jshint node:true, unused: vars */
"use strict";
var gulp = require("gulp");
var buildConf = require("./build-config");

var production = process.env.NODE_ENV === "production";

var jsLibs = buildConf.externalizeLibs;

gulp.task("build-scripts", ["build-main-script", "build-prelaunch-script", "build-libs-script"], function () {
    var browserSync = require('browser-sync');
    var reload      = browserSync.reload;
    reload();
});


gulp.task("build-prelaunch-script", function (cb) {
    var browserify = require("browserify");
    var vinylSource = require("vinyl-source-stream");
    var uglify = require('gulp-uglify');
    var streamify = require('gulp-streamify');
    var gulpIf = require("gulp-if");
    var mold = require("mold-source-map");

    var bundle = browserify({debug: !production}).
        add("./src/prelaunch.js").
        transform({es6: true}, "reactify");

    bundle = bundle.bundle().
        on("error", function (err) {
            // thanks to http://stackoverflow.com/a/24817446/212676
            console.error(err);
            this.end();
            cb();
        }).
        // patch up crappy windowsy paths here usinghttps://github.com/thlorenz/mold-source-map
        pipe(gulpIf(!production, mold.transformSourcesRelativeTo(process.cwd()))).
        pipe(gulpIf(!production, mold.transformSources(function (source) {
            var after = source.replace(/\\/g, '/');
            return after;                            
        }))).
        pipe(vinylSource("prelaunch.js")).
        pipe(gulpIf(production, streamify(uglify({ output: {  } })))).
        pipe(gulp.dest(buildConf.out + buildConf.outJS));

    return bundle;
});

gulp.task("build-main-script", function (cb) {
    var browserify = require("browserify");
    var vinylSource = require("vinyl-source-stream");
    var uglify = require('gulp-uglify');
    var streamify = require('gulp-streamify');
    var gulpIf = require("gulp-if");
    var mold = require("mold-source-map");

    var bundle = browserify({debug: !production}).
        add("./src/main.js").
        transform({es6: true}, "reactify").
        transform({global: true}, "browserify-shim").
        external("jquery");

	jsLibs.forEach(function (libName) {
        bundle.external(libName);
	});

    bundle = bundle.bundle().
        on("error", function (err) {
            // thanks to http://stackoverflow.com/a/24817446/212676
            console.error(err);
            this.end();
            cb();
        }).
        // patch up crappy windowsy paths here using https://github.com/thlorenz/mold-source-map
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
        pipe(gulp.dest(buildConf.out + buildConf.outJS));

	return bundle;
});



gulp.task("build-libs-script", ["clean-finished"], function (cb) {
    var browserify = require("browserify");
    var vinylSource = require("vinyl-source-stream");
    var uglify = require('gulp-uglify');
    var streamify = require('gulp-streamify');
    var gulpIf = require("gulp-if");

    var libs = browserify();

    jsLibs.forEach(function (libName) {
        libs.require(libName);
    });

    libs = libs.bundle().
        pipe(vinylSource("lib.js")).
        pipe(gulpIf(production, streamify(uglify()))).
        pipe(gulp.dest(buildConf.out + buildConf.outJS));

    return libs;
});


