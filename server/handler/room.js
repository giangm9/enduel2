const Player = require("../logic/player.js");
const Room   = require("../logic/room.js");
const common = require("./common");

var RoomHandler = {

}

RoomHandler.onIndex = function( req, res ){
  return req.cookies["state"] == "inroom";
}

RoomHandler.handleIndex = function( req, res ){
  res.sendFile(common.dir + "/public/room.html");
}

RoomHandler.init = function( app, io){

}

RoomHandler.handle = function( app, io) {

}

module.exports = RoomHandler;
