const util = require('util');

const plotlyKey = process.argv.pop();
const plotlyUsername = process.argv.pop();
const destinations = process.argv.pop();
const origins = process.argv.pop();
const key = process.argv.pop();
const departure_time = new Date().getTime();

//console.log({key, origins, destinations, plotlyUsername, plotlyKey, departure_time});

const plotly = require('plotly')(plotlyUsername, plotlyKey);
const maps = require('@google/maps').createClient({key});

const options = {origins, destinations, departure_time};

maps.distanceMatrix(options, (error, response) => {
  error
    ? console.log({error})
    : handleResponse(response);
});

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

