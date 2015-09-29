import React from "react";
import Radium from "radium";


export default Radium(React.createClass({
  displayName: "ColumnHeader",
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    label: React.PropTypes.string.isRequired,
    keyField: React.PropTypes.string.isRequired,
    currentSortByField: React.PropTypes.string.isRequired,
    sortAscending: React.PropTypes.bool.isRequired,
    setSortAscending: React.PropTypes.func.isRequired,
    setSortByField: React.PropTypes.func.isRequired,
  },
  setSort () {
    if (this.props.currentSortByField === this.props.keyField) {
      this.props.setSortAscending(! this.props.sortAscending)
    }
    else {
      this.props.setSortByField(this.props.keyField)
    }
  },

  renderArrow () {
    if (this.props.keyField === this.props.currentSortByField) {
      return this.props.sortAscending?
        <i className="fa fa-chevron-down" /> : <i className="fa fa-chevron-up" />;
    }
    else {
      return null;
    }
  },

  render () {
    return <th onClick={this.setSort} style={{cursor: "pointer", userSelect: "none"}}>
      {this.props.label}
      {this.renderArrow()}
    </th>
  }
}));
