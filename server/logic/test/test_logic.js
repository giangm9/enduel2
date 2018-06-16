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

  room.add(float);
  room.add(main);
  room.add(int);

  room.setHost(float);

  var game = new Game(room);
  game.log = 'all';
  LOG("NEXT LOG MUST SHOW ERROR");
  game.letter = 'c';
  game.put("moon");
  game.put("cat");
  game.put("tooooo");
  game.tick(30);
  game.put("toon");
  game.tick("101");
  game.put("noon");

  game.put("new");
  game.put("world");

  game.put("doez");
  game.put("day");
  game.put("yes");
  main.leaveGame();
  float.leaveGame();
  game.put("sun");

  var linux = new Room();
  linux.add(int64);
  linux.add(npm);
  linux.add(ssh);
  linux.setHost(npm);
  var linuxGame = new Game(linux);
  linuxGame.tick(301);

}

module.exports = TestLogic;
