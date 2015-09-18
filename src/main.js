/*jshint node:true, browser:true, newcap:false, unused:vars, esnext: true*/
/*global*/

"use strict";
var config = global.config = require("../config");
var React = require("react");
var App = require("./components/app");
var $ = require("jquery");
var _ = require("lodash");
require("signalr");
//var aussieLinkRels = require("./constants/link-relations").aussie;


// router components
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var RouteHandler = Router.RouteHandler;

var FixtureIdForm = require("./components/fixture-id-form");
var Home = require("./components/home");
var SelfTrade = require("./components/self-trade");
var NotFound = require("./components/not-found");
var FiddleAuthToken = require("./components/fiddle-auth-token");
var LoginForm = require("@sportingsolutions/ss-pricing-sharedhtml/components/login-form");
var constants = require("./constants/app-constants");
var BootstrapDemo = require("./components/bootstrap-demo");
var ResponsiveDemo = require("./components/responsive-demo");

var createFlux = require("./helpers/flux-helpers").createFlux;

// kickoff
var flux = createFlux();


var existing = (window && window.localStorage)? window.localStorage.getItem("starredMarkets") : null;

if (existing) {
  flux.starredMarketsStore.replace(JSON.parse(existing));
}

flux.starredMarketsStore.addChangeListener(data => {
    if ( !(window && window.localStorage) ) { return; }
    window.localStorage.setItem("starredMarkets", JSON.stringify(data));
});

////////////////////////////////////////////////////////////////////////////////
// signalR setup
$.get(config.signalRHubsUrl, function () {
    var aflHub = $.connection.australianRulesHub;
    var self = this;
    aflHub.client.matchClockUpdatedAtTime = function(fixtureId, minutes, seconds) {
        if (normaliseGuid(fixtureId) === normaliseGuid(self.props.fixtureStore.getFixture().id)) {
          console.log(`Clock ping for ${fixtureId}: ${minutes}:${seconds}`);
          self.props.actions.gotClockTime(minutes, seconds);
        }
    };


    aflHub.client.traderVariables = function (id, data) {
      data = parseJsonIfNecessary(data);
      flux.dispatcher.dispatch({
          actionType: constants.GOT_TRADER_VARIABLES,
          data: data
      });
    };
    
    aflHub.client.calibrationException = function (data) {
      data = parseJsonIfNecessary(data);
      flux.dispatcher.dispatch({
          actionType: constants.ERROR,
          err: data
      });
    };

    
    aflHub.client.notification = function (thingy, data) { 
      data = parseJsonIfNecessary(data);
      flux.dispatcher.dispatch({
          actionType: constants.GENERIC_NOTIFICATION,
          message: data.message
      });            
    };

    aflHub.client.calculationStarted = function (incomingId, eventId) { 
      var fixtureId = flux.fixtureStore.getFixture().id;
      if (incomingId !== fixtureId) {
        console.warn(`Ignoring market data for fixture ${incomingId}`);
        return;
      }

      flux.dispatcher.dispatch({
          actionType: constants.CALCULATION_STARTED,
          eventId: eventId
      });            
    };

    aflHub.client.calculationFinished = function (incomingId, eventId) { 
      var fixtureId = flux.fixtureStore.getFixture().id;
      if (incomingId !== fixtureId) {
        console.warn(`Ignoring market data for fixture ${incomingId}`);
        return;
      }
      flux.dispatcher.dispatch({
          actionType: constants.CALCULATION_FINISHED,
          eventId: eventId
      });            
    };


    var calculating = flux.flagsStore.getData().calculating;

    flux.flagsStore.addChangeListener(data => {
        if ((! data.calculating) && calculating) {
          setTimeout(flux.actions.loadMarkets, 0);
        }
        calculating = data.calculating;
    });



    aflHub.client.suspendGroups = function (id, data, version) { 
      data = parseJsonIfNecessary(data);

      flux.dispatcher.dispatch({
          actionType: constants.GOT_SUSPEND_GROUPS_DATA,
          data: data
      });

    };
    
    $.connection.hub.logging = global.config.signalRLogging;
    $.connection.hub.url = config.signalRUrl;

    var tryingToReconnect = false;

    $.connection.hub.reconnecting(function() {
      // flux.dispatcher.dispatch({
      //     actionType: constants.GENERIC_NOTIFICATION,
      //     message: "Reconnecting"
      // });            
      tryingToReconnect = true;
    });

    $.connection.hub.reconnected(function() {
      // flux.dispatcher.dispatch({
      //     actionType: constants.GENERIC_NOTIFICATION,
      //     message: "Reconnected"
      // });            
      tryingToReconnect = false;
    });

    $.connection.hub.disconnected(function() {
      flux.dispatcher.dispatch({
          actionType: constants.GENERIC_NOTIFICATION,
          message: "Disconnected. Retrying..."
      });            
      if(tryingToReconnect) {
          flux.dispatcher.dispatch({
              actionType: constants.GENERIC_NOTIFICATION,
              message: "Real-time connection lost"
          });            
      }
      setTimeout(start, 5000); // Restart connection after 5 seconds. 
    });

    var subscribedId = null;
    var subscribingId = null;

    function subscribe () {
      if (subscribedId !== null) {
        aflHub.server.unsubscribe(subscribedId);
      }
      
      var fixtureId = flux.fixtureStore.getFixture().id;
      if (fixtureId === subscribingId) {
        return;
      }
      subscribingId = fixtureId;
      if (fixtureId) {
        console.log("subscribing to fixture id " + fixtureId);
        aflHub.server.subscribe(fixtureId).then(
          function () {
            console.log("subscription succeeded");
            subscribedId = fixtureId;
            // flux.dispatcher.dispatch({
            //     actionType: constants.GENERIC_NOTIFICATION,
            //     message: "Subscribed to fixture"
            // });            
            subscribingId = null;     
          },
          function (er) {
            console.log("subscribe failed: " + er.message);
            subscribingId = null;
          }
        );
      }
      else {
        console.log("not subscribing yet, fixture id is " + fixtureId);
      }
    }


    function start () {
      $.connection.hub.start({ pingInterval: 10000 }).done(function () {
        var transportName = ($.connection.hub.transport)? `transport = ${$.connection.hub.transport.name}` :
          "transport is undefined and nobody knows why";
        console.log(`Connected, ${transportName},  connection id = ${$.connection.hub.id}`);
        subscribe();

        flux.fixtureStore.addChangeListener(data => {
          if (data.id !== subscribedId) { subscribe(); } 
        });
      });
    }

    start();

  }, "script");


