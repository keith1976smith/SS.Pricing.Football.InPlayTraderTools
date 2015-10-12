import request from "superagent";
import {EventEmitter} from "events";
import pricingApi from "@sportingsolutions/pricing-api";
import apiPaths from "./api-paths";
import {map} from "lodash";
import preprocess from "./pre-processing";

// ?FromDate=2015/10/02&ToDate=2015/10/03&Trader=alltraders&TradingState=31 Basketball
// ?fromDate=2015/10/02%2007:17%20AM&toDate=2015/10/03%2005:59%20AM Football
const prototype = {

  __proto__: EventEmitter.prototype,

  getUsers(){
  	return new Promise((resolve, reject) => {
  		let data = require("../../test/test-data/get-users");
  		if (data) {
  			resolve(data);
  		}
  		else{
  			reject(new Error("Failed to load test data."));
  		}
  	}).then((data) => {
  		return map(data, (item) => item.Content);
  	});
  	// return this._request('GET', this.userManagementUrl, null).then(({body}) => {
  	// 	return map(body, (item) => item.Content);
  	// });
  },

  getAllFixtures (){
  	return new Promise((resolve, reject) => {
  		let data = require("../../test/test-data/get-fixtures");
  		if (data) {
  			resolve(data);
  		}
  		else {
  			reject(new Error("Failed to load test data."));
  		}
  	}).then((data)=> {
      return preprocess(data);
    });
  	// return this._request('GET', this.baseUrl + apiPaths.fixturesPath + "?fromDate=2015/10/02%2007:17%20AM&toDate=2015/10/03%2005:59%20AM", null).then(({body})  => {
  	// 	return body;	
  	// })
  },

  // attempt a request, and retry login in the event of a 401
  _requestWithRetry(...args) {
    return this._request(...args).then(null, (err) => {
      if (err.response.status === 401) {
        console.info("Pricing API returned 401; will attempt to log in again")
        return pricingApi.login().then(
          loginResult => {
            // it worked, so let's try and do the original request again
            this.emit("autologin", loginResult)
            return this._request(...args)
          },
          err2 => {
            // nope, still failing
            throw new Error("401 during request, and then login failed with: " + err2.message);
          }
        );
      }
      else {
        // anything other than a 401, we just throw straight back out
        throw err;
      }
    });
  },

  _request(method, url, data=null, headers={}) {
    return new Promise((resolve, reject) => {
      let rq = request(method.toUpperCase(), url).set("X-Auth-Token", this.authToken);
      for (let header in headers) {
        rq = rq.set(header, headers[header]);
      }
      if (data) {
        rq = rq.send(data);
      }
      rq.end((err, response) => {

        //response.body = fixApiResponse(response.body);

        if (err) {
          const exception = new Error(err);
          exception.response = response;
          reject(exception);
        }
        else {
          resolve(response);
        }
      })
    });
  }
};




export default function RbFootballApi (baseUrl, userManagementUrl, authToken=null) {
  let obj = {
    __proto__: prototype,
    baseUrl,
    authToken,
    userManagementUrl
  };
  EventEmitter.call(obj);
  return obj;
}