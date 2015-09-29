import _ from "lodash";
import config from "../../config";

const totalJunk = {
    "ViewKey": "MrPSt5IfuFh24uWhwyEYgjUHN0Y=",  // ffs what is this
    "Metadata": {
        "CeId": "yuy56oKLYgzHB9L_7kc20Ccx9DE",
        "CeLink": "http://connectappint.sportingsolutions.com/pricingapi/sports/FootballOdds/fixtures/yuy56oKLYgzHB9L_7kc20Ccx9DE", /// i don't even
        "MatchStatus": 10, // it what
        "Sport": "Football",
        "DiscardTradingSessionLink": {
            "Relation": "http://c2e.sportingingsolutions.com/rels/v006/ce/tradingsession/dicard",
            "Href": "http://connectappint.sportingsolutions.com/pricingapi/tradingsessions/yuy56oKLYgzHB9L_7kc20Ccx9DE"
        },
        "SubTitle": "Belgrano de Cordoba v Atletico Rafaela",
        "Description": "New Definition 15-Sep-2015 16:12:38",  // no but why
        "DescriptionVisible": true,
        "CeType": "FootballOdds", // odds
        "FeaturePath": "UI/Manual Trading"  // o help
    },
    "InitializationParameters": ["yuy56oKLYgzHB9L_7kc20Ccx9DE", "http://connectappint.sportingsolutions.com/pricingapi/sports/FootballOdds/fixtures/yuy56oKLYgzHB9L_7kc20Ccx9DE"]
}

const uiStemUrl = config.uiStemUrl; //"http://connectint.sportingsolutions.com/#";
const apiStemUrl = config.apiStemUrl; //"http://connectappint.sportingsolutions.com/pricingapi/sports/FootballOdds/fixtures/";

export default function (fixture) {
  const apiUrl = apiStemUrl + fixture.id;
  const payload = _.cloneDeep(totalJunk);
  payload.Metadata.CeId = fixture.id;
  payload.Metadata.MatchStatus = fixture.id;
  payload.Metadata.CeLink = apiUrl;
  payload.Metadata.SubTitle = fixture.description;
  payload.Metadata.Description = fixture.definitionName;
  payload.InitializationParameters = [fixture.id, apiUrl];
  const json = JSON.stringify(payload);
  const paddedJson = "x" + json;
  const b64 = new Buffer(paddedJson).toString("base64");
  const mangledB64 = `x${b64.slice(0, 7)}x${b64.slice(7, 15)}x${b64.slice(15)}`;
  const combined = uiStemUrl + mangledB64;
  return combined;
}


/*

original string, with character indices:

0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18
n  e  v  e  r  g  o  n  n  a  g  i  v  e  y  o  u  u  p

insert extra characters at indices 0, 8, and 17, sequentially

0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19
x  n  e  v  e  r  g  o  n  n  a  g  i  v  e  y  o  u  u  p
   0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18

0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20
x  n  e  v  e  r  g  o  x  n  n  a  g  i  v  e  y  o  u  u  p
   0  1  2  3  4  5  6     7  8  9  10 11 12 13 14 15 16 17 18

0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21
x  n  e  v  e  r  g  o  x  n  n  a  g  i  v  e  y  x  o  u  u  p
   0  1  2  3  4  5  6     7  8  9  10 11 12 13 14    15 16 17 18

reverse the polarity! remove characters at 0, 7, 15, in order

0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20
n  e  v  e  r  g  o  x  n  n  a  g  i  v  e  y  x  o  u  u  p

0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19
n  e  v  e  r  g  o  n  n  a  g  i  v  e  y  x  o  u  u  p

0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18
n  e  v  e  r  g  o  n  n  a  g  i  v  e  y  o  u  u  p
























*/
