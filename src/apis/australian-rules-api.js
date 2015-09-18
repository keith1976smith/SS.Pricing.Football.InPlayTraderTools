/*jshint node:true, browser:true, newcap:false, unused:vars, esnext: true*/
"use strict";

var $ = require("jquery");
var url = require("url");
var linkProp = "_links";
var rootUrl = global.config? global.config.aussieRulesApiUrl : "WarningNoConfigLoadedThisISNotAURL";
var _ = require("lodash");
var cookies = require("cookies-js");
var rels = require("../constants/link-relations").aussie;
var Q = require("kew");

// general purpose ajax helper
function ajax (opts) {
    // add in authentication if available
    if (! ("headers" in opts)) { opts.headers = {}; }
    opts.headers["X-Auth-Token"] = cookies.get("X-Auth-Token");
    // manual cache busting, because corporate IT networks can't be trusted with
    // nice HTTP headers
    opts.cache = false;
    // return a failed promise if there's no URL
    if (! opts.url) { return Q.reject("No URL given"); }
    // we can't return jQuery's XHR wrapper even though it looks like a promise
    // because it's fundamentally broken - basically, .then() should return a 
    // new promise, but jQ's .then returns the same one over and over
    var d = Q.defer();
    
    $.ajax(opts).then(function (data) {
        // massage the data a bit before continuing
        if (data) {
            // always trap the url for later use
            data._url = opts.url;
            // and go into all the _embededs and trap their urls too
            if (data._embedded) {
                _.each(data._embedded, embed => {
                    if (! _.isArray(embed)) embed = [embed];
                    _.each(embed, e => { e._url = url.resolve(opts.url, e._links.self.href); });
                });
            }            
        }
        // pass the massaged payload onto whatever asked for it
        d.resolve(data);
    },         
    function (jqXhr, testStatus, errorThrown) {
        d.reject(jqXhr);
    });

    return d.promise;
}

function wait (delay) {
    var d = Q.defer();
    setTimeout(()=>d.resolve(), delay);
    return d.promise;
}

function retryAjax (opts, count) {
    if (typeof count === "undefined") count = 1;

    return ajax(opts).then(null, 
        function (reason) {
            if (count >= global.config.xhrMaxRetries) {
                console.error("maxRetries exceeded", opts, reason);
                throw reason;
            }
            else if (reason.status < 500 && reason.status !== 0) {
                console.error("not retrying xhr status " + reason.status, opts, reason);
                throw reason;   
            }
            else {
                //return retryAjax(opts, count+1);
                return wait(count * global.config.xhrRetryDelayIncrement).then(
                    () => {
                        console.warn("retrying", opts, reason);
                        return retryAjax(opts, count+1);
                    }
                );
            }
        }
    );
}

// helper for doing GETs
function get (url) {
    return retryAjax({
        type: "GET",
        url: url
    });
}

// helper for doing DELETEs
function baleet (url) {
    return retryAjax({
        type: "DELETE",
        url: url
    });
}

// helper for PUTting a resource back where it came from
function put (resource) {
    return retryAjax({
        type: "PUT",
        url: navigate(resource, "self"),
        data: JSON.stringify(resource),
        contentType: "application/json"
    });
}

// helper for doing POSTS.
// if given data and url, POSTs data to url
// if just given url, do an empty POST to it
// if just given data, attempts to treat it as a resource and POST it back
function post (data, url) {
    if (typeof url === "undefined") {
        if (_.isString(data)) {
            url = data;
            data = null;
        }
        else if (data._url) {
            url = navigate(data, "self");
        }
    }
    return retryAjax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json"
    });
}

// given a resource and a link relation, get the full url for that link
function navigate (obj, linkRel) {
    return url.resolve(obj._url, obj[linkProp][linkRel].href);
}


////////////////////////////////////////////////////////////////////////////////
// actual API
module.exports = {

    ////////////////////////////////////////////////////////////////////////////
    // fixture
    loadFixtureById: function (fixtureId) {
        return get(rootUrl).then(function (rootRes) {
            var fixtureUrl = url.resolve(rootUrl, 
                rootRes[linkProp][rels.fixture].href.replace('{id}', fixtureId)
            );
            return get(fixtureUrl);
        });        
    },
    reloadFixture: fixture => get(fixture._url),
};

