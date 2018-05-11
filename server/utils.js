const floor = Math.floor;
const rand  = Math.random;

function LOG( message ) {
  console.log(message);
}

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}

/**
 * Return a random element from array
 */
Array.prototype.getRandom = function() {
  return this[floor(rand() * this.length)];
}

module.exports = {
  LOG: LOG
}
