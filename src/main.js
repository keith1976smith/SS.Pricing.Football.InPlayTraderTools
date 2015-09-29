import React from "react";
import App from "./components/app";
import AccountActions from "./actions/account-actions";
import FixtureActions from "./actions/fixture-actions";
import FilterActions from "./actions/filter-actions";
import createEventStreams from "./create-event-streams";
import AccountStore from "./stores/account-store";
import FixturesStore from "./stores/fixtures-store";
import FilterStore from "./stores/filter-store";
import Rx from "rx";
import _ from "lodash";
import Immutable from "immutable";
import { Router, Route } from 'react-router';
import cookies  from "cookies-js";
import PricingApi from "@sportingsolutions/pricing-api";
import {baseUrl} from "../config";

// recover login details from cookies
const username = cookies.get("X-Auth-Username");
const userManagementUrl = cookies.get("X-Auth-UserManagementUrl");
const authToken = cookies.get("X-Auth-Token");
const password = cookies.get("X-Auth-Password");

// create a pricing API client using those details
const pricingApi = PricingApi(baseUrl, username, password, authToken);

// flux stuff
// a catalog of actions we can listen to
const eventStreams = createEventStreams();

// a catalog of stores
const stores = {
  account: AccountStore(eventStreams),
  fixtures: FixturesStore(eventStreams),
  filter: FilterStore(eventStreams),
};

// a catalog of callable actions
const actions = {
  account: AccountActions(stores, eventStreams.account, pricingApi),
  fixtures: FixtureActions(stores, eventStreams.fixtures, pricingApi),
  filter: FilterActions(stores, eventStreams.filter),
};

// the pricing API will auto-login when it has an auth fail. we will listen for
// that here so we can store the new auth token
pricingApi.on("autologin", ({username, password, userManagementUrl, authToken}) => {
  console.log("detected api peforming an autologin")
  actions.account.restoreLogin(username, password, authToken, userManagementUrl);
});

// also we'll store the retrieved login details now
if (authToken && username && userManagementUrl && password) {
  console.log("stored credentials found; updating store")
  actions.account.restoreLogin(username, password, authToken, userManagementUrl);
}
else {
  console.log("no stored credentials found")
}

// store login deets
stores.account.subscribe(account => {
  const {loggedIn, username, authToken, userManagementUrl, password} = account.toJS();
  if (loggedIn) {
    console.log("account store updated; storing cookies")
    cookies.set("X-Auth-Username", username);
    cookies.set("X-Auth-Token", authToken);
    cookies.set("X-Auth-UserManagementUrl", userManagementUrl);
    cookies.set("X-Auth-Password", password);
  }
  else {
    console.log("account store wiped out, clearing cookies")
    cookies.expire("X-Auth-Token");
    cookies.expire("X-Auth-Username");
    cookies.expire("X-Auth-UserManagementUrl");
    cookies.expire("X-Auth-Password");
  }
});


// an aggregate feed of all stores
const storeSubject = new Rx.BehaviorSubject(Immutable.Map());

_.forEach(stores, (store, label) => {
  store.subscribe(data => {
    storeSubject.onNext(storeSubject.getValue().merge({[label]: data}))
  });
});


// wrapper class injects store data into App
const StoreDataInjectionAppWrapper = React.createClass({
  displayName: "StoreDataInjectionAppWrapper",
  componentWillMount () {
    this.subscription = storeSubject.subscribe(stores => {
      this.setState({stores});
    });
  },
  componentWillUnmount () {
    this.subscription.dispose();
  },
  render () {
    return <App
      actions={actions}
      styles={{ app: {} }}
      stores={this.state.stores} />
  }
});

// render a router into the page
React.render(
  <Router>
    <Route path="/" component={StoreDataInjectionAppWrapper} />
  </Router>,
  document.getElementById("app")
);
