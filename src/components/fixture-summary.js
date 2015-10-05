import React from "react";
import Radium from "radium";
import ImmutablePropTypes from "react-immutable-proptypes";


export default Radium(React.createClass({
  displayName: "FixtureSummary",
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    fixture: ImmutablePropTypes.list,
    refresh: React.PropTypes.func.isRequired,
    getUsers: React.PropTypes.func.isRequired
  },
  componentWillMount (){
    this.props.getUsers();
    this.props.refresh();
  },
  render () {

    var useritems = this.props.users.map((user)=>{ return <li>{user.Id}</li>; });

    return (
      <div>
        <ul>
          {useritems}
        </ul>
      </div>
    );
  }

}));
