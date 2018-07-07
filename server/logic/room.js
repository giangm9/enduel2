/*
 * @class Room
 * Represent a room, contains Players
 */

const common = require("./common");

var AllRooms  = [];
var OpenRooms = [];

function Room() {
  this.id      = common.GenUID(AllRooms);
  this.strID   = this.id.toString();
  this.lock    = true;
  this.players = [];
  this.host    = null;
  this.state   = "wait"; //ingame
  AllRooms.push(this);
}

/**
 * Add a player 
 * @param {Player} player
 */
Room.prototype.Add = function(player) {
  this.players.push(player);
  if (this.players.length == 1){
    this.SetHost(player);
  }
  player.room = this;
}

Room.prototype.Dismiss = function() {
  AllRooms.remove(function(room){
    return this.id == room.id
  }.bind(this));
}

Room.prototype.Status = function(){
  var players = [];
  var host = null;
  this.players.forEach( function(player) {
    players.push(player.Status());
    if (player.isHost) {
      host = player.Status();
    }
  });
  return {
    id      : this.id,
    lock    : this.lock,
    players : players,
    host    : host
  }
}

Room.prototype.Toggle = function(){
  this.lock = !this.lock;
  if (!this.lock) {
    OpenRooms.push(this);
  } else {
    OpenRooms.remove(function(room) {
      return this.id = room.id;
    }.bind(this));
  }
}

Room.prototype.GetPlayer = function(id){
  return this.players.getByID(id); 
}

Room.prototype.GetNextHost = function(){
  for (var i = 0 ; i < this.players.length; i++){
    if (!this.players[i].isHost){
      return this.players[i];
    }
  }
}

Room.prototype.SetHost = function(player){
  this.players.forEach(function(player){
    player.isHost = false;
  });
  this.host = player;
  player.isHost = true;
}

Room.count = function(){
  return AllRooms.length;
}

Room.countOpen = function(){
  return OpenRooms.length;
}

Room.getRandomOpen = function(){
  return OpenRooms.getRandom();
}

Room.GetByID = function(id) {
  return AllRooms.getByID(id)
}

module.exports = Room;
