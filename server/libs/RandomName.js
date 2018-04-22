const fs = require("fs");
var RandomName = {
  names : []
};


RandomName.init = function(path){
  fs.readFile(path, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    RandomName.names = data.split("\n");
  }); 
}

RandomName.gen = function(){
  var names = RandomName.names;
  return names[Math.floor(Math.random()*names.length)];
}

module.exports = RandomName;
