const Player = require("../player.js");
const Room   = require("../room.js");
const Game   = require("../game.js");

const LOG    = console.log;


function TestLogic(Dict){
  var float = new Player("float");
  var main = new Player("main");
  var int = new Player("int");

  var int64 = new Player("int64");
  var npm = new Player("npm");
  var ssh = new Player("ssh");


  var room = new Room();
  room.Add(float);
  room.Add(main);
  room.Add(int);
  var game = new Game(room);
  game.log = 'all';
  LOG("NEXT LOG MUST SHOW ERROR");
  game.letter = 'c';
  game.Put("moon");
  var linux = new Room();
  game.Put("cat");
  game.Put("tooooo");
  game.Tick(30);
  game.Put("toon");
  game.Tick("101");
  game.Put("noon");
  linux.Add(int64);
  game.Put("new");
  game.Put("world");
  game.Put("doez");
  linux.Add(npm);
  game.Put("day");
  game.Skip();
  game.Put("yes");
  main.LeaveGame();
  game.Put("sun");
  linux.Add(ssh);
  var linuxGame = new Game(linux);
  linuxGame.Tick(301);
  float.LeaveGame();

}

module.exports = TestLogic;
