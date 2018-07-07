const Player = require("../player.js");
const Room   = require("../room.js");
const Game   = require("../game.js");

const LOG    = console.log;


function TestEvent(){
  var float = new Player("float");
  var main = new Player("main");
  var int = new Player("int");

  var room = new Room();
  room.Add(float);
  room.Add(main);
  room.Add(int);

  var game = new Game(room);
  game.letter = 'a';
  game.Put("apple");

  game.On("correct",  () => { LOG(this.current.name + " correct") } ); 

}

module.exports = TestEvent;
