"strict mode"
/*
 * @class Player
 * Represent a player
 */
const common = require("./common");
const utils  = require("../utils");
const Room   = require("./room")


var AllPlayers = [];

class Player {
  constructor(name = "") {
    this.id     = common.GenUID(AllPlayers);
    this.name   = name;
    this.state  = 'room'; // room | ingame
    this.isHost = false;
    AllPlayers.push(this);
  }
 
}

Player.prototype.Leave = function() {
  function matchid( player ) {
    return this.id == player.id;
  }

  this.room.players.remove(matchid.bind(this));
  AllPlayers.remove(matchid.bind(this));
}

Player.prototype.NameID = function() {
  var str = this.name;
  for (var i = 0; i < 10 - this.name.length; i++){
    str += ' ';
  }
  str += " (id=" + this.id + ")";

  return str;
}

Player.prototype.Status = function(){
  return {
    "name"   : this.name,
    "id"     : this.id,
    "isHost" : this.isHost
  }
}

/**
 * return a player by id, undefined when not found 
 * @param {number} id 
 * @returns {Player}
 */
Player.GetByID = function(id){
  return AllPlayers.getByID(id)
}

Player.Count = function(){
  return AllPlayers.length;
}


module.exports = Player;
