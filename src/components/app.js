import React from "react";
import LoginForm from "@sportingsolutions/react-login-form";
import NavBar from "@sportingsolutions/react-nav-bar";
//var Chooser = NavBar.Chooser;
import Radium from "radium";
import _ from "lodash";
import config from "../../config";
import FixtureNavigator from "./fixture-navigator";
import styles from "../styles/dark";


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
  renderFixtureList () {
    return <FixtureNavigator
            loggedInUsername={this.props.stores.getIn(["account", "username"])}
            styles={styles}
            fixtures={this.props.stores.getIn(["fixtures"])}
            filter={this.props.stores.getIn(["filter"])}
            refresh={this.props.actions.fixtures.fetch}
            setDefinitionFilter={this.props.actions.filter.setDefinition}
            setCompetitionFilter={this.props.actions.filter.setCompetition}
            setDescriptionFilter={this.props.actions.filter.setDescription}
            setSortByField={this.props.actions.filter.setSortByField}
            setSortAscending={this.props.actions.filter.setSortAscending}
            clearFilter={this.props.actions.filter.clear}
          />;
  },
  render () {
    return <div style={[{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}]}>
      <NavBar
        appName={`${_.capitalize(config.sport)} Fixtures`}
        fixtureFactoryUrl={ config.fixtureFactoryUIUrl}
        selfTradeurl={ config.selfTradeUIUrl }
        oddsInterfaceUrl={ config.oddsInterfaceUIUrl }
        settingsUrl={ config.settingsUIUrl }
        adminUrl={ config.adminUIUrl }
        homeUrl="/"
        logout={this.props.actions.account.logout}
        username={this.props.stores.getIn(["account", "loggedIn"], false)? this.props.stores.getIn(["account", "username"]): null}>
      </NavBar>

      <div className="hosting-area">
        {this.props.stores.getIn(["account", "loggedIn"], false) ? this.renderFixtureList() : this.renderLogin()}
      </div>
    </div>;
  }
}));
