/*
 * @class Room
 * Represent a room, contains Players
 */

const common = require("./common");

var AllRooms  = [];
var OpenRooms = [];

function Room() {
  this.id      = common.GenUID(AllRooms);
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
Room.prototype.add = function(player) {
  this.players.push(player);
  if (this.players.length == 1){
    this.setHost(player);
  }
  player.room = this;
}

Room.prototype.dismiss = function() {
  AllRooms.remove(function(room){
    return this.id == room.id
  }.bind(this));
}

Room.prototype.status = function(){
  var players = [];
  var host = null;
  this.players.forEach( function(player) {
    players.push(player.status());
    if (player.isHost) {
      host = player.status();
    }
  });
  return {
    id      : this.id,
    lock    : this.lock,
    players : players,
    host    : host
  }
}

Room.prototype.toggle = function(){
  this.lock = !this.lock;
  if (!this.lock) {
    OpenRooms.push(this);
  } else {
    OpenRooms.remove(function(room) {
      return this.id = room.id;
    }.bind(this));
  }
}

Room.prototype.getPlayer = function(id){
  return this.players.getByID(id); 
}

Room.prototype.getNextHost = function(){
  for (var i = 0 ; i < this.players.length; i++){
    if (!this.players[i].isHost){
      return this.players[i];
    }
  }
}

Room.prototype.setHost = function(player){
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

Room.getByID = function(id) {
  return AllRooms.getByID(id)
}

module.exports = Room;
