const Player  = require("../logic/player.js");
const Room    = require("../logic/room.js");
const common  = require("./common");
const utils   = require("../utils");
const LOG     = utils.LOG;

function Init(app, io) {
  app.get("/login/create-room" , HandleRoomCreate);
  app.get("/login/join"        , HandleJoinRoom);
}

function InitIO(io){
//io.of("/login").on("connection", function(socket){

//})
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
  if (!Player.GetByID(req.cookies.id)) return true;
  if (!Room.GetByID(req.cookies.room)) return true;

  return false;
}

function HandleIndex(req, res) {
  res.sendFile(common.Dir + '/public/login.html');
}

function HandleJoinRoom(req, res) {
  var roomid = req.query.room.trim();
  var name   = req.query.name;
  
  if (roomid == '' && Room.CountOpen() == 0) {
    HandleRoomCreate(req, res);
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
  LOG(player.NameID() + " JOINED ROOM " + room.id);

  LOG_ROOM(room);
  res.sendStatus(200);
}

function HandleRoomCreate(req, res) {
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
  LOG("ROOM " + room.id + " CREATED BY " + player.NameID());
  LOG_ROOM(room);
}

function LOG_ROOM(room) {
  LOG("ROOM " + room.id);
  room.players.forEach(function (player) {
    var str = player.NameID();
    if (room.players.indexOf(player) == room.players.length - 1 ) {
        str = " └── " + str;
    } else {
        str = " ├── " + str;
    }

    if (player.isHost) {
      str += ' *' 
    }
    LOG(str);
  });
}

module.exports = {
  IsOnIndex   : IsOnIndex,
  HandleIndex : HandleIndex,
  Init        : Init
} 
