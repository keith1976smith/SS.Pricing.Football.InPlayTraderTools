import createStoreClass from "./create-store-class";
import Immutable from "immutable";

export default createStoreClass({

  defaultValue: [],

  eventHandlers: {
    fixtures: {
      loaded (current, fixtures)  {
        return Immutable.List(fixtures);
      },
      cleared ()  {
        return Immutable.List([]);
      }
    }
  }
});
