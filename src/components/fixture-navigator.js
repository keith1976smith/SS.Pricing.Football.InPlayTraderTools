import React from "react";
import Radium from "radium";
import ImmutablePropTypes from "react-immutable-proptypes";
import ColumnHeader from "./column-header";
import MatchStatusIndicator from "./match-status-indicator";
import TradeStatusIndicator from "./trade-status-indicator";
//import _ from "lodash";
import generateSilverLightLink from "../lib/generate-silverlight-link";

const topBarStyles = {
  height: "4em",
  padding: "1em"
};

const tableAreaStyles = {
  padding: "1em",
  position: "absolute",
  top: "4em",
  bottom: 0,
  left: 0,
  right: 0,
  fontSize: "0.9em"
};

const cellStyle = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden"
};

function formatDate (isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleString("en-GB", {year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit"});
  //return `${date.toLocaleString()} ${date.getHours()}:${date.getMinutes()}`;
}


export default Radium(React.createClass({
  displayName: "FixtureNavigator",
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    loggedInUsername: React.PropTypes.string.isRequired,
    fixtures: ImmutablePropTypes.list,
    filter: ImmutablePropTypes.map,
    styles: React.PropTypes.object.isRequired,
    refresh: React.PropTypes.func.isRequired,
    clearFilter: React.PropTypes.func.isRequired,
    setDefinitionFilter: React.PropTypes.func.isRequired,
    setCompetitionFilter: React.PropTypes.func.isRequired,
    setDescriptionFilter: React.PropTypes.func.isRequired,
    setSortAscending: React.PropTypes.func.isRequired,
    setSortByField: React.PropTypes.func.isRequired,
  },
  componentWillMount () {
    this.props.refresh();
  },

  onChangeDefinition (event) {
    this.props.setDefinitionFilter(event.target.value);
  },

  onChangeDescription (event) {
    this.props.setDescriptionFilter(event.target.value);
  },

  onChangeCompetition (event) {
    this.props.setCompetitionFilter(event.target.value);
  },

  setSort (byField) {
    if (this.props.filter.get("sortByField") === byField) {
      console.log("toggle")
      this.props.setSortAscending(! this.props.filter.get("sortAscending"))
    }
    else {
      console.log("set to" + byField)
      this.props.setSortByField(byField);
    }
  },

  renderDefinitions () {
    return this.props.fixtures.map(f => f.definitionName).toOrderedSet().sort().map(defName =>
      <option key={defName}>{defName}</option>
    ).toArray();
  },

  renderFixtures () {
    const filterDefinition = this.props.filter.get("definition");
    const filterDescription = this.props.filter.get("description");
    const filterCompetition = this.props.filter.get("competition");
    const sortByField = this.props.filter.get("sortByField");
    const sortDescending = ! this.props.filter.get("sortAscending");
    let fixtures = this.props.fixtures.filter(fixture =>{
      return ((!filterDefinition) || fixture.definitionName === filterDefinition) &&
        ((!filterDescription) || fixture.description.toLowerCase().indexOf(filterDescription.toLowerCase()) !== -1) &&
        ((!filterCompetition) || fixture.competition.toLowerCase().indexOf(filterCompetition.toLowerCase()) !== -1)
    });
    if (sortByField) {
      fixtures = fixtures.sortBy(f => f[sortByField])
      if (sortDescending) {
        fixtures = fixtures.reverse()
      }
    }
    return fixtures.map(fixture => <tr key={fixture.id}>
      <td style={cellStyle}><MatchStatusIndicator matchStatusName={fixture.matchStatusName} /></td>
      <td style={cellStyle}>{formatDate(fixture.date)}</td>
      <td style={cellStyle}>{fixture.description}</td>
      <td style={cellStyle}>{fixture.competition}</td>
      <td style={cellStyle}>{fixture.definitionName}</td>
      <td style={cellStyle}><TradeStatusIndicator tradedByUsername={fixture.traderId} loggedInUsername={this.props.loggedInUsername} /></td>
      <td style={[cellStyle, {textAlign: "right"}]}>
        <a className="btn btn-primary btn-sm" href={generateSilverLightLink(fixture)}>Trade Now</a> &nbsp;
        {/* <button className="btn btn-info btn-sm">Add</button> */}
      </td>
    </tr>);
  },

  render () {
    const styles = this.props.styles;
    return <div>
      <div className="form-inline" style={[topBarStyles, {backgroundColor: styles.colors.areaBackgroundAlt}]}>
        <select
            className="form-control input-sm"
            style={{padding: "0", width: "12em"}}
            placeholder="Definition"
            value={this.props.filter.get("definition")}
            onChange={this.onChangeDefinition}>
          <option value="">Definition</option>
          {this.renderDefinitions()}
        </select>
        &nbsp;
        <input
            className="form-control input-sm"
            placeholder="Description"
            value={this.props.filter.get("description")}
            onChange={this.onChangeDescription}/>
        &nbsp;
        <input
            className="form-control input-sm"
            placeholder="Competition"
            value={this.props.filter.get("competition")}
            onChange={this.onChangeCompetition}/>
        &nbsp;
        <button className="btn btn-inverse btn-sm" onClick={this.props.clearFilter}>Reset</button>
        &nbsp;
        <button className="btn btn-default btn-sm" onClick={this.props.refresh}>Refresh</button>
      </div>
      <div style={[tableAreaStyles]}>
        <table className="table table-hover"style={{"tableLayout": "fixed"}}>
          <colgroup>
            <col style={{width: "6em"}} />  {/* State */}
            <col style={{width: "12em"}} /> {/* Date */}
            <col style={{width: "auto"}} /> {/* Description */}
            <col style={{width: "16em"}} /> {/* Competition */}
            <col style={{width: "12em"}} /> {/* Definition */}
            <col style={{width: "16em"}} /> {/* Trade status */}
            <col style={{width: "10em"}} /> {/* Actions */}
          </colgroup>
          <thead>
            <tr>
              <ColumnHeader
                  label="State"
                  keyField="matchStatusName"
                  currentSortByField={this.props.filter.get("sortByField")}
                  sortAscending={this.props.filter.get("sortAscending")}
                  setSortAscending={this.props.setSortAscending}
                  setSortByField={this.props.setSortByField}
                  />
              <ColumnHeader
                  label="Date/Time"
                  keyField="date"
                  currentSortByField={this.props.filter.get("sortByField")}
                  sortAscending={this.props.filter.get("sortAscending")}
                  setSortAscending={this.props.setSortAscending}
                  setSortByField={this.props.setSortByField}
                  />
              <ColumnHeader
                  label="Description"
                  keyField="description"
                  currentSortByField={this.props.filter.get("sortByField")}
                  sortAscending={this.props.filter.get("sortAscending")}
                  setSortAscending={this.props.setSortAscending}
                  setSortByField={this.props.setSortByField}
                  />
              <ColumnHeader
                  label="Competition"
                  keyField="competition"
                  currentSortByField={this.props.filter.get("sortByField")}
                  sortAscending={this.props.filter.get("sortAscending")}
                  setSortAscending={this.props.setSortAscending}
                  setSortByField={this.props.setSortByField}
                  />
              <ColumnHeader
                  label="Definition"
                  keyField="definitionName"
                  currentSortByField={this.props.filter.get("sortByField")}
                  sortAscending={this.props.filter.get("sortAscending")}
                  setSortAscending={this.props.setSortAscending}
                  setSortByField={this.props.setSortByField}
                  />
              <ColumnHeader
                  label="Trade status"
                  keyField="traderId"
                  currentSortByField={this.props.filter.get("sortByField")}
                  sortAscending={this.props.filter.get("sortAscending")}
                  setSortAscending={this.props.setSortAscending}
                  setSortByField={this.props.setSortByField}
                  />
              <th></th>
            </tr>
          </thead>
          <tbody>
            { this.renderFixtures() }
          </tbody>
        </table>
      </div>
    </div>;
  }
}));
