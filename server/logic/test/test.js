const Dict   = require("../dict.js");


Dict.Init("./test/full_word.txt", test);



function test() {
  require("./test_event")(Dict);
//  require("./test_logic")(Dict);
}


