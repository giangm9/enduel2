const Player = require("../logic/player.js");
const Room   = require("../logic/room.js");
const common = require("./common");

var RoomHandler = {

}

RoomHandler.onIndex = function( req, res ){
  return true;
//  return req.cookies["state"] == "inroom";
}

RoomHandler.handleIndex = function( req, res ){
  res.cookie("id", 1);
  res.cookie("name", "admin");
  res.sendFile(common.dir + "/public/room.html");
}

RoomHandler.init = function( app, io){
  app.get("/room/status", status);
  app.get("/room/start", start);
  app.get("/room/toggle-lock", list);
}

function status(req, res){
  var host = new Player("admin");
  host.isHost = true;
  return {
    id: 1,
    lock: true,
    player : [
      host,
      new Player("cat"),
      new Player("dog"),
      new Player("jin"),
      new Player("moon"),
      new Player("fan")
    ]
  }
}

module.exports = RoomHandler;
