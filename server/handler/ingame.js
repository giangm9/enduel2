const Player = require("../logic/player.js");
const Room = require("../logic/room.js");
const common = require("./common");
const utils = require("../utils");
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
    var player = Player.getByID(cookie.id);
    var room   = Room.getByID(cookie.room);
    if (!player || !room){
      return;
    }
    player.socket = socket;
    socket.join(room.id);
    room.sockets = io.of('/ingame').to(room.id);
    socket.on("put", socketPut);
  });
}

function socketPut(message){
  var player = common.GetPlayerFromSocket(this);  
  var room   = common.GetRoomFromSocket(this);  
  
  LOG("Room " + room.id + ": "  + player.nameid() + " puts " + message);
  room.emit("put", { 
    name : player.name, 
    word : message 
  });
}

module.exports = {
  IsOnIndex : IsOnIndex,
  HandleIndex : HandleIndex,
  Init : Init
}
