const Player = require("../logic/player.js");
const Room   = require("../logic/room.js");
const common = require("./common");
const utils  = require("../utils");
const LOG    = utils.LOG;


var RoomHandler = {

}

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
  app.get("/room/quit", quit);

}

function quit(req, res){
  var player = Player.getByID(req.cookies.id);
  if (player){
    LOG(player.name 
      + " (id=" + player.id + ") leave room " 
      + req.cookies.room);
  }
  res.cookie("state", "main");
  res.sendStatus(200);
}

function status(req, res){
  var player = Player.getByID(req.cookies.id);
  var room = player.room;
  res.cookie("room", room.id);
  res.send(room.status());
}

function start(req, res ){
}

function toogle(req, res){
  res.send(false);
}

module.exports = RoomHandler;
