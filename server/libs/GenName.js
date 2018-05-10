const utils = require("../utils");
const LOG   = utils.LOG;
const fs    = require("fs");
const floor = Math.floor;
const rand  = Math.random;


var names = [];

function Init(path) {
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    names = data.split("\n");
  });
}

function Gen() {
  return names[floor(rand() * names.length)].trim();
}

module.exports = {
  Init: Init,
  Gen: Gen
}

