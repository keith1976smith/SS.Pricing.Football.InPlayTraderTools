
export default (stores, eventStreams) => ({
  setDescription (description) {
    eventStreams.setDescription.onNext(description);
  },

  setDefinition (definition) {
    eventStreams.setDefinition.onNext(definition);
  },

  setCompetition (competition) {
    eventStreams.setCompetition.onNext(competition);
  },

  clear () {
    eventStreams.clear.onNext();
  },

  setSortByField (sortByField) {
    eventStreams.setSortByField.onNext(sortByField);
  },

  setSortAscending (sortAscending) {
    eventStreams.setSortAscending.onNext(sortAscending);
  },
});
