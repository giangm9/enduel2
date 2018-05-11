const utils = require("../utils");
const LOG   = utils.LOG;
const fs    = require("fs");

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
  return names.getRandom().trim();
}

module.exports = {
  Init: Init,
  Gen: Gen
}

