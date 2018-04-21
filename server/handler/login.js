/*
 * Login handler 
 */

const Player = require("../logic/player.js");
const Room   = require("../logic/room.js");

var LoginHandler = {};

LoginHandler.init = function( app , io) {
  app.get ("/create",  createRoomHandler );
  io.on('connection', connectionHanlder);
}

LoginHandler.onIndex = function(req, res) {
  return true;
}

LoginHandler.handleIndex = function( req, res ) {
  var player = new Player();
  res.cookie("id", player.id);
  console.log(global.appRoot);
  res.sendFile(global.appRoot + '/public/login.html');
}

function createRoomHandler ( req, res ) {
  var player = new Player(); 
}

function connectionHanlder ( socket ){
  console.log(socket);
}

module.exports = LoginHandler;


