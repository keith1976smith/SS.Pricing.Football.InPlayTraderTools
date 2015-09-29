import bindAll from "../lib/bind-all";
import {sport} from "../../config";

export default (stores, eventStreams, pricingApi) => bindAll({

  loadedFixtures (fixtures) {
    eventStreams.loaded.onNext(fixtures);
  },

  clearFixtures () {
    eventStreams.cleared.onNext();
  },

  fetch () {
    eventStreams.cleared.onNext();
    return pricingApi.getFixtures(sport).
      then(function (fixtures) {
        eventStreams.loaded.onNext(fixtures);
      });
  }
});
