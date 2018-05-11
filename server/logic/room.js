/*
 * @class Room
 * Represent a room, contains Players
 */

const common = require("./common");

var AllRooms = [];

function Room() {
  this.id      = common.GenUID(AllRooms);
  this.lock    = true;
  this.players = [];
  this.host    = null;
  AllRooms.push(this);
}

/**
 * Add a player 
 * @param {Player} player
 */
Room.prototype.add = function(player) {
  this.players.push(player);
  player.room = this;
}

Room.prototype.dismiss = function() {
  AllRooms.remove(function(room){
    return this.id = room.id
  }.bind(this));
}

Room.prototype.status = function(){
  var players = [];
  this.players.forEach( function(player) {
    players.push({
      "name"   : player.name,
      "id"     : player.id,
      "isHost" : player.isHost
    })
  });
  return {
    id      : this.id,
    lock    : this.lock,
    players : players
  }
}

Room.count = function(){
  return AllRooms.length;
}

Room.getRandom = function(){
  return AllRooms.getRandom();
}

Room.getByID = function(id) {
  for (var i = 0; i < Room.all.length; ++i) {
    if (Room.all[i].id == id) {
      return Room.all[i];
    }
  }
  return null;
}

module.exports = Room;
