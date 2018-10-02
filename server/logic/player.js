"strict mode"
/*
 * @class Player
 * Represent a player
 */
const common = require("./common");
const utils  = require("../utils");
const Room   = require("./room")


var _all = [];

class Player {
  constructor(name = "") {
    this.id     = common.GenUID(_all);
    this.name   = name;
    this.state  = 'room'; // room | ingame
    this.isHost = false;
    _all.push(this);
  }
 
}

Player.prototype.Leave = function() {

  this.room.players.removeByID(this.id);
  _all.removeByID(this.id);
}

Player.prototype.NameID = function() {
  return this.name + "."+ this.id;
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
 * @param {string} id 
 * @returns {Player}
 */
Player.GetByID = function(id){
  return _all.getByID(id)
}

Player.Count = function(){
  return _all.length;
}


module.exports = Player;
