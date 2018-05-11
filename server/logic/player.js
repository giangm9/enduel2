/*
 * @class Player
 * Represent a player
 */
const common = require("./common");
const utils  = require("../utils");


Player.all = [];

var AllPlayers = [];

function Player(name){
  this.id     = common.GenUID(Player.all);
  this.name   = name ? name : "__UNSET__";
  this.state  = 'room'; // room | ingame
  this.isHost = false;
  Player.all.push(this);
}


Player.prototype.leave = function() {
  function matchid( player ) {
    return this.id == player.id;
  }

  this.room.players.remove(matchid.bind(this));
  Player.all.remove(matchid.bind(this));
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

Player.count = function(){
  return AllPlayers.length;
}


module.exports = Player;
