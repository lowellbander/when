const util = require('util');

const key = process.argv[2];
const origins = process.argv[3];
const destinations = process.argv[4];

const departure_time = new Date().getTime();

const options = {origins, destinations, departure_time};

const maps = require('@google/maps').createClient({key});

maps.distanceMatrix(options, (error, response) => {
  error
    ? console.log({error})
    : handleResponse(response);
});

function handleResponse(response) {
  log(response.json);
}

function log(obj) {
  console.log(util.inspect(obj, {showHidden: false, depth: null}));
}

