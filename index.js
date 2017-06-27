// index.js

const {
  plotlyKey,
  plotlyUsername,
  destinations,
  origins,
  googleMapsKey,
  departure_time,
} = getArgs();

const dateFormat = require('dateformat');
const maps = require('@google/maps').createClient({key: googleMapsKey});
const plotly = require('plotly')(plotlyUsername, plotlyKey);
const util = require('util');
const distanceMatrix = util.promisify(maps.distanceMatrix);

const SEC_PER_MIN = 60;
const MS_PER_SEC = 1000;

let times;

function main() {
  const departure_time = getTomorrowMidnight().getTime();
  const intervalLength = 15 * SEC_PER_MIN * MS_PER_SEC;
  times = getRange(departure_time, intervalLength, 96);

  const queries = times.map(departure_time =>
    distanceMatrix({origins, destinations, departure_time}),
  );
  Promise.all(queries).then(processResponses);
}

function processResponses(responses) {
  const durations = responses.map(_ => getTrafficDurationSec(_.json));
  const dataPoints = times.map((time, index) => {
    return {
      timestamp: dateFormat(new Date(time), 'h:MM:ss TT'),
      duration: durations[index] / SEC_PER_MIN,
    };
  });
  const {x, y} = dataPointsToXY(dataPoints);
  makePlot(x, y)  ;
}

function dataPointsToXY(dataPoints) {
  const x = [];
  const y = [];
  dataPoints.forEach(point => {
    x.push(point.timestamp);
    y.push(point.duration);
  });
  return {x, y};
}

function getRange(startTime, intervalLength, nIntervals) {
  const range = [];
  while (nIntervals > 0) {
    range.push(startTime += intervalLength);
    --nIntervals;
  }
  return range;
}

function getTomorrowMidnight() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
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
  const googleMapsKey = process.argv.pop();
  return {
    plotlyKey,
    plotlyUsername,
    destinations,
    origins,
    googleMapsKey,
  };
}

function makePlot(x, y)  {
  var data = [{x, y, type: 'scatter'}];
  const options = {filename: "date-axes", fileopt: "overwrite"};
  plotly.plot(data, options, (err, msg) => {
    err
      ? log({err})
      : log({msg});
  });
}

main();
