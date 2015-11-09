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
    fixture: ImmutablePropTypes.map,
    edit: React.PropTypes.func.isRequired,
    cancelEdit: React.PropTypes.func.isRequired,
    changeExtraTime: React.PropTypes.func.isRequired,
    saveFixture: React.PropTypes.func.isRequired
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
    if (this.props.fixture.getIn(["CeStateResponse","IsExtraTime"])) 
      return <span style={[{padding: "1px", margin: "1px"}]} className="label label-success" title="This fixture may go into extra time">ET</span>;
  },

  renderPenaltiesLabel(){
    if (this.props.fixture.getIn(["CeStateResponse","IsPenalties"])) 
      return <span style={[{padding: "1px", margin: "1px"}]} className="label label-primary" title="This fixture may go into penalties">P</span>;
  },

  renderExtraTimeEditThing(){
    let canSetExtraTime = this.props.fixture.getIn(["CeStateResponse","IsExtraTime"]) && !(this.props.fixture.getIn(["EventStateResponse", "MatchStatus"]) === 50 || 
      (this.props.fixture.getIn(["EventStateResponse", "MatchStatus"]) === 40 && typeof this.props.fixture.getIn(["EventStateResponse","TraderExtraTimeSetup"]) != 'object'));
    if (canSetExtraTime) return (
      this.props.fixture.get("editing") ? 
      <ExtraTimeEditor 
        Condition={this.props.fixture.getIn(["EventStateResponse","TraderExtraTimeSetup","Condition"])} 
        HomeValue={this.props.fixture.getIn(["EventStateResponse","TraderExtraTimeSetup","HomeExtraTime"])} 
        AwayValue={this.props.fixture.getIn(["EventStateResponse","TraderExtraTimeSetup","AwayExtraTime"])} 
        onChanged={this.extraTimeSetupChangedHandler}/> :
      <span>{this.props.fixture.get("ExtraTimeString")}</span>
    )
  },
  
  renderPenaltiesEditThing(){
    let canSetPenalties = this.props.fixture.getIn(["CeStateResponse","IsPenalties"]) && !(this.props.fixture.getIn(["EventStateResponse", "MatchStatus"]) === 50 || 
      (this.props.fixture.getIn(["EventStateResponse", "MatchStatus"]) === 40 && typeof this.props.fixture.getIn(["EventStateResponse","TraderPenaltiesSetup"]) != 'object'));
    if (canSetPenalties) return (
      this.props.fixture.get("editing") ? 
      <ExtraTimeEditor 
        Condition={this.props.fixture.getIn(["EventStateResponse","TraderPenaltiesSetup","Condition"])} 
        HomeValue={this.props.fixture.getIn(["EventStateResponse","TraderPenaltiesSetup","HomePenalties"])} 
        AwayValue={this.props.fixture.getIn(["EventStateResponse","TraderPenaltiesSetup","AwayPenalties"])} 
        onChanged={this.penaltiesSetupChangedHandler}
        editPenalties={true}
        isExtraTime={this.props.fixture.getIn(["CeStateResponse","IsExtraTime"])} /> :
      <span>{this.props.fixture.get("PenaltiesString")}</span>
    )
  },

  renderEditButtons(){
    if (this.props.fixture.get("editing")){
      return (
        <div>
          <button style={[{padding: "2px", margin: "1px"}]} className="btn btn-success btn-xs" onClick={()=>this.props.saveFixture(this.props.fixture.get("Id"))}>Save</button>
          <button style={[{padding: "2px", margin: "1px"}]} className="btn btn-danger btn-xs" onClick={()=>this.props.cancelEdit(this.props.fixture.get("Id"))}>Cancel</button>
        </div>
      );
    }
    else{
      return <button style={[{padding: "2px", margin: "1px"}]} className="btn btn-primary btn-xs" onClick={()=>this.props.edit(this.props.fixture.get("Id"))}>Edit</button>
    }
  },

  extraTimeSetupChangedHandler(key, value){
    let actualKey = key === "HomeValue" ? "HomeExtraTime" : (key === "AwayValue" ? "AwayExtraTime" : key);
    this.props.changeExtraTime(this.props.fixture.get("Id"), actualKey, value);
  },

  penaltiesSetupChangedHandler(key, value){
    let actualKey = key === "HomeValue" ? "HomePenalties" : (key === "AwayValue" ? "AwayPenalties" : key);
    this.props.changePenalties(this.props.fixture.get("Id"), actualKey, value);
  },

  saveFixture(){

  },

  render () {
    return (
      <tr className="fixture-summary-row">
        <td>
          <div>
            <div>
              <span>{this.formatFixtureDate(this.props.fixture.getIn(["CeStateResponse","Date"]))} </span>
              <StatusIndicator matchStatus={this.props.fixture.getIn(["EventStateResponse", "MatchStatus"])} inPlayEventState={this.props.fixture.getIn(["EventStateResponse","InPlayEventState"])}/>
              <div style={[{float: "right"}]}>
                {this.renderEditButtons()} 
              </div>
            </div>
            <div>
              <strong>{this.props.fixture.getIn(["CeStateResponse", "HomeTeam"])} v {this.props.fixture.getIn(["CeStateResponse", "AwayTeam"])}</strong>
              <div style={[{display: "inline-block", marginLeft: "5px"}]}>
                {this.renderExtraTimeLabel()}
                {this.renderPenaltiesLabel()}
              </div>
            </div>
            <div>
              {this.props.fixture.getIn(["CeStateResponse", "Competition"])}
            </div>
          </div>
        </td>
        <td>{this.renderExtraTimeEditThing()}</td>
        <td>{this.renderPenaltiesEditThing()}</td>
        <td style={[{textAlign: "center"}]}>0.00</td>
        <td style={[{textAlign: "center"}]}>0.00</td>
        <td style={[{textAlign: "center"}]}>0.00</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }

}));
