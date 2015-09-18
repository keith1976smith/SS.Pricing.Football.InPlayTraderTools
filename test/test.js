/** @jsx React.DOM */
/*jshint node:true, browser:true, newcap:false, unused:vars, esnext: true, expr: true*/
/*global it, before, describe, after */
"use strict";
global.config = require("../config");
require("chai").should();

var $ = require("jquery");

$.ajax = function () {
	throw new Error("Naughty! No AJAX in tests, please");
};

describe("something", function () {
	before(function (cb) {
		cb();
	});

	after(function () {
	});

	it("should something", function () {
	});

});