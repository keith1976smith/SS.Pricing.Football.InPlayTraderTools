import React from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import Radium from "radium";

export default Radium(React.createClass({
	displayName: "ExtraTimeEditor",
	
	propTypes: {
	    Condition: React.PropTypes.number.isRequired,
	    HomeValue: React.PropTypes.number.isRequired,
	    AwayValue: React.PropTypes.number.isRequired,
	    onChanged: React.PropTypes.func.isRequired,
	    editPenalties: React.PropTypes.bool,
	    isExtraTime: React.PropTypes.bool
  	},

  	getDefaultProps () {
	    return {
	      editPenalties: false,
	      isExtraTime: false
	    };
  	},

	componentWillMount(){
		this.setState({
			Condition: this.props.Condition,
			HomeValue: this.props.HomeValue,
			AwayValue: this.props.AwayValue
		});
	},

	onConditionChanged(event){
		let val = parseInt(event.target.value);
		this.setState({
			Condition: val
		});
		this.props.onChanged("Condition", val);
	},
	onHomeValueChanged(event){
		let val = parseInt(event.target.value);
		this.setState({
			HomeValue: val
		});
		this.props.onChanged("HomeValue", val);

	},
	onAwayValueChanged(event){
		let val = parseInt(event.target.value);
		this.setState({
			AwayValue: val
		});
		this.props.onChanged("AwayValue", val);
	},

	renderOptions(){
		if (this.props.editPenalties && this.props.isExtraTime){
			return [
				<option value="0">Exactly 0-0 in ET</option>,
				<option value="1">Any draw in ET</option>
			];
		}
		else if (this.props.editPenalties){
			return [
				<option value="2">Exact Score</option>,
				<option value="3">Home Win</option>,
				<option value="4">Away Win</option>,
				<option value="5">Draw</option>,
				<option value="6">None</option>
			];
		}
		else {
			return [
				<option value="0">Exact Score</option>,
				<option value="1">Home Win</option>,
				<option value="2">Away Win</option>,
				<option value="3">Draw</option>,
				<option value="4">None</option>
			];
		}

	},

	getHomeValueInputStyle(){
		if (this.props.editPenalties && this.props.isExtraTime){
			return {display: "none"};
		}
		if (this.state.Condition === 0 || this.state.Condition === 1){
			return {display: "block"};
		}
		return {display: "none"};
	},

	getAwayValueInputStyle(){
		if (this.props.editPenalties && this.props.isExtraTime){
			return {display: "none"};
		}
		if (this.state.Condition === 0 || this.state.Condition === 2){
			return {display: "block"};
		}
		return {display: "none"};
	},

	render(){

		return (
			<div className="extra-time-editor">
				<select value={this.state.Condition} onChange={this.onConditionChanged}>
					{this.renderOptions()}
				</select>
				<div className="numeric-input" style={[this.getHomeValueInputStyle()]}>
					<label>Home</label>
					<input type="number" value={this.state.HomeValue} onChange={this.onHomeValueChanged}></input>
				</div>
				<div className="numeric-input" style={[this.getAwayValueInputStyle()]}>
					<label>Away</label>
					<input type="number" value={this.state.AwayValue} onChange={this.onAwayValueChanged}></input>
				</div>
			</div>
		)
	}
}));