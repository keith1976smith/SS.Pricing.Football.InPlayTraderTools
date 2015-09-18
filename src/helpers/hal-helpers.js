/*jshint node:true, browser:true, newcap:false, esnext: true*/
"use strict";

var _ = require("lodash");


var linksProp = "_links";
var embeddedProp = "_embedded";

function stripPrivate (data) {
	return _.isObject(data)? _.omit(data, (v, k) => k.charAt(0) === "_" ) : data;
}

function hasLink (data, linkRel) {
	if (_.isObject(data[linksProp])) data = data[linksProp];
	return _.isObject(data[linkRel]);
}

module.exports.stripPrivate = stripPrivate;
module.exports.hasLink = hasLink;