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
    getUsers: React.PropTypes.func.isRequired,
    edit: React.PropTypes.func.isRequired,
    cancelEdit: React.PropTypes.func.isRequired,
    changeExtraTime: React.PropTypes.func.isRequired,
    saveFixture: React.PropTypes.func.isRequired
  },
  
  componentWillMount (){
    this.props.getUsers();
    this.props.refresh();
  },
  
  renderFixtures (){
    return this.props.fixtures.map((fixture)=>
      <FixtureSummary 
        key={fixture.get("Id")} 
        fixture={fixture} 
        edit={this.props.edit} 
        cancelEdit={this.props.cancelEdit} 
        changeExtraTime={this.props.changeExtraTime} 
        changePenalties={this.props.changePenalties} 
        saveFixture={this.props.saveFixture}/>
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
              <th style={[{textAlign: "center"}]}>Goal Total</th>
              <th style={[{textAlign: "center"}]}>Goal Sup.</th>
              <th style={[{textAlign: "center"}]}>Draw Cor.</th>
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
