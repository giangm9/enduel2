function genUniqueID ( array , limit = 0xffffff ) {
  for (var id = 0; id < limit; ++id) {
    var found = false;
    for (var i = 0; i < array.length; ++i) {
      if (array[i].id == id) {
        found = true;
        break;
      }
    }

    if (!found){
      return id;
    }
  }
}

function removeFromArray( array, callback) {
  for (var i = 0 ; i < array.length; ++i ) {
    if (callback(array[i])) {
      array.splice( i, 1);
      return;
    }
  }
}

module.exports = {
  genUniqueID     : genUniqueID,
  removeFromArray : removeFromArray
}
