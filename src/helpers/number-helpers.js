/*jshint node:true, browser:true, newcap:false, esnext: true*/
"use strict";

/*
 * zero-pad a number to at least 2 digits
 */
module.exports.pad2 = function (num) {
  var numStr = num.toString();
  if (numStr.length < 2) numStr = "0" + numStr;
  return numStr;
};
