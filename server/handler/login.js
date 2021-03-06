const Player  = require("../logic/player.js");
const Room    = require("../logic/room.js");
const common  = require("./common");
const utils   = require("../utils");
const GenName = require("../libs/GenName.js");
const LOG     = utils.LOG;

function Init(app, io) {
  GenName.Init(common.Dir+ "/data/names.txt");

  app.get("/login/create-room" , CreateRoomHandler);
  app.get("/login/gen-name"    , (_, res) => {res.send(GenName.Gen());});
  app.get("/login/join"        , JoinRoomHandler);
}

function InitIO(io){
  io.of("/login").on("connection", function(socket){

  })
}

function IsOnIndex(req, res) {

  // First time on page 
  if (!req.cookies.state) {
    return true;
  }

  // Back to login
  if (req.cookies.state == "main"){
    return true;
  }

  // Sometimes, cookies still on the browser, but the server restart
  var id = req.cookies.id;
  var room = req.cookies.room;

  if (!Player.GetByID(id)) return true;
  if (!Room.GetByID(room)) return true;

  return false;
}

function HandleIndex(req, res) {
  res.sendFile(common.Dir+ '/public/login.html');
}

function JoinRoomHandler(req, res) {
  var roomid = req.query.room.trim();
  var name   = req.query.name;
  
  if (roomid == '' && Room.CountOpen() == 0) {
    CreateRoomHandler(req, res);
    return;
  }

  var player = new Player(name);
  var room = null;
  if (roomid == '') {
    room = Room.GetRandomOpen();
  } else {
    room = Room.GetByID(roomid);
    if (!room || ( room.state != 'wait')  ) {
      res.send("not-found");
      return;
    }
  }
  room.Add(player);
  res.cookie("state", "room");
  res.cookie("room", room.id);
  res.cookie("id", player.id);
  LOG(player.NameID() + " join room " + room.id);
  LOG_ROOM(room);
  res.sendStatus(200);
}

function CreateRoomHandler(req, res) {
  var name    = req.query.name;
      room    = new Room();
      player  = new Player(name);

  player.room   = room;
  player.state  = 'room'
  player.isHost = true;
  
  room.SetHost(player);
  room.Add(player)

  res.cookie("room", room.id);
  res.cookie("id", player.id);
  res.cookie("state", "room");
  res.sendStatus(200);
  LOG(player.NameID() + " created room " + room.id);
  LOG_ROOM(room);
}

function LOG_ROOM(room) {
  LOG("Room " + room.id);
  room.players.forEach(function (player) {
    var str = " | " + player.NameID();
    if (player.isHost) {
      str += '  <- host';
    }
    LOG(str);
  });
}

module.exports = {
  IsOnIndex   : IsOnIndex,
  HandleIndex : HandleIndex,
  Init        : Init
} 
