/* eslint no-shadow: 0 */
"use strict";
var gulp = require("gulp");
var config = require("./config.json");
var buildConf = require("./gulp-tasks/build-config");


// import external tasks
var buildMainScript = require("./gulp-tasks/build-main-script");
var buildPrelaunchScript = require("./gulp-tasks/build-prelaunch-script");

gulp.task("build-main-script", buildMainScript);
gulp.task("build-prelaunch-script", buildPrelaunchScript);

gulp.task("build-scripts", ["build-main-script", "build-prelaunch-script"]);
gulp.task("build-stylesheets", require("./gulp-tasks/build-stylesheets"));


////////////////////////////////////////////////////////////////////////////////
// default task
gulp.task("default", ["build"]);


////////////////////////////////////////////////////////////////////////////////
// build tasks
gulp.task("build", ["build-scripts", "bootstrap", "jquery", "build-html",
    "build-stylesheets", "copy-web-config"]);


////////////////////////////////////////////////////////////////////////////////
// miscellaneous tasks

gulp.task("develop", ["watch", "webserver"]);

// watch task: rerun tasks when files change
gulp.task("watch", function() {
    buildMainScript(function () {}, true);
    buildPrelaunchScript(function () {}, true);
    gulp.watch(['config.json'], ['build-scripts', 'build-html']);
    gulp.watch(["pages/**.jade"], ['build-html']);
    gulp.watch(["stylesheets/**"], ['build-stylesheets']);
    gulp.watch(["test/*"], ['build-tests']);
});

gulp.task('webserver', function() {
    var browserSync = require('browser-sync');
    browserSync({
        server: { baseDir: "./__generated/" },
        reloadDelay: 0,
        ghostMode: false,
        reloadOnRestart: false,
        notify: false
    });
});


////////////////////////////////////////////////////////////////////////////////
// copy html to output
gulp.task("build-html", function () {
    return gulp.src("pages/*.html").pipe(gulp.dest(config.buildFolder));
});



////////////////////////////////////////////////////////////////////////////////
// bootstrap
// we treat bootstrap as a black box and just copy it over verbatim
gulp.task("bootstrap",  function () {
    return gulp.src("node_modules/@sportingsolutions/ssln-bootstrap/js/**").
        pipe(gulp.dest(buildConf.out + buildConf.outJS));
});


////////////////////////////////////////////////////////////////////////////////
// jquery
// we treat bootstrap as a black box and just copy it over verbatim
gulp.task("jquery",  function () {
    return gulp.src("node_modules/jquery/dist/*").
        pipe(gulp.dest(buildConf.out + buildConf.outJS));
});


////////////////////////////////////////////////////////////////////////////////
// web config
// necessary for IIS to have a clue what "files" are
gulp.task("copy-web-config", function () {
    var rename = require("gulp-rename");
    return gulp.src("Web.__generated.config").
        pipe(rename("Web.config")).
        pipe(gulp.dest(buildConf.out));
});
