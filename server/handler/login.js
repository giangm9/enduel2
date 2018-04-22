/*
 * Login handler 
 */

const Player = require("../logic/player.js");
const Room   = require("../logic/room.js");
const common = require("./common");
const utils  = require("../utils");
const LOG    = utils.LOG;

var LoginHandler = {};

LoginHandler.init = function( app , io) {
  app.get("/login/retrieve-id", retrieveID);
  app.get("/login/create-room", createRoom);
  app.get("/login/quit", quit);
  io.on("connection", connectionHanlder);
}

LoginHandler.onIndex = function(req, res) {
  return true;
}

LoginHandler.handleIndex = function( req, res ) {
  res.sendFile(common.dir + '/public/login.html');
}

function retrieveID(req, res) {
  var player = null;
  var id = req.cookies.id;
  if (id != undefined){
    player = Player.getByID(id);
  } 

  if (player == undefined || id == undefined){
    player = new Player();
    res.cookie("id", player.id);
  }

  res.sendStatus(200);
  LOG("Player " + player.id + " in main");
  LOGCOUNT();
}

function createRoom(req, res) {
  var room = new Room();
  var id   = req.cookies.id;
  LOG(id + "create a room" + room.id);
  LOGCOUNT();
  room.add(Player.getByID(id), true);
}

function quit(req, res ) {
  var id = req.cookies.id;
  var player = Player.getByID(id);

  // the condition in case restart server
  if (player){
    req.cookies.id = undefined;
    player.quit();
    LOG("player " + player.id + " quit");
    LOGCOUNT();
  }
}

function connectionHanlder ( socket ){
  console.log(socket);
}

function LOGCOUNT() {
  LOG("current playing :" + Player.all.length);
}


module.exports = LoginHandler;


