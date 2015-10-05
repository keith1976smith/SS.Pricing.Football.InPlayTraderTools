import React from "react";
import Radium from "radium";
import ImmutablePropTypes from "react-immutable-proptypes";


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
      <tr>
        <td>
          <div>
            <div>{fixture.CeState.Date} <span>Waiting for events</span></div>
            <div><strong>{fixture.CeState.HomeTeam} v {fixture.CeState.AwayTeam}</strong></div>
            <div>{fixture.CeState.Competition}</div>
          </div>
        </td>
        <td>{fixture.CeState.IsExtraTime ? "ET" : ""}</td>
        <td>{fixture.CeState.IsPenalties ? "P" : ""}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  },

  render () {

    
    return (
      <div className="fixtures-container" style={[{width: "1350px", margin: "auto", paddingTop: "56px"}]}>
        <table className="fixtures-table">
          <thead>
            <tr>
              <th width="40%">Fixture</th>
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
