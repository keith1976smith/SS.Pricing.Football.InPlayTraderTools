import React from "react";
import Radium from "radium";

export default Radium(React.createClass({
  displayName: "TradeStatusIndicator",
  propTypes: {
    loggedInUsername: React.PropTypes.string.isRequired,
    tradedByUsername: React.PropTypes.string,
  },
  render () {
    return (this.props.tradedByUsername) ?
      (this.props.tradedByUsername ===  this.props.loggedInUsername) ?
        <span><i className="fa fa-circle" style={{color: "#4d3"}} /> Traded by you</span> :
        <span><i className="fa fa-circle" style={{color: "#f43"}} /> {`Traded by ${this.props.tradedByUsername}`}</span> :
        null;
  }
}));
