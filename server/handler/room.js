const Player      = require("../logic/player.js");
const Room        = require("../logic/room.js");
const common      = require("./common");
const utils       = require("../utils");
const LOG         = utils.LOG;

function IsOnIndex( req, res ){
  return (req.cookies && req.cookies.state == "room");
}

function HandleIndex( req, res ){
  res.sendFile(common.Dir + "/public/room.html");
}

function Init( app, io){
  app.get("/room/status"      , StatusHandler);
  app.get("/room/start"       , StartHandler);
  app.get("/room/toggle-lock" , ToogleHanlder);
  app.get("/room/leave"       , LeaveHandler);
  app.get("/room/kick"        , KickHandler);

  InitIO(io);
}

function InitIO(io){

  io.of('/room').on("connection", function(socket){
    var cookie = common.SocketCookie(socket);
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

function KickHandler(req, res){
  var player = Player.getByID(req.query.id);
  var host   = player.room.host;
  LOG(host.nameid() + " kicks " + player.nameid());
  player.leave();
  player.emit("kicked");
  res.sendStatus(200);
}

function LeaveHandler(req, res){
  var player = Player.getByID(req.cookies.id);
  var room   = Room.getByID(req.cookies.room);
  res.cookie("state", "main");
  res.cookie("room", undefined);
  room.emit("update");
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
  // Host to next player
  if (player.isHost){
    
    var newHost = room.getNextHost();
    // No more player in room
    if (!newHost) {
      room.dismiss();
      LOG("Room " + room.id + " dismissed");
      return;
    }
    room.host = newHost;
    newHost.isHost = true;
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
  var roomid = req.cookies.room; 
  var room = Room.getByID(roomid);
  room.state = "ingame";
  room.emit("start");
  res.sendStatus(200);
  LOG("Room " + room.id + " started ");
}

function ToogleHanlder(req, res){
  var roomid = req.cookies.room; 
  var room = Room.getByID(roomid);
  room.toggle();
  room.emit("update");
  res.send(room.lock);
  LOG("Room " +  room.id + ( room.lock ? " locked" : " unlocked"));
}

module.exports = {
  IsOnIndex   : IsOnIndex,
  Init        : Init,
  HandleIndex : HandleIndex
}
