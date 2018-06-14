const Player = require("../player.js");
const Room   = require("../room.js");
const Game   = require("../game.js");
const LOG    = console.log;


var float = new Player("float");
var main = new Player("main");
var int = new Player("int");

var room = new Room();

room.add(float);
room.add(main);
room.add(int);

room.setHost(float);

var game = new Game(room);

LOG(game.status());


