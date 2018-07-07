const Player       = require("../logic/player.js");
const Room         = require("../logic/room.js");
const Game         = require("../logic/game.js");
const common       = require("./common");
const SocketPlayer = common.GetPlayerFromSocket;
const SocketRoom   = common.GetRoomFromSocket;
const utils        = require("../utils");

const LOG = utils.LOG;

function IsOnIndex(req, res) {
  return req.cookies && req.cookies.state == "ingame";
}

function HandleIndex(req, res) {
  res.sendFile(common.Dir + "/public/ingame.html");
}

function Init(app, io) {
  io.of("/ingame").on("connection", function(socket){
    var cookie = common.SocketCookie(socket);     
    var player = Player.GetByID(cookie.id);
    var room   = Room.GetByID(cookie.room);

    // In case server restart
    if (!player || !room) return;
    
    player.socket = socket;
    socket.join(room.id);
    room.sockets = io.of('/ingame').to(room.id);

    socket
      .on("put"   , socketPut)
      .on("skip"  , socketSkip)
      .on("leave" , socketLeave)
      .on("update", socketUpdate)
      .on("leave" , socketLeave);

    if (!room.game) {
      room.game = new Game(room);
      room.routine = setInterval(room.tick.bind(room), 1000);
    }
    

    var currentName = room.game.current.name;
    room.game
      .On("end"       , gameEnd.bind(room))
      .On("used"      , (word) => room.emit("used"      , {name : currentName , word: word}))
      .On("incorrect" , (word) => room.emit("incorrect" , {name : currentName , word: word}))
      .On("correct"   , (word) => room.emit("correct"   , {name : currentName , word: word}))
      .On("die"       , (name) => room.emit("die"       , name));

    player.game = room.game;
  });
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
    name    : player.status(),
    current : game.current.status(),
  } );
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
  room.emit("update", this.game.Status());
}


module.exports = {
  IsOnIndex : IsOnIndex,
  HandleIndex : HandleIndex,
  Init : Init
}
