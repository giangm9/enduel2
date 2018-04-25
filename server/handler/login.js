/*
 * Login handler 
 */

const Player  = require("../logic/player.js");
const Room    = require("../logic/room.js");
const common  = require("./common");
const utils   = require("../utils");
const GenName = require("../libs/RandomName.js");
const LOG     = utils.LOG;

var LoginHandler = {};

LoginHandler.init = function( app , io) {
  GenName.init(common.dir + "/data/names.txt");
  app.get("/login/retrieve-id", retrieveID);
  app.get("/login/create-room", createRoom);
  app.get("/login/quit", quit);
  app.get("/login/gen-name", genName);
  io.on("connection", connectionHanlder);
}

LoginHandler.onIndex = function(req, res) {
  return ( !req.cookies.state || req.cookies.state == "main");
}

LoginHandler.handleIndex = function( req, res ) {
  res.sendFile(common.dir + '/public/login.html');
}
/**
 * HANDLERS
 */
function genName(req, res){
  res.send(GenName.gen().trim());
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
  var id = req.cookies.id; 
  var player = Player.getByID(req.cookies.id);

  player.name   = req.query.name;
  player.room   = room;
  player.isHost = true;
  room.host     = player;

  room.add(player);
  LOG(player.name+ " (id=" + id + ") create room " + room.id);
  res.cookie("room", room.id);
  res.cookie("state", "room");
  res.sendStatus(200);
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
  LOG("Current playing : " + Player.all.length);
  Player.all.forEach( function( player ){
    LOG(" | " + player.name + " (id:" + player.id + ")");

  });
}


module.exports = LoginHandler;


