"use strict";

import {isEmpty, find} from "lodash";

const re = /(\d+(?:\.\d+)?)([a-z%]*)/i;

function combine (args, reducer, initial) {
  if (isEmpty(args)) { return "0"; }
  const parsedArgs = args.map(s => {
    const result = re.exec(s);
    return (result === null) ? [0, null] : [parseInt(result[1], 10), result[2]];
  });
  const total = parsedArgs.reduce(reducer, initial);
  let unit = find(parsedArgs, ([_, unit]) => !!(unit));
  unit = unit ? unit[1] : "";
  return total.toString() + unit;
}

export function add (...args) {
  return combine(args, (soFar, [val, _]) => soFar + val, 0)
}

export function multiply (...args) {
  return combine(args, (soFar, [val, _]) => soFar * val, 1)
}
