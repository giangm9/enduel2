const Player = require("../logic/player.js");
const Room = require("../logic/room.js");
const common = require("./common");
const utils = require("../utils");
const parseCookie = require("cookie").parse;
const LOG = utils.LOG;

function IsOnIndex(req, res) {
  return req.cookies && req.cookies.state == "ingame";
}

function HandleIndex(req, res) {
  res.sendFile(common.dir + "/public/ingame.html");
}

function Init(app, io) {
}

module.exports = {
  IsOnIndex : IsOnIndex,
  HandleIndex : HandleIndex,
  Init : Init
}
