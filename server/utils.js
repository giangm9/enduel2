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

/**
 * Return true if the element need to be removed
 * @callback RemoveCallback
 * @param {any} element
 * @returns {boolean}
 */

/**
 * Remove the all elements in satisfy callback 
 * @param {RemoveCallback} callback 
 */
Array.prototype.remove = function( callback ) {
  for (var i = 0 ; i < this.length; ++i ) {
    if (callback(this[i])) {
      this.splice( i, 1 );
      i--;
    }
  }
}

module.exports = {
  LOG : LOG
}
