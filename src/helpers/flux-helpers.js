/*jshint node:true, browser:true, newcap:false, unused:vars, esnext: true*/
/*global*/
"use strict";
var Actions = require("../actions/app-actions");
var constants = require("../constants/app-constants");


//var React = require("react");

function createFlux () {
	// flux structure set-up
	// create dispatcher
	var dispatcher = new (require("../dispatchers/app-dispatcher"))();

	// create stores
	var flux = {
		clockStore: new (require("../stores/clock-store"))(),
		flagsStore: new (require("../stores/flags-store"))(),
		fixtureStore: new (require("../stores/fixture-store"))(),
		marketsStore: new (require("../stores/markets-store"))(),
		newsfeedStore: new (require("../stores/newsfeed-store"))(),
		scoreLogStore: new (require("../stores/score-log-store"))(),
		headlinesStore: new (require("../stores/headlines-store"))(),
		scoreboardStore: new (require("../stores/scoreboard-store"))(),
		shotOnGoalStore: new (require("../stores/shot-on-goal-store"))(),
		calibrationStore: new (require("../stores/calibration-store"))(),
		suspendGroupsStore: new (require("../stores/suspend-groups-store"))(),
		baseVariablesStore: new (require("../stores/base-variables-store"))(),
		starredMarketsStore: new (require("../stores/starred-markets-store"))(),
		traderVariablesStore: new (require("../stores/trader-variables-store"))(),
		overroundAdjustmentStore: new (require("../stores/overround-adjustment-store"))(),
		calculationVariablesStore: new (require("../stores/calculation-variables-store"))(),
	};

	// register stores with dispatcher
	for (var store in flux) {
		dispatcher.register(flux[store].onAction.bind(flux[store]));
	}

	flux.dispatcher = dispatcher;

	// create actions helper (it needs dispatcher to dispatch actions, and stores to
	// read data)
	flux.actions = new Actions(flux);

	// send all alerts to the console
	flux.dispatcher.register(function (action) {
	  if (action.actionType === constants.ERROR) {
	    console.error(action.err);
	  }
	});

	return flux;
}

module.exports = { createFlux };