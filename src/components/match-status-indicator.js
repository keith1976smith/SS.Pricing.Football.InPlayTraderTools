import React from "react";

export default React.createClass({
	displayName: "SupervisorUI",
	propTypes: {
		matchStatus: React.PropTypes.number,
		inPlayEventState: React.PropTypes.string
	},
	determineBadgeClass(){
		switch (this.props.matchStatus){
			case 20: // Ready
				return "badge badge-info";
			case 30: // Prematch
				return "badge badge-primary";
			case 40: // In Running
				return "badge badge-success";
			case 45: // Match Over (Unconfirmed)
			case 50: // Match Over
			case 80: // Stopped
			case 90: // Abandoned
				return "badge badge-danger";
			case 99: // Paused
				return "badge badge-warning";
			default:
				return "badge badge-default";
		}
	},
	render(){
		return <span className={this.determineBadgeClass()}>{this.props.inPlayEventState}</span>
	}
});