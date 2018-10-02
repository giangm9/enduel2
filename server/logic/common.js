function GenUniqueID(array, limit = 0xffffff ){
  for (var id = 1; id < limit; ++id){
    var found = false;
    array.forEach(element => {
      if (element.id == id){
        found = true;
      }
    });
    if (!found) return id
  }
}

Array.prototype.getByID = function( id ) {
  for (var i = 0 ; i < this.length; i++){
    if (this[i].id == id){
      return this[i];
    }
  }
}


Array.prototype.removeByID = function( id ) {
  for (var i = 0; i < this.length; i++) {
    if (this[i].id == id) {
      this.splice(i, 1);
      return;
    }
  }
}


module.exports = {
  GenUID : GenUniqueID
}
