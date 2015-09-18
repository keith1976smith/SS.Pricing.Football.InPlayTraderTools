/*jshint node:true, unused: vars */
"use strict";
var gulp = require("gulp");
var gutil = require("gulp-util");
var config = require("./config.json");
var buildConf = require("./gulp-tasks/build-config");
var gulpsync = require('gulp-sync')(gulp);

// these libs will be built into a separate js file with no source map
var jsLibs = buildConf.externalizeLibs;

// import external tasks
require("./gulp-tasks/build-scripts");
require("./gulp-tasks/build-stylesheets");


////////////////////////////////////////////////////////////////////////////////
// default task
// run install, THEN build, THEN test
// gulpsync is a workaround until gulp 4 comes out with composable dependency
// chains. see https://www.npmjs.org/package/gulp-sync/
gulp.task("default", gulpsync.sync(["install", "build"], "sync default"));


////////////////////////////////////////////////////////////////////////////////
// build tasks
gulp.task("build", ["build-app", "build-tests"]);

gulp.task("build-app", ["build-scripts", "bootstrap", "jquery", "build-pages", "build-stylesheets", "copy-web-config"]);


gulp.task("noop", function () {
    gutil.log("noop");
});

////////////////////////////////////////////////////////////////////////////////
// miscellaneous tasks

// watch task: rerun tasks when files change
gulp.task("watch", function() {
    gulp.watch(['{src,react}/**/*.{js,jsx}'], ['build-scripts', 'build-test-scripts']);
    gulp.watch(['config.json'], ['build-scripts', 'build-pages']);
    gulp.watch(["pages/**.jade"], ['build-pages']);
    gulp.watch(["stylesheets/**"], ['build-stylesheets']);
    gulp.watch(["test/*"], ['build-tests']);
    //gulp.watch(["__generated/js/**", "__generated/test/**"], ['test']);
});

// install task: effectively, npm install
gulp.task("install", ["clean-finished"], function(cb) {
    var npm = require("npm");
    npm.load({}, function (er) {
        if (er) return cb(er);
        npm.commands.install([], function (er, data) { cb(er); });
        npm.on("log", function (message) { console.log(message); });
    });
});


////////////////////////////////////////////////////////////////////////////////
// clean task
// delete the whole "__generated" folder
var cleaning = false;
gulp.task("clean", function (cb) {
    var rimraf = require("rimraf");
    var retry = require("retry");
    cleaning = true;
    // using retry because virus checkers on Windows can make deleting a tree
    // full of files a bit flaky
    var operation = retry.operation();
    operation.attempt(function(currentAttempt) {
        rimraf('./__generated', function (err) {
            if (operation.retry(err? true : null)) {
                console.log("Backing off and retrying...");
                return;
            }
            cleaning = false;
            cb(err ? operation.mainError() : null);
        });
    });
});


// middleman task - immediatly completes if "clean" task not running, otherwise
// wait for it to finish We do this so that we can run other build tasks without
// having to clean every time, but if clean is manually speciified, we will wait
// for it to complete before doing any building
gulp.task("clean-finished", function (cb) {
    if (!cleaning) cb();
    gulp.on("task_stop", function (e) {
        if (e.task === "clean") cb();
    });
});


gulp.task('webserver', ["browser-sync"]);

gulp.task("develop", ["watch", "webserver"]);

gulp.task('browser-sync', function() {
    var browserSync = require('browser-sync');
    var reload      = browserSync.reload;

    browserSync({
        server: {
            baseDir: "./__generated/",
        },
//        files: [
//            "__generated/**/*.js", 
//            "__generated/**/*.html", 
//            "__generated/**/*.css"
//        ],
        reloadDelay: 0,
        ghostMode: false,
        reloadOnRestart: false
    });
});



////////////////////////////////////////////////////////////////////////////////
// compile jade templates to static HTML
gulp.task("build-pages", ["clean-finished"], function () {
    var jade = require("gulp-jade");
    var reload = require('browser-sync').reload;

    // set up the jade locals to help compile the pages
    var locals = {
        jsUrl: config.rootUrl + buildConf.outJS + "/",
        cssUrl: config.rootUrl + buildConf.outCss + "/",
        bootstrapUrl: config.rootUrl + buildConf.outBootstrap + "/",
        forceHTTPS: !!(config.forceHTTPS)
    };
    //_.extend(locals, config);

    // thanks to https://github.com/gulpjs/gulp/issues/71#issuecomment-41512070
    var j = jade({
        locals: locals,
        pretty: true
    });
    j.on("error", function (err) {
        console.error(err);
        j.end();
    });
    return gulp.src("pages/index.jade")
        .pipe(j)
        .pipe(gulp.dest(buildConf.out + buildConf.outHtml)).
        pipe(reload({stream: true}));
});




