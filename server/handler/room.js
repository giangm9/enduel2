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
    var player = Player.GetByID(cookie.id);
    var room   = Room.GetByID(cookie.room);

    if (!player || !room) {
      return;
    }
    player.socket = socket;
    socket.join(room.strID);
    room.sockets = io.of('/room').to(room.strID);
    room.emit("update");
  });

}

function KickHandler(req, res){
  var player = Player.GetByID(req.query.id);
  var host   = player.room.host;
  RLOG(req, host.NameID() + " kicks " + player.NameID());

  player.Leave();
  player.emit("kicked");
  res.sendStatus(200);
}

function LeaveHandler(req, res){
  var player = Player.GetByID(req.cookies.id);
  var room   = Room.GetByID(req.cookies.room);
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

  RLOG(req, player.NameID() + " LEFT " 
    + req.cookies.room);

  player.Leave();
  // Host to next player
  if (player.isHost){
    
    var newHost = room.GetNextHost();

    // No more player in room
    if (!newHost) {
      room.Dismiss();
      RLOG(req, " DISSMISSED");
      return;
    }
    room.SetHost(newHost);
  }
}

function StatusHandler(req, res){
  var player = Player.GetByID(req.cookies.id);
  if (player) {
    var room = player.room;
    res.cookie("room", room.id);
    res.send(room.Status());
  } else {
    res.cookie("state", "main");
    res.send("reload");
  }
}

function StartHandler(req, res ){
  var player = Player.GetByID(req.cookies.id);
  var room = Room.GetByID(req.cookies.room);
  room.state = "ingame";
  res.sendStatus(200);
  RLOG(req, "Player " + player.NameID() + " STARTED");
  room.emit("start", room.Status());
}

function ToogleHanlder(req, res){
  var roomid = req.cookies.room; 
  var room = Room.GetByID(roomid);
  room.Toggle();
  room.emit("update");
  res.send(room.lock);
  RLOG(req, room.lock ? " LOCKED" : " UNLOCKED");
}

function RLOG(req, message) {
  LOG("ROOM " + req.cookies.id + " " + message);  
}

module.exports = {
  IsOnIndex   : IsOnIndex,
  Init        : Init,
  HandleIndex : HandleIndex
}
