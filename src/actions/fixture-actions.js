import bindAll from "../lib/bind-all";

export default (stores, eventStreams, pricingApi) => bindAll({

  loadedFixtures (fixtures) {
    eventStreams.loaded.onNext(fixtures);
  },

  clearFixtures () {
    eventStreams.cleared.onNext();
  },

  fetch () {
    eventStreams.cleared.onNext();
    pricingApi.getAllFixtures().
      then(function (fixtures) {
        eventStreams.loaded.onNext(fixtures);
      });
  },

  edit(id){
    eventStreams.edit.onNext(id);
  },

  cancelEdit(id){
    eventStreams.cancelEdit.onNext(id);
  },

  saveFixture(id){
    eventStreams.saveFixture.onNext(id);
  },

  changeExtraTime(id, key, value){
    eventStreams.changeExtraTime.onNext({id, key, value});
  },

  changePenalties(id, key, value){
    eventStreams.changePenalties.onNext({id, key, value});
  }

});
