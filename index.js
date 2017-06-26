const util = require('util');

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

const key = process.argv[2];

const maps = require('@google/maps').createClient({key});

maps.distanceMatrix({
  origins: ['Hornsby Station, NSW', 'Chatswood Station, NSW'],
  destinations: ['Central Station, NSW', 'Parramatta Station, NSW'],
}, (error, response) => {
  error
    ? console.log({error})
    : handleResponse(response);
});

function handleResponse(response) {
  log(response);
}

function log(obj) {
  console.log(util.inspect(obj, {showHidden: false, depth: null}));
}

