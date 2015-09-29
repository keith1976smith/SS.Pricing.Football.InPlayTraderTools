import createStoreClass from "./create-store-class";

const defaults = {
  definition: "",
  description: "",
  competition: "",
  sortByField: "date",
  sortAscending: true
};

export default createStoreClass({

  defaultValue: defaults,

  eventHandlers: {
    filter: {
      setDefinition (current, definition) {
        return current.merge({definition});
      },

      setDescription (current, description) {
        return current.merge({description});
      },

      setCompetition (current, competition) {
        return current.merge({competition});
      },

      clear () {
        return defaults;
      },

      setSortByField (current, sortByField) {
        return current.merge({sortByField});
      },

      setSortAscending (current, sortAscending) {
        return current.merge({sortAscending});
      },
    }
  }
});
