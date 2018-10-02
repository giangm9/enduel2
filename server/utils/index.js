const Logger     = require("./Logger");
const dateFormat = require("dateformat");
const floor      = Math.floor;
const rand       = Math.random;


function _getRandom() {
  return this[floor(rand() * this.length)];
}
/**
 * Return a random element from array
 */
Array.prototype.getRandom = _getRandom;

String.prototype.getRandom = _getRandom;

module.exports = {
    Logger : Logger,
    LOG : Logger.LOG,
}
