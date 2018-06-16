const fs = require("fs");

var Dict = () => { throw "Dict is a static class" };

var all = new Set();

Dict.Init = function( path , onFinish) {
  fs.readFile(path, "utf-8", function(err, contents){
    if (err){
      throw err;
    }
    contents.split("\n")
      .forEach( 
        word =>  all.add(word.trim())
      );

    console.log("Quantity : " + all.size);
    onFinish();
  });
}


Dict.Exist = function(word){
  return all.has(word.trim());
}

module.exports = Dict;