var Root = React.createClass({
  displayName: "Root",
  render: function () {
    return <RouteHandler {...this.props} />;
  }
});

console.log("about to start router, current href is " + window.location.href);

var routes =
  <Route path="/" handler={Root}>
    <Route name="authtoken" handler={FiddleAuthToken} />ResponsiveDemo
    <Route name="bootstrap-demo" handler={BootstrapDemo} />
    <Route name="responsive-demo" handler={ResponsiveDemo} />
    <Route path="/" handler={App}>  
      <DefaultRoute name="home" handler={Home} />

      <Route name="fixture-id" handler={FixtureIdForm} />
      <Route name="login" handler={LoginForm} />
      <Route name="self-trade" path="self-trade/:fixtureId" handler={SelfTrade} />
    </Route>
    <NotFoundRoute handler={NotFound}/>
  </Route>;


Router.run(routes, function (Handler) {
  React.render(<Handler {...flux} />, document.getElementById('app-area'));
});

////////////////////////////////////////////////////////////////////////////////
// helper functions

function normaliseGuid (guid) {
  return _.isString(guid)? guid.replace("-", "").toLowerCase() : "";
}

/*
 * as of right now, sigR data is coming in as a string of JSON for some bizarre 
 * reason so we need to parse it. since this may get fixed one day i'm making 
 * this smart so it check wheteher it needs to parse or not.
 */
function parseJsonIfNecessary (data) {
  return _.isString(data) ? JSON.parse(data) : data;
}

