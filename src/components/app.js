/*jshint node:true, browser:true, newcap:false, unused:vars, esnext:true*/
/*global*/
"use strict";
var React = require("react");
var $ = require("jquery");
var cookies = require("cookies-js");
var NavBar = require("@sportingsolutions/nav-bar");
var spinLogin = require("@sportingsolutions/ss-pricing-sharedhtml/components/spinLogin");
var config = global.config;
var RouteHandler = require("react-router").RouteHandler;
var LoginForm = require("@sportingsolutions/ss-pricing-sharedhtml/components/login-form");
var constants = require("../constants/app-constants");
var CompatibilityNav = require("./compatibility-nav");
var Notifier = require("./notifier");
var ResponsiveMixin = require('react-responsive-mixin');


/*******************************************************************************
 * main app
 */
var App = React.createClass({
  displayName: "App",
  mixins: [ResponsiveMixin],


  propTypes: {
    dispatcher: React.PropTypes.instanceOf(require("../dispatchers/app-dispatcher")),
    newsfeedStore: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      auth: {
        username: cookies.get("X-Auth-Username"),
        userManagementUrl: cookies.get("X-Auth-UserManagementUrl"),
        token: cookies.get("X-Auth-Token"),
      },
      version: "unknown",
      responsiveMode: "none"
    };
  },


  componentWillMount: function () {
    this.media({maxWidth: "20em"}, 
      () => this.setState({responsiveMode: "small"}));
    this.media({minWidth: "21em", maxWidth: "40em"}, 
      () => this.setState({responsiveMode: "small"}));
    this.media({minWidth: "41em", maxWidth: "75em"}, 
      () => this.setState({responsiveMode: "medium"}));
    this.media({minWidth: "76em"}, 
      () => this.setState({responsiveMode: "large"}));

    // signalR setup
    $.get(config.signalRHubsUrl, this.onHubsLoaded, "script");
    this.props.dispatcher.register(action => {
      if (action.actionType === constants.AUTH_FAIL) {
        this.onAuthFail();
      }
    });
  },

  onAuthenticated: function (username, token, userManagementUrl) {
    cookies.set("X-Auth-Username", username);
    cookies.set("X-Auth-Token", token);
    cookies.set("X-Auth-UserManagementUrl", userManagementUrl);
    this.setState({
      auth: {
        username: username,
        userManagementUrl: userManagementUrl,
        token: token
      }
    });
  },
  onAuthFail: function () {
    console.log("Auth fail detected at app level");
    this.logout();
  },

  login: function (username, password, cb) {
    return spinLogin(username, password, config.baseUrl, cb);
  },

  logout: function () {
    cookies.expire("X-Auth-Token");
    if (window.location.hostname !== "localhost") {
      cookies.expire("X-Auth-Username");
    }
    cookies.expire("X-Auth-UserManagementUrl");
    this.setState(this.getInitialState());
    if (global.config.loginUrl) {
      window.location = global.config.loginUrl;
    }
    else {
      this.setState({
        auth: {
          username: this.state.auth.username,
          userManagementUrl: this.state.auth.userManagementUrl,
          token: null
        }
      });
    }
  },


  render: function () {
    if (this.state.auth.token) {
      console.log("Found auth token", this.state.auth.token);
    }

    var content = this.state.auth.token ?
      <RouteHandler {...this.props} responsiveMode={this.state.responsiveMode} /> :
      <LoginForm onAuthenticated={this.onAuthenticated} username={this.state.auth.username} login={this.login} />;

    return (
      <div>
        <Notifier newsfeedStore={this.props.newsfeedStore} />
        <NavBar username={this.state.auth.username} logout={this.logout} appName="Australian Rules" />
        <div className="hosting-area">
          {content}
        </div>
        <CompatibilityNav />
      </div>
    );
  }
});


module.exports = App;