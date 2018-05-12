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
  var host = null;
  this.players.forEach( function(player) {
    players.push(player.readableData());
    if (player.isHost) {
      host = player.readableData();
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
    OpenRoom.remove(function(room) {
      return this.id = room.id;
    }.bind(this));
  }
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
