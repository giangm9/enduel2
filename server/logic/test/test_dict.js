const LOG = console.log; 
const ERR = console.error;
import { readFile } from "fs";


var _dict = null;

function DictTest(Dict){
  _dict = Dict;
  readFile("./test/test_words.txt", "utf-8", function(err, contents){
    if (err){
      throw err;
    }
    contents.split("\n")
      .forEach( 
        word => { if (word.trim() != "") assertWord(word.trim())  }
      );
  });
}

function assertWord(word){
  assert(_dict.Exist(word), word + " PASS", word + " FAIL");
}

function assert(value, pass, fail){
  if (value) 
    LOG(pass) 
  else {
    ERR(fail);
  }
}


export default DictTest;
