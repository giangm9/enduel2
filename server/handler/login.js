const Player = require("../logic/player.js");
const Room = require("../logic/room.js");
const common = require("./common");
const utils = require("../utils");
const GenName = require("../libs/GenName.js");
const LOG = utils.LOG;

function init(app, io) {
  GenName.init(common.dir + "/data/names.txt");

  app.get("/login/create-room", createRoom);
  app.get("/login/quit", quit);
  app.get("/login/gen-name", genName);
  app.get("/login/join", join);
  io.on("connection", connectionHanlder);
}

function isOnIndex(req, res) {
  return (!req.cookies.state || req.cookies.state == "main");
}

function handleIndex(req, res) {
  res.sendFile(common.dir + '/public/login.html');
}

function join(req, res) {
  var player = Player.getByID(req.cookies.id);
  player.name = req.cookies.name;
  var room = Room.getByID(req.query.room);

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

function genName(req, res) {
  res.send(GenName.gen().trim());
}


function createRoom(req, res) {
  var room = new Room();
  var id = req.cookies.id;
  var player = Player.getByID(req.cookies.id);

  player.name = req.query.name;
  player.room = room;
  player.isHost = true;
  room.host = player;

  room.add(player);
  res.cookie("room", room.id);
  res.cookie("state", "room");
  res.sendStatus(200);
  LOG(player.roomid() + " created room " + room.id);
}

function quit(req, res) {
  var id = req.cookies.id;
  var player = Player.getByID(id);

  // the condition in case server is restarted
  if (player) {
    req.cookies.id = undefined;
    player.quit();
    LOG(player.roomid() + " quit");
    LOGCOUNT();
  }
}

function connectionHanlder(socket) {
  //  console.log(socket);
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

module.exports = LoginHandler;


