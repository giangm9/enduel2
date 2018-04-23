const Player = require("../logic/player.js");
const Room   = require("../logic/room.js");
const common = require("./common");

var RoomHandler = {

}

RoomHandler.onIndex = function( req, res ){
  return (req.cookies && req.cookies.state == "room");
}

RoomHandler.handleIndex = function( req, res ){
  res.cookie("id", 1);
  res.cookie("name", "admin");
  res.sendFile(common.dir + "/public/room.html");
}

RoomHandler.init = function( app, io){
  app.get("/room/status", status);
  app.get("/room/start", start);
  app.get("/room/toggle-lock", toogle);
  app.get("/room/esc", esc);

}

function esc(req, res){
  res.send("esc");
}

function status(req, res){
  var host = new Player("admin");
  host.isHost = true;
  res.send({
    id: 1,
    lock: true,
    players : [
      host,
      new Player("cat"),
      new Player("dog"),
      new Player("jin"),
      new Player("moon"),
      new Player("fan")
    ]
  });
}

function start(req, res ){
}

function toogle(req, res){
  res.send(false);
}

module.exports = RoomHandler;
