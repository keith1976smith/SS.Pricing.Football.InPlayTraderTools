import React from "react";
import Radium from "radium";
import ImmutablePropTypes from "react-immutable-proptypes";

import FixtureSummary from "./fixture-summary";

export default Radium(React.createClass({
  displayName: "SupervisorUI",
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    users: ImmutablePropTypes.list,
    fixtures: ImmutablePropTypes.list,
    refresh: React.PropTypes.func.isRequired,
    getUsers: React.PropTypes.func.isRequired
  },
  
  componentWillMount (){
    this.props.getUsers();
    this.props.refresh();
  },
  
  renderFixtures (){
    return this.props.fixtures.map((fixture)=>
      <FixtureSummary fixture={fixture}/>
    );
  },

  render () {
    return (
      <div className="fixtures-container" style={[{width: "1350px", margin: "auto", paddingTop: "56px"}]}>
        <table className="fixtures-table">
          <thead>
            <tr>
              <th width="30%">Fixture</th>
              <th>Extra Time</th>
              <th>Penalties</th>
              <th>Goal Total</th>
              <th>Goal Sup.</th>
              <th>Draw Cor.</th>
              <th>Method</th>
              <th>Select All</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.renderFixtures()}
          </tbody>
        </table>
      </div>
    );
  }

}));
