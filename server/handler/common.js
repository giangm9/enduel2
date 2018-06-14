const path = require('path');
const appDir = path.dirname(require.main.filename);
const parseCookie = require("cookie").parse;
const Player = require("../logic/player.js");
const Room = require("../logic/room.js");

Room.prototype.emit = function(event, message){
  this.sockets.emit(event, message);
}

Player.prototype.emit = function(event, message){
  this.socket.emit(event, message);
}

SocketCookie = function(socket) {
  return parseCookie(socket.handshake.headers.cookie);
}

module.exports =  {
  Dir : appDir,
  SocketCookie
}

