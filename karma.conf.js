// Karma configuration
// Generated on Wed Sep 02 2015 16:24:32 GMT+0100 (GMT Daylight Time)
var _ = require("lodash");

var karmaConfig = {

  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '',

  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['browserify', 'mocha'],

  browserify: {
    debug: true,
    transform: ["babelify", "envify"]
  },

  // list of files / patterns to load in the browser
  files: [
    'test/test-*.js'
  ],

  // list of files to exclude
  exclude: [
  ],

  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
    'test/**/*.js': [ 'browserify' ],
    'src/**/*.js': [ 'browserify' ],
  },

  // test results reporter to use
  // possible values: 'dots', 'progress'
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  reporters: ['progress', 'notify'],

  notifyReporter: {
    reportEachFailure: true, // Default: false, Will notify on every failed sepc
    reportSuccess: true, // Default: true, Will notify when a suite was successful
  },

  // web server port
  port: 9876,

  // enable / disable colors in the output (reporters and logs)
  colors: true,

  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: true,

  // start these browsers
  // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
  browsers: ['Firefox'],

  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: false,

  // See https://www.npmjs.com/package/karma-mocha
  client: {
    mocha: {
      reporter: 'html', // change Karma's debug.html to the mocha web reporter
      ui: 'bdd'
    }
  }
};


module.exports = function(config) {
  config.set(_.defaults({logLevel: config.LOG_INFO}, karmaConfig));
}

module.exports.karmaConfig = karmaConfig;
