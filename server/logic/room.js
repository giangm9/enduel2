/*
 * @class Room
 * Represent a room, contains Players
 */

const common = require("./common");
const genID = common.genUniqueID;
const rm = common.removeFromArray;

function Room() {
  this.id = genID(Room.all);
  this.locked = true;
  this.players = [];
  this.host = null;
}

/**
 * Add a player 
 * @param {Player} player
 */
Room.prototype.add = function(player, host = false) {
  Room.players.push(player);
}

Room.prototype.dismiss = function() {
  rm(Room.all, function(room) {
    return Room.id = this.id;
  }.bind(this));
}

Room.all = [];

Room.exist = function(id) {
  return Room.getByID( id ) != null;
}

Room.getByID = function(id) {
  for (var i = 0; i < Room.all.length; ++i) {
    if (Room.all[i].id == id) {
      return Room.all[i];
    }
  }
  return null;
}
