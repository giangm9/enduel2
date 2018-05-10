const fs = require("fs");
var GenName = {
  names : []
};


GenName.init = function(path){
  fs.readFile(path, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    RandomName.names = data.split("\n");
  }); 
}

GenName.gen = function(){
  var names = RandomName.names;
  return names[Math.floor(Math.random()*names.length)];
}

module.exports = GenName;
