import React from "react";
import LoginForm from "@sportingsolutions/react-login-form";
import NavBar from "@sportingsolutions/react-nav-bar";
import Radium from "radium";
import _ from "lodash";
import config from "../../config";
import Supervisor from "./supervisor";



export default Radium(React.createClass({
  displayName: "App",
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    actions: React.PropTypes.object,
    stores: React.PropTypes.object,
    styles: React.PropTypes.object,
  },
  getDefaultProps () {
    return {
      actions: {},
      stores: {},
      styles: {}
    };
  },
  renderLogin () {
    return <LoginForm login={this.props.actions.account.login} />;
  },
  
  renderSupervisor(){
    return <Supervisor
      users={this.props.stores.getIn(["users"])}
      fixtures={this.props.stores.getIn(["fixtures"])}
      getUsers={ this.props.actions.users.getUsers}
      refresh={ this.props.actions.fixtures.fetch}>
    </Supervisor>
  },

  render () {
    return <div style={[{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}]}>
      <NavBar
        appName={`${_.capitalize(config.appName)}`}
        fixtureFactoryUrl={ config.fixtureFactoryUIUrl}
        selfTradeurl={ config.selfTradeUIUrl }
        oddsInterfaceUrl={ config.oddsInterfaceUIUrl }
        settingsUrl={ config.settingsUIUrl }
        adminUrl={ config.adminUIUrl }
        homeUrl="/"
        logout={this.props.actions.account.logout}
        username={this.props.stores.getIn(["account", "loggedIn"], false)? this.props.stores.getIn(["account", "username"]): null}>
      </NavBar>

      <div className="hosting-area" style={[{overflow: "auto"}]}>
        {this.props.stores.getIn(["account", "loggedIn"], false) ? this.renderSupervisor() : this.renderLogin()}
      </div>
    </div>;
  }
}));
