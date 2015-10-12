import React from "react";
import Radium from "radium";

export default Radium(React.createClass({
	displayName: "ExtraTimeEditor",
	
	propTypes: {
		Display: React.PropTypes.string,
		Condition: React.PropTypes.number,
		HomeExtraTime: React.PropTypes.number,
		AwayExtraTime: React.PropTypes.number,
		editMode: React.PropTypes.bool
	},

	getDefaultProps(){
		return {
			Display: "None",
			Condition: 4,
			HomeExtraTime: 0,
			AwayExtraTime: 0
		}
	},

	componentWillMount(){
		this.setState({
			Condition: this.props.Condition,
			HomeExtraTime: this.props.HomeExtraTime,
			AwayExtraTime: this.props.AwayExtraTime
		});
	},

	onConditionChanged(event){
		this.setState({
			Condition: event.target.value,
			HomeExtraTime: this.state.HomeExtraTime,
			AwayExtraTime: this.state.AwayExtraTime
		});
	},
	onHomeExtraTimeChanged(event){
		this.setState({
			Condition: this.state.Condition,
			HomeExtraTime: event.target.value,
			AwayExtraTime: this.state.AwayExtraTime
		});
	},
	onAwayExtraTimeChanged(event){
		this.setState({
			Condition: this.state.Condition,
			HomeExtraTime: this.state.HomeExtraTime,
			AwayExtraTime: event.target.value
		});
	},

	render(){

		return this.props.editMode ? (
			<div className="extra-time-editor">
				<select value={this.state.Condition} onChange={this.onConditionChanged}>
					<option value="0">Exact Score</option>
					<option value="1">Home Win</option>
					<option value="2">Away Win</option>
					<option value="3">Draw</option>
					<option value="4">None</option>
				</select>
				<div className="numeric-input">
					<label>Home</label>
					<input type="number" value={this.state.HomeExtraTime} onChange={this.onHomeExtraTimeChanged}></input>
				</div>
				<div className="numeric-input">
					<label>Away</label>
					<input type="number" value={this.state.AwayExtraTime} onChange={this.onAwayExtraTimeChanged}></input>
				</div>
			</div>
		) : (
			<div>{this.props.Display}</div>
		);
	}
}));