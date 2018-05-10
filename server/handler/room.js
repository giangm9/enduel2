const Player = require("../logic/player.js");
const Room   = require("../logic/room.js");
const common = require("./common");
const utils  = require("../utils");
const LOG    = utils.LOG;


IsOnIndex = function( req, res ){
  return (req.cookies && req.cookies.state == "room");
}

HandleIndex = function( req, res ){
  res.sendFile(common.dir + "/public/room.html");
}

Init = function( app, io){
  app.get("/room/status"      , StatusHandler);
  app.get("/room/start"       , StartHandler);
  app.get("/room/toggle-lock" , ToogleHanlder);
  app.get("/room/leave"       , LeaveHandler);
}

function LeaveHandler(req, res){
  var player = Player.getByID(req.cookies.id);
  res.cookie("state", "main");
  res.cookie("room", undefined);

  if (player){
    var room = player.room;
    if (room) {
      LOG(player.name 
        + " (id=" + player.id + ") leave room " 
        + req.cookies.room);
      
      player.leave();
      if (room.players.length == 0) {
        room.dismiss();
        LOG("Room " + room.id + " dismissed");
      }
    }
  }
  res.sendStatus(200);
}

function StatusHandler(req, res){
  var player = Player.getByID(req.cookies.id);
  if (player) {
    var room = player.room;
    res.cookie("room", room.id);
    res.send(room.status());
  } else {
    res.send({
      id: -1,
      players: []
    });

  }
}

function StartHandler(req, res ){

}

function ToogleHanlder(req, res){
  var room = Room.getByID(req.cookies.room);
  console.log(room.lock);
  room.lock = !room.lock;
  res.send(room.lock);
  LOG("Room " +  room.id + ( room.lock ? " locked" : " unlocked"));
}

module.exports = {
  IsOnIndex: IsOnIndex,
  Init: Init,
  HandleIndex: HandleIndex
}
