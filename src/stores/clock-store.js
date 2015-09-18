/*jshint node:true, browser:true, newcap:false, unused:vars, esnext: true*/

"use strict";
var constants = require("../constants/app-constants");
var ImmutableStore = require("@sportingsolutions/ss-pricing-sharedhtml/stores/immutable-store");
var _ = require("lodash");
//var halHelpers = require("../helpers/hal-helpers");
//var aussieLinkRels = require("../constants/link-relations").aussie;

// look for
// // direction dependent
// comment to identify bits which ae affected if we choose to run the clock counting down in future
var linkProp = "_links";

var defaults = {
    minutes: 0, seconds: 0, quarter: 1, running: false, direction: "up", matchEnded: false, quarterStarted: false, quarterEnded: false
};

class ClockStore extends ImmutableStore {
    constructor (initialState) {
        this._loaded = false;
        initialState = _.defaults(initialState || {}, defaults);
        this.addBeforeChangeListener(this._setQuarterStatus.bind(this));
        super(initialState);
        if (this.data.running) this._start();
    }

    _reset () {
        this.replace(_.defaults({}, defaults));
        this._loaded = false;
    }

    _setQuarterStatus (data) {
        // direction dependent
        data.quarterEnded = data.minutes === global.config.quarterLengthMins && data.seconds === 0;
        data.quarterStarted = data.minutes !== 0 || data.seconds !== 0;

        //data.readyToEnd = halHelpers.hasLink(data, aussieLinkRels.endMatch);
        data.readyToEnd = data.quarterEnded && data.quarter === 4;

        var minSecs = this._getMinSecs(data);
        var maxSecs = global.config.quarterLengthMins*60;
        var actualSecs = (data.minutes*60) + data.seconds;
        data.atMinimum = actualSecs <= minSecs;
        data.atMaximum = actualSecs >= maxSecs;
    }

    update (data) {
        super(data);
    }

    onAction (action) {
        if (action.actionType === constants.GOT_CLOCK_DATA) {
            _.defaults(action.data, defaults);
            this.replace(action.data);
            //this._setIncrement();
            this._loaded = true;
            if (action.data.running) {
                this._start();
            }
            else {
                this._stop();
            } 
        }      
        if (action.actionType === constants.GOT_CLOCK_UPDATE) {
            var update = {};
            update[linkProp] = {$set: action.data[linkProp]};
            this.update(update);
        }      
        if (action.actionType === constants.GOT_CLOCK_TIME) {
            this.update({
                minutes: {$set: action.minutes},
                seconds: {$set: action.seconds}
            });
        }      
        if (action.actionType === constants.GOT_LAST_SCORE_TIME) {
            this.update({
                lastScoreMinutes: {$set: action.lastScoreMinutes},
                lastScoreSeconds: {$set: action.lastScoreSeconds},
                lastScoreQuarter: {$set: action.lastScoreQuarter},
            });
        }      
        else if (action.actionType === constants.START_CLOCK) {
            this._start();
        }      
        else if (action.actionType === constants.STOP_CLOCK) {
            this._stop();
        }      
        else if (action.actionType === constants.NUDGE_CLOCK_SECONDS_UP) {
            this._setTime(this.data.minutes, this.data.seconds + (this.data.direction==="up"? +1 : -1));
        }      
        else if (action.actionType === constants.NUDGE_CLOCK_SECONDS_DOWN) {
            this._setTime(this.data.minutes, this.data.seconds - (this.data.direction==="up"? +1 : -1));
        }      
        else if (action.actionType === constants.NUDGE_CLOCK_MINUTES_UP) {
            this._setTime(this.data.minutes + (this.data.direction==="up"? +1 : -1), this.data.seconds);
        }      
        else if (action.actionType === constants.NUDGE_CLOCK_MINUTES_DOWN) {
            this._setTime(this.data.minutes - (this.data.direction==="up"? +1 : -1), this.data.seconds);
        }
        else if (action.actionType === constants.START_FIXTURE_LOADING) {
            this._reset();
        }
        else if (action.actionType === constants.SET_CLOCK_COUNTING_DOWN) {
            this._setTimeDirection("down");
        }
        else if (action.actionType === constants.SET_CLOCK_COUNTING_UP) {
            this._setTimeDirection("up");
        }
        else if (action.actionType === constants.MOVE_TO_NEXT_QUARTER) {
            this._moveToNextQuarter();
        }
        else if (action.actionType === constants.MOVE_TO_PREVIOUS_QUARTER) {
            this._moveToPreviousQuarter();
        }
    }

    _moveToNextQuarter () {
        this._stop() ;
        this.update({
            quarter: {$set: this.data.quarter + 1},
            // direction dependent
            minutes: {$set: 0},
            seconds: {$set: 0}
        });
    }

    _moveToPreviousQuarter () {
        this._stop() ;
        this.update({
            quarter: {$set: this.data.quarter - 1},
            // direction dependent
            minutes: {$set: global.config.quarterLengthMins},
            seconds: {$set: 0}
        });
    }

    _setTimeDirection (direction) {
        if (this.data.direction === direction) return;
        this.update({
            direction: {$set: direction},
        });
    }

    _start () {
        this.update({running: {$set: true}});
        if (this._tickTimer) clearInterval(this._tickTimer);        
        if (global.config.autoClock) {
            this._tickTimer = setInterval(this._tick.bind(this), 1000);
        }
    }

    _getMinSecs (data) {
        var minSecs = 0;
        if (data && data.lastScoreQuarter && data.lastScoreQuarter === data.quarter) {
            minSecs = (data.lastScoreMinutes * 60) + data.lastScoreSeconds;
        }
        return minSecs;
    }

    _setTime (newMins, newSecs) {
        var totalSecs = (newMins * 60) + newSecs;
        var maxSecs = global.config.quarterLengthMins*60;
        var minSecs = this._getMinSecs(this.data);
        totalSecs = Math.min(totalSecs, maxSecs);
        totalSecs = Math.max(totalSecs, minSecs);
        newMins = Math.floor(totalSecs / 60);
        newSecs = totalSecs % 60;

        this.update({
            minutes: {$set: newMins},
            seconds: {$set: newSecs}
        });
        
        // direction dependent
        if (totalSecs >= (global.config.quarterLengthMins*60) && this.data.running ) {
            this._stop();
        }
    }

    _tick () {
        // direction dependent
        this._setTime(this.data.minutes, this.data.seconds + 1);
    }

    _stop () {
        this.update({running: {$set: false}});
        if (this._tickTimer) clearInterval(this._tickTimer);
    }

    getMinutes () {
        return this.minutes;
    }

    getSeconds () {
        return this.seconds;
    }

    getClock () {
        return this.data;
    }

    getQuarter () {
        return this.data.quarter;
    }

    isLoaded () {
        return this._loaded;
    }

    getDirection () {
        return this.data.direction;
    }

}

module.exports = ClockStore;


