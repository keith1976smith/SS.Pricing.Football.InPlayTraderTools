import createStoreClass from "./create-store-class";
import Immutable from "immutable";
import preprocess from "../rb-football-api/pre-processing";

export default createStoreClass({

  defaultValue: [],

  eventHandlers: {
    fixtures: {
      loaded (current, fixtures)  {
        return Immutable.fromJS(fixtures);
      },
      cleared ()  {
        return Immutable.List([]);
      },
      edit (current, id) {
        return current.map(fixture => 
          (fixture.get("Id") === id) ?
            fixture.set("EDIT_FIXTURE", fixture).set("editing", true) :
            fixture
        )
      },
      cancelEdit (current, id){
        return current.map(fixture => 
          (fixture.get("Id") === id) ?
            fixture.delete("EDIT_FIXTURE").set("editing", false) :
            fixture
        )
      },
      changeExtraTime (current, {id, key, value}){
        return current.map(fixture =>
          (fixture.get("Id") === id) ?
            fixture.setIn(["EDIT_FIXTURE","EventStateResponse","TraderExtraTimeSetup", key], value) :
            fixture
        )
      },
      changePenalties(current, {id, key, value}){
        return current.map(fixture =>
          (fixture.get("Id") === id) ?
            fixture.setIn(["EDIT_FIXTURE","EventStateResponse","TraderPenaltiesSetup", key], value) :
            fixture
        )
      },
      saveFixture(current, id){
        return current.map(fixture =>
          (fixture.get("Id") === id) ?
            Immutable.fromJS(preprocess(fixture.get("EDIT_FIXTURE").toJS())) :
            fixture
        )
      }
    }
  }
});
