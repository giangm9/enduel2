const Player      = require("../logic/player.js");
const Room        = require("../logic/room.js");
const common      = require("./common");
const utils       = require("../utils");
const parseCookie = require("cookie").parse;
const LOG         = utils.LOG;

function IsOnIndex( req, res ){
  return (req.cookies && req.cookies.state == "room");
}

function HandleIndex( req, res ){
  res.sendFile(common.dir + "/public/room.html");
}

function Init( app, io){
  app.get("/room/status"      , StatusHandler);
  app.get("/room/start"       , StartHandler);
  app.get("/room/toggle-lock" , ToogleHanlder);
  app.get("/room/leave"       , LeaveHandler);
  InitIO(io);
}

function InitIO(io){

  io.of('/room').on("connection", function(socket){
    var cookie = SocketCookie(socket);
    var player = Player.getByID(cookie.id);
    var room   = Room.getByID(cookie.room);

    if (!player || !room) {
      return;
    }
    player.socket = socket;
    socket.join(room.id);
    room.sockets = io.of('/room').to(room.id);
    room.emit("update");
  });

}

function LeaveHandler(req, res){
  var player = Player.getByID(req.cookies.id);
  res.cookie("state", "main");
  res.cookie("room", undefined);
  res.sendStatus(200);

  if (!player) {
    return;
  }

  var room = player.room;
  if (!room){
    return;
  }

  LOG(player.nameid() + " leave room " 
    + req.cookies.room);

  player.leave();
  if (room.players.length == 0) {
    room.dismiss();
    LOG("Room " + room.id + " dismissed");
  }
}

function StatusHandler(req, res){
  var player = Player.getByID(req.cookies.id);
  if (player) {
    var room = player.room;
    res.cookie("room", room.id);
    res.send(room.status());
  } else {
    res.cookie("state", "main");
    res.send("reload");
  }
}

function StartHandler(req, res ){

}

function ToogleHanlder(req, res){
  var roomid = req.cookies.room; 
  var room = Room.getByID(roomid);
  room.toggle();
  res.send(room.lock);
  LOG("Room " +  room.id + ( room.lock ? " locked" : " unlocked"));
}

function SocketCookie(socket){
  return parseCookie(socket.handshake.headers.cookie);
}

Room.prototype.emit = function(event, message){
  this.sockets.emit(event, message);
}

Player.prototype.emit = function(event, message){
  this.socket.emit(event, message);
}

module.exports = {
  IsOnIndex   : IsOnIndex,
  Init        : Init,
  HandleIndex : HandleIndex
}
