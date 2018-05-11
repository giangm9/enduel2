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

module.exports = {
  GenUID : GenUniqueID
}