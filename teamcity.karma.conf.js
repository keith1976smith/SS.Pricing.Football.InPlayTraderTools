var _ = require("lodash");
var baseConf = require("./karma.conf").karmaConfig;

// Karma config for TeamCity
// This is used by npm run teamcity-test
// Just takes the main config and overwrites a few things

module.exports = function(config) {
  var newConf = _.defaults({
    reporters: ['teamcity'],
    autoWatch: false,
    singleRun: true,
    logLevel: config.LOG_INFO
  }, baseConf);
  config.set(newConf);
};
