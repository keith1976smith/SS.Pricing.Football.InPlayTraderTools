import createStoreClass from "./create-store-class";
import Immutable from "immutable";

export default createStoreClass({
  defaultValue: [],
  eventHandlers: {
    users: {
      gotUsers (current, users) {
        return Immutable.List(users);
      }
    }
  }
});
