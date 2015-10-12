import React from "react";
import Radium from "radium";
import ImmutablePropTypes from "react-immutable-proptypes";

import StatusIndicator from "./match-status-indicator";
import ExtraTimeEditor from "./extra-time-editor";

export default Radium(React.createClass({

  displayName: "FixtureSummary",
  
  mixins: [React.addons.PureRenderMixin],
  
  getInitialState(){
    return {
      editMode: false
    };
  },
  
  propTypes: {
    fixture: React.PropTypes.object.isRequired
  },
  
  formatFixtureDate(date){
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let dt = new Date(date);
    let month = months[dt.getMonth()];
    let day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
    let hour = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
    let minute = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
    return `${day}-${month} ${hour}:${minute}`;
  },
  renderExtraTimeLabel(){
    if (this.props.fixture.CeStateResponse.IsExtraTime) return <span style={[{padding: "1px", margin: "1px"}]} className="label label-success" title="This fixture may go into extra time">ET</span>;
  },
  renderPenaltiesLabel(){
    if (this.props.fixture.CeStateResponse.IsPenalties) return <span style={[{padding: "1px", margin: "1px"}]} className="label label-primary" title="This fixture may go into penalties">P</span>;
  },
  renderExtraTimeEditThing(){
    let canSetExtraTime = !(this.props.fixture.EventStateResponse.MatchStatus === 50 || 
      (this.props.fixture.EventStateResponse.MatchStatus === 40 && typeof this.props.fixture.EventStateResponse.TraderExtraTimeSetup != 'object'));
    if (canSetExtraTime) return <ExtraTimeEditor {...this.props.fixture.EventStateResponse.TraderExtraTimeSetup} editMode={this.state.editMode}/>;
  },
  renderPenaltiesEditThing(){
    let canSetPenalties = !(this.props.fixture.EventStateResponse.MatchStatus === 50 || 
      (this.props.fixture.EventStateResponse.MatchStatus === 40 && typeof this.props.fixture.EventStateResponse.TraderPenaltiesSetup != 'object'));
    if (canSetPenalties) return <a href="#">None</a>;
  },
  renderEditButtons(){
    if (this.state.editMode){
      return (
        <div>
          <button style={[{padding: "2px", margin: "1px"}]} className="btn btn-success btn-xs">Save</button>
          <button style={[{padding: "2px", margin: "1px"}]} className="btn btn-danger btn-xs" onClick={()=>this.setState({editMode: false})}>Cancel</button>
        </div>
      );
    }
    else{
      return <button style={[{padding: "2px", margin: "1px"}]} className="btn btn-primary btn-xs" onClick={()=>this.setState({editMode: true})}>Edit</button>
    }
  },
  render () {

    return (
      <tr className="fixture-summary-row">
        <td>
          <div>
            <div>
              <span>{this.formatFixtureDate(this.props.fixture.CeStateResponse.Date)} </span>
              <StatusIndicator matchStatus={this.props.fixture.EventStateResponse.MatchStatus} inPlayEventState={this.props.fixture.EventStateResponse.InPlayEventState}/>
              <div style={[{float: "right"}]}>
                {this.renderEditButtons()} 
              </div>
            </div>
            <div>
              <strong>{this.props.fixture.CeStateResponse.HomeTeam} v {this.props.fixture.CeStateResponse.AwayTeam}</strong>
              <div style={[{display: "inline-block", marginLeft: "5px"}]}>
                {this.renderExtraTimeLabel()}
                {this.renderPenaltiesLabel()}
              </div>
            </div>
            <div>
              {this.props.fixture.CeStateResponse.Competition}
            </div>
          </div>
        </td>
        <td>{this.renderExtraTimeEditThing()}</td>
        <td>{this.renderPenaltiesEditThing()}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }

}));
