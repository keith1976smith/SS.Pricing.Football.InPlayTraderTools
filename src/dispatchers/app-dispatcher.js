/*jshint node:true, browser:true, newcap:false, unused:vars, esnext: true*/
"use strict";
var Dispatcher = require("flux").Dispatcher;
var _ = require("lodash");

let baws = `${baws}`;

Dispatcher.prototype._dispatch = Dispatcher.prototype.dispatch;

Dispatcher.prototype.dispatch = function (action) {
    if ((!action) || !(_.isString(action.actionType))) {
        console.error("Invalid action payload", action);
    }
    if (global.config.dispatcherLogging) {
        let actionType = action.actionType;
		console.debug(`[${(new Date()).toTimeString()}] Dispatch: ${actionType}`, action);
    }
    window.dispatchStart = Date.now();
    this._dispatch.apply(this, arguments);
};

module.exports = Dispatcher;
