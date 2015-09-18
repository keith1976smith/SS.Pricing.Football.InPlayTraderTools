/*
 * Helpers for working with character cases in strings
 */
/*jshint node:true, browser:true, newcap:false, esnext: true*/
/*global*/
"use strict";
var _ = require("lodash");

var decamelisingRegexes = [
    /([a-z0-9])([A-Z])/g,
    /([A-Za-z])(\d|[A-Z][a-z])/g,
    /([0-9])([A-Za-z])/g
];

/*
 * Turn any camel-case or smilararly formatted string into an equivalent 
 * space-delimited string (without altering the case of any letters)
 */
exports.decamel = function (str, fill) {
    if (typeof(fill) == "undefined") fill = ' ';
    var replacement = '$1' + fill + '$2';
    for (var i=0; i < decamelisingRegexes.length; i++) {
        str = str.replace(decamelisingRegexes[i], replacement);
    }
    return str;
};


/*
 * Capitalize the first character of a string (if it's a letter)
 */
exports.capitalizeFirst = function (str) {
	if ( (!_.isString(str)) || str.length === 0 ) return str;
	return str[0].toUpperCase() + str.substr(1);
};


/*
 * Combine decamel() and capitalizeFirst() to to turn a case-delimited string
 * into a user-presentable string
 */
exports.label2Display = function (str) {
	return exports.capitalizeFirst(exports.decamel(str));
};
