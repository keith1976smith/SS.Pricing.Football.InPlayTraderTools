import Rx from "rx";
import {mapValues, chain} from "lodash";

const mapToEventStreams = categories =>
  mapValues(categories, (subjects) =>
    chain(subjects).map(subject => [subject, new Rx.Subject()]).zipObject().value())

//
// define all the events in our app here
//
export default () => mapToEventStreams({
  fixtures: [
    "loaded",
    "loadingStarted",
    "loadingFinished",
    "cleared",
    "setupExtraTime",
    "setupPenalties",
    "configure"
  ],
  account: [
    "loggedIn",
    "loggedOut",
  ],
  filter: [
    "setDescription",
    "setDefinition",
    "setCompetition",
    "clear",
    "setSortByField",
    "setSortAscending",
  ],
  users: [
    "gotUsers"
  ]
})
