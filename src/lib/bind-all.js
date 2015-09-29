import mapObj from "map-obj";

export default function (obj) {
  return mapObj(obj, (k, v) => [k, v.bind ? v.bind(obj) : v])
}
