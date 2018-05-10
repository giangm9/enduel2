/*
 * @class Player
 * Represent a player
 */
const common = require("./common");
const genID  = common.genUniqueID;
const rm     = common.removeFromArray;
const utils  = require("../utils");


Player.all = [];

function Player(name){
  this.id    = genID(Player.all);
  this.name  = name ? name : "__UNSET__";
  this.state = 'room'; // room | ingame
  Player.all.push(this);
}


Player.prototype.leave = function() {
  rm(this.room.players, function( player) {
    return this.id = player.id;
  }.bind(this));
  rm(Player.all, function( player ) {
    return player.id == this.id;
  }.bind(this));

}

Player.prototype.nameid =  function() {
  var str = this.name;
  for (var i = 0; i < 10 - this.name.length; i++){
    str += ' ';
  }
  str += " (id=" + this.id + ")";

  return str;
}

/**
 * return a player by id, undefined when not found 
 * @param {number} id 
 * @returns {Player}
 */
Player.getByID = function(id){
  var all = Player.all;
  for (var i = 0 ; i < all.length; ++i){
    if (all[i].id == id ) {
      return all[i];
    }
  }
}


module.exports = Player;
