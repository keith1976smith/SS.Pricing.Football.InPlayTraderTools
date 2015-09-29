
import Rx from "rx";
import Immutable from "immutable";
import _ from "lodash";
//
// factory function for creating FRP store classes using RxJS & ImmutableJS
//

export default function (definition) {
  const newDefinition = {
    initializeActionSubjects: () => {},
    getInitialValue: () => {return {};},
    ... definition,
  };

  const Store = function (eventStreams) {
    if (! (this instanceof Store)) { return new Store(eventStreams); }

    // initialize
    const subject = this.subject = new Rx.BehaviorSubject(Immutable.fromJS(definition.defaultValue));

    _.forEach(definition.eventHandlers, (subjects, category) => {
      _.forEach(subjects, (handler, eventSubject) => {
        eventStreams[category][eventSubject].subscribe(payload => {
          subject.onNext(handler.call(this, this.subject.getValue(), payload));
        })
      })
    });

    // expose the subscribe method of the transformed observable
    this.subscribe = (...args) => {
      subject.subscribe(...args);
    }
  }

  Store.prototype = {
    ...Store.prototype,
    ...newDefinition,
    // onNextMerge (data) {
    //   return this.subject.onNext(this.subject.getValue().merge(data));
    // },
    // onNext (data) {
    //   return this.subject.onNext(Immutable.fromJS(data));
    // },
    // getValue () {
    //   return this.subject.getValue();
    // }
  };

  return Store;
}
