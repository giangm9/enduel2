const Player       = require("../logic/player.js");
const Room         = require("../logic/room.js");
const Game         = require("../logic/game.js");
const common       = require("./common");
const utils        = require("../utils");

const SocketPlayer = common.GetPlayerFromSocket;
const SocketRoom   = common.GetRoomFromSocket;

var 
  IO;

function IsOnIndex(req, res) {
  return req.cookies && req.cookies.state == "ingame";
}

function HandleIndex(req, res) {
  res.sendFile(common.Dir + "/public/ingame.html");
}

function Init(app, io) {
  IO = io;

  io.of("/ingame").on("connection", (socket) => socket.on("join", socketJoin));
}


function socketJoin() {
  var cookie = common.SocketCookie(this);     
  var player = Player.GetByID(cookie.id);
  var room   = Room.GetByID(cookie.room);

  // In case server restart
  if (!player || !room) return;

  player.socket = this;
  this.join(room.id);
  room.sockets = IO.of('/ingame');

  this
    .on("put"   , socketPut)
    .on("skip"  , socketSkip)
    .on("leave" , socketLeave)
    .on("update", socketUpdate);


  if (!room.game) {
    room.game = new Game(room);
    room.routine = setInterval(room.tick.bind(room), 1000);
    room.game
      .On("end"       , gameEnd.bind(room))
      .On("used"      , (word) => room.emit("used"      , {name : room.game.current.name , word: word}))
      .On("incorrect" , (word) => room.emit("incorrect" , {name : room.game.current.name , word: word}))
      .On("correct"   , (word) => room.emit("correct"   , {name : room.game.current.name , word: word}))
      .On("die"       , (name) => room.emit("die"       , room.game.current.name));
  }
    
  player.game = room.game;

}

function gameEnd(){
  clearInterval(this.routine); 
  this.emit('end');
  this.Dismiss();
}


function socketUpdate(){
  var player = SocketPlayer(this);
  player.emit("update", player.game.Status());
}

function socketLeave() {
  var player = SocketPlayer(this);
  var room   = SocketRoom(this);
  var game   = player.game;

  player.LeaveGame();
  room.emit("leave", { 
    name : player.name,
    data : game.Status()
  });
}

function socketSkip(){
  var player = SocketPlayer(this);
  var room   = SocketRoom(this);
  room.emit("leave", { name : player.name } );
}

function socketPut(message){
  var player = SocketPlayer(this);
  var room   = SocketRoom(this);

  room.game.Put(message);
}


Room.prototype.tick = function() {
  this.game.tick1sec();
  this.emit("update", this.game.Status());
}

module.exports = {
  IsOnIndex   : IsOnIndex,
  HandleIndex : HandleIndex,
  Init        : Init
}
