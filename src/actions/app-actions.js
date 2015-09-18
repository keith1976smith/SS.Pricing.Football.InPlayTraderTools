/*jshint node:true, browser:true, newcap:false, unused:vars, esnext: true*/
"use strict";

var constants = require("../constants/app-constants");
var linkProp = "_links";
var _ = require("lodash");
var api = require("../apis/australian-rules-api");
var aussieLinkRels = require("../constants/link-relations").aussie;
var Q = require("kew");
var uuid = require('node-uuid');
var getIn = require("@sportingsolutions/ss-pricing-sharedhtml/lib/get-in");

module.exports = function (params) {
    var dispatcher = params.dispatcher;

    function dispatchError (err) {
        if (err.status ===  401) {
            dispatcher.dispatch({
                actionType: constants.AUTH_FAIL,
                err: err.statusText
            });
        }
        else {
            var message = getIn(err, ["responseJSON", "message"], err.statusText);
            dispatcher.dispatch({
                actionType: constants.ERROR,
                err: message
            });
        }
        throw err;
    }

    var actions = {
        loadFixtureById: function (fixtureId) {
            dispatcher.dispatch({
                actionType: constants.START_FIXTURE_LOADING
            });
            return api.loadFixtureById(fixtureId).then(
                this.gotFixtureData, dispatchError);
        }


    };

    for (var action in actions) {
        actions[action] = actions[action].bind(actions);
    }

    return actions;
};


// uncomment this if you need to dummy up a promise-returning async function
// function pretendo (cb) {
//     var d = Q.defer();
//     setTimeout(() => d.resolve(), 1000);
//     return d.promise.then(cb);
// }