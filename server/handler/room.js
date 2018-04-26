const Player = require("../logic/player.js");
const Room   = require("../logic/room.js");
const common = require("./common");
const utils  = require("../utils");
const LOG    = utils.LOG;


var RoomHandler = {}

RoomHandler.onIndex = function( req, res ){
  return (req.cookies && req.cookies.state == "room");
}

RoomHandler.handleIndex = function( req, res ){
  res.sendFile(common.dir + "/public/room.html");
}

RoomHandler.init = function( app, io){
  app.get("/room/status", status);
  app.get("/room/start", start);
  app.get("/room/toggle-lock", toogle);
  app.get("/room/leave", leave);
}

function leave(req, res){
  var player = Player.getByID(req.cookies.id);
  res.cookie("state", "main");

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

function status(req, res){
  var player = Player.getByID(req.cookies.id);
  if (player) {
    var room = player.room;
    res.cookie("room", room.id);
    res.send(room.status());
  } else {
    res.sendStatus(200);
  }
}

function start(req, res ){

}

function toogle(req, res){
  var room = Room.getByID(req.cookies.room);
  console.log(room.lock);
  room.lock = !room.lock;
  res.send(room.lock);
  LOG("Room " +  room.id + ( room.lock ? " locked" : " unlocked"));
}

module.exports = RoomHandler;
