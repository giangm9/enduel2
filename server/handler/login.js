const Player  = require("../logic/player.js");
const Room    = require("../logic/room.js");
const common  = require("./common");
const utils   = require("../utils");
const GenName = require("../libs/GenName.js");
const LOG     = utils.LOG;

function Init(app, io) {
  GenName.Init(common.dir + "/data/names.txt");

  app.get("/login/create-room" , CreateRoomHandler);
  app.get("/login/quit"        , QuitGameHandler);
  app.get("/login/gen-name"    , (_, res) => {res.send(GenName.Gen());});
  app.get("/login/join"        , JoinRoomHandler);
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
  return false;
}

function HandleIndex(req, res) {
  res.sendFile(common.dir + '/public/login.html');
}

function JoinRoomHandler(req, res) {
  var roomid = req.query.room;
  
  if (roomid == '') {
    CreateRoomHandler(req, res);
    return;
  }

  var player = new Player(req.query.name);
  var room   = Room.getByID(roomid);

  if (!room) {
    res.send("not-found");
  } else {
    room.add(player);
    res.cookie("state", "room");
    res.cookie("room", room.id);
    LOG(player.nameid() + " join room " + room.id);
    LOG_ROOM(room);
    res.sendStatus(200);
  }
}

function CreateRoomHandler(req, res) {
  var name    = req.query.name;
      room    = new Room();
      player  = new Player(name);

  player.room   = room;
  player.state  = 'room'
  player.isHost = true;
  
  room.host = player;
  room.add(player)

  res.cookie("room", room.id);
  res.cookie("id", player.id);
  res.cookie("state", "room");
  res.sendStatus(200);
  LOG(player.nameid() + " created room " + room.id);
  LOG_ROOM(room);
}

function QuitGameHandler(req, res) {
  var id     = req.cookies.id;
  var player = Player.getByID(id);

  // the condition in case server is restarted
  if (player) {
    res.cookies('id', undefined);
    res.cookies('room', undefined);
    player.quit();
    LOG(player.roomid() + " quit");
    LOGCOUNT();
  }
}

function LOGCOUNT() {
  LOG("Current playing : " + Player.all.length);
  Player.all.forEach(function (player) {
    LOG(" | " + player.nameid());

  });
}

function LOG_ROOM(room) {
  LOG("Room " + room.id);
  room.players.forEach(function (player) {
    var str = " | " + player.nameid();
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