////////////////////////////////////////////////////////////////////////////////
// bootstrap
// we treat bootstrap as a black box and just copy it over verbatim
gulp.task("bootstrap", ["clean-finished"],  function () {
    return gulp.src("node_modules/@sportingsolutions/ssln-bootstrap/js/**").
        pipe(gulp.dest(buildConf.out + buildConf.outJS));
});


////////////////////////////////////////////////////////////////////////////////
// jquery
// we treat bootstrap as a black box and just copy it over verbatim
gulp.task("jquery", ["clean-finished"],  function () {
    return gulp.src("node_modules/jquery/dist/*").
        pipe(gulp.dest(buildConf.out + buildConf.outJS));
});


////////////////////////////////////////////////////////////////////////////////
// web config
// necessary for IIS to have a clue what "files" are
gulp.task("copy-web-config", ["clean-finished"], function () {
    var rename = require("gulp-rename");
    return gulp.src("Web.__generated.config").
        pipe(rename("Web.config")).
        pipe(gulp.dest(buildConf.out));    
});


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// TEST STUFF
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// // list of script dependencies for mocha tests. these get injected into the
// // test harmness html, and as a comment in the JS for the benefit of Chutzpah
// var testDependencies = ["./mocha.js", "./test-lib.js", "../js/lib.js"];

gulp.task('test', function () {
    var gUtil = require("gulp-util");
    var reporter = gUtil.env.reporter || "spec";
    var mochaPhantomJS = require('gulp-mocha-phantomjs');
    return gulp.src('__generated/test/test.html')
        .pipe(mochaPhantomJS({
            reporter: reporter, 
            phantomjs: {
                ignoreSslErrors: true
            }

            //silent: true
        }))
        .on("error", function (err) {
            console.error(err);
            this.end();
        });
});

gulp.task("build-tests", ["build-test-scripts", "build-test-libs", "build-test-pages", "build-test-css"]);

gulp.task("build-test-scripts", ["clean-finished"],  function () {
    var browserify = require("browserify");
    var proxyquire = require('proxyquireify');
    var vinylSource = require("vinyl-source-stream");
    var plumber = require('gulp-plumber');
    //var streamify = require('gulp-streamify');

    var tests = browserify({debug: true}).
        transform({es6: true}, "reactify").
        transform({global: true}, "browserify-shim").
        plugin(proxyquire.plugin).
        external("jquery").
        external("chai").
        add("./test/test.js");

    jsLibs.forEach(function (libName) {
        tests.external(libName);
    });

    tests.bundle().
        on("error", function (err) {
            console.error(err);
            this.end();
        }).
        pipe(vinylSource("test.js")).
        pipe(plumber()).
        pipe(gulp.dest(buildConf.out + buildConf.outTest));
});

gulp.task("build-test-libs", ["clean-finished"],  function () {
    var browserify = require("browserify");
    var merge = require("merge-stream");
    var vinylSource = require("vinyl-source-stream");
    var mochajs = gulp.src([
        // use this copy taken from chutzpah because it's broken with more
        // recent versions
        //"vendor/mocha.js",
        // use this mocha to have to most up-to-date version
        "node_modules/mocha/mocha.js"
    ]).
    pipe(gulp.dest(buildConf.out + buildConf.outTest));

    var otherjs = browserify().
        require("chai").
        bundle().
        pipe(vinylSource("test-lib.js")).
        pipe(gulp.dest(buildConf.out + buildConf.outTest));

    return merge(mochajs, otherjs);
});

gulp.task("build-test-pages", ["clean-finished"],  function () {
    var jade = require("gulp-jade");

    // thanks to https://github.com/gulpjs/gulp/issues/71#issuecomment-41512070
    var j = jade({
        locals: {},
        pretty: true
    });
    j.on("error", function (err) {
        console.error(err);
        j.end();
    });
    return gulp.src("test/test.jade")
        .pipe(j)
        .pipe(gulp.dest(buildConf.out + buildConf.outTest));
});

gulp.task("build-test-css", ["clean-finished"],  function () {
    var concatCss = require('gulp-concat-css');
    return gulp.src([
        "node_modules/mocha/mocha.css",
    ]).
    pipe(concatCss("test.css")).
    pipe(gulp.dest(buildConf.out + buildConf.outTest));
});



