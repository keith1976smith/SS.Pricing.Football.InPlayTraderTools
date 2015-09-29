import React from "react";
import Radium from "radium";

const baseStyles = {
  padding: "0.3em",
  backgroundColor: "#aaa",
  color: "#eee",
  borderRadius: "1em",
  display: "inline-block",
  width: "6em",
  fontSize: "0.8em",
  textAlign: "center",
  lineHeight: 1
};


const statusStrings = {
  setup: "Setup",
  ready: "Ready",
  prematch: "Pre-match",
  inRunning: "In play",
  matchOverUnConfirmed: "Match over",
  matchOverConfirmedResults: "Match over",
  matchOver: "Match over",
  abandoned: "Abandoned",
};


const statusStyles = {
  setup: {
    backgroundColor: "skyblue",
    color: "black"
  },
  ready: {
    backgroundColor: "blue",
  },
  prematch: {
    backgroundColor: "orange"
  },
  inRunning: {
    backgroundColor: "green",
  },
  matchOverUnConfirmed: {
    backgroundColor: "red"
  },
  matchOverConfirmedResults: {
    backgroundColor: "red"
  },
  matchOver: {
    backgroundColor: "red"
  },
  abandoned: {
    backgroundColor: "darkgrey"
  },

};

export default Radium(React.createClass({
  displayName: "MatchStatusIndicator",
  propTypes: {
    matchStatusName: React.PropTypes.string.isRequired
  },
  render () {
    return <span style={[baseStyles, statusStyles[this.props.matchStatusName]]}>
      {statusStrings[this.props.matchStatusName] || this.props.matchStatusName}
    </span>
  }
}));
