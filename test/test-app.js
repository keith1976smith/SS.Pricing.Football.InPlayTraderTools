/*eslint react/display-name: 0, react/prop-types: 0 */
/*global describe, it */
"use strict";

var React = require("react/addons");
var testUtils = React.addons.TestUtils;
var chai = require("chai");
var expect = chai.expect;
var App = require("../src/components/app");
var LoginForm = require("@sportingsolutions/react-login-form");
var sinon = require("sinon");
var Immutable = require("immutable");
// var sinonChai = require("sinon-chai");
// chai.use(sinonChai);

function makePromiseSpy () {
  return sinon.spy(() => new Promise ((resolve, reject) => {
    console.log("spy created");
  }))
}

function getSpyActions () {
  return {
    account: {
      login: makePromiseSpy(),
      logout: makePromiseSpy()
    }
  };
}

var testUsername = "testUsername";
var testPassword = "testPassword";


describe("new-project", function () {

  // it("should allow you to log in", function () {
  //   var renderer = TestUtils.createRenderer();
  //   renderer.render(<App />);
  //   var result = renderer.getRenderOutput();
  //   expect(result.type).to.equal(ChildComponent);
  //   expect(1).to.equal(1);
  // });


  it("should have a login form", function () {
    const tree = testUtils.renderIntoDocument(<App actions={getSpyActions()} stores={Immutable.Map({account: {loggedIn: false}})} />);
    const kids = testUtils.scryRenderedComponentsWithType(tree, LoginForm);
    expect(kids.length).to.equal(1);
  });

  it("should allow you to log in", function () {
    var spyActions = getSpyActions();
    const tree = testUtils.renderIntoDocument(<App actions={spyActions}  stores={Immutable.Map({account: {loggedIn: false}})} />);
    const usernameField = testUtils.findAllInRenderedTree(tree, element =>
      element.getDOMNode().tagName == "INPUT" && element.getDOMNode().type == "text"
    )[0];
    const passwordField = testUtils.findAllInRenderedTree(tree, element =>
      element.getDOMNode().tagName == "INPUT" && element.getDOMNode().type == "password"
    )[0];
    const button = testUtils.findAllInRenderedTree(tree, element => {
      const node = element.getDOMNode();
      return node.tagName == "BUTTON" && (node.innerText || node.textContent).toLowerCase() == "log in"
    })[0];
    expect(usernameField).to.exist;
    expect(passwordField).to.exist;
    expect(button).to.exist;
    usernameField.getDOMNode().value = testUsername;
    passwordField.getDOMNode().value = testPassword;
    testUtils.Simulate.click(button.getDOMNode());
    expect(spyActions.account.login.calledOnce).to.be.true;
    console.log(spyActions.account.login.getCall(0).args);
    expect(spyActions.account.login.calledWith(testUsername, testPassword)).to.be.true;
  });

  it("should display an error when login fails", function (done) {
    var spyActions = getSpyActions();
    spyActions.account.login = function () {
      return Promise.reject("Awful");
    };
    const tree = testUtils.renderIntoDocument(<App actions={spyActions} stores={Immutable.Map({account: {loggedIn: false}})} />);
    const button = testUtils.findAllInRenderedTree(tree, element => {
      const node = element.getDOMNode();
      return node.tagName == "BUTTON" && (node.innerText || node.textContent).toLowerCase() == "log in"
    })[0];
    testUtils.Simulate.click(button.getDOMNode());
    process.nextTick(() => {
      const alert = testUtils.findAllInRenderedTree(tree, element => {
        const node = element.getDOMNode();
        return (node.innerText || node.textContent) == "Awful"
      })[0];
      expect(alert).to.exist;
      done();
    });
  });

});
