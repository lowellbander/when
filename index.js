// index.js

const {
  plotlyKey,
  plotlyUsername,
  destinations,
  origins,
  key,
  departure_time,
} = getArgs();

const maps = require('@google/maps').createClient({key});
const plotly = require('plotly')(plotlyUsername, plotlyKey);
const util = require('util');

function main() {
  const options = {origins, destinations, departure_time};
  const distanceMatrix = util.promisify(maps.distanceMatrix);

  distanceMatrix(options).then(handleResponse).catch(log);
}

function handleResponse(response) {
  const {json} = response;
  const origin = json.origin_addresses[0];
  const destination = json.destination_addresses[0];
  const duration = getTrafficDurationSec(json);
  log({origin, destination, duration});
}

function getTrafficDurationSec(json) {
  return json.rows[0].elements[0].duration_in_traffic.value;
}

function log(obj) {
  console.log(util.inspect(obj, {showHidden: false, depth: null}));
}

function getArgs() {
  const plotlyKey = process.argv.pop();
  const plotlyUsername = process.argv.pop();
  const destinations = process.argv.pop();
  const origins = process.argv.pop();
  const key = process.argv.pop();
  const departure_time = new Date().getTime();
  return {
    plotlyKey,
    plotlyUsername,
    destinations,
    origins,
    key,
    departure_time,
  };
}

// var data = [
//   {
//     x: ["2013-10-04 22:23:00", "2013-11-04 22:23:00", "2013-12-04 22:23:00"],
//     y: [1, 3, 6],
//     type: 'scatter',
//   }
// ];
// var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
// plotly.plot(data, graphOptions, function (err, msg) {
//     console.log(msg);
// });

main();
