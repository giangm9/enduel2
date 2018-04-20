/*
 * @class Player
 * Represent a player
 */


const common = require("./common");
const genID  = common.genUniqueID;
const rm     = common.removeFromArray;


Player.all = [];

function Player(name){
  this.id    = genID(Player.all);
  this.name  = name;
  this.state = 'room'; // room | ingame
  Player.all.push(this);
}

Player.prototype.quit = function() {
  rm(Player.all, function( player ) {
    return player.id = this.id;
  }.bind( this ));
}

module.exports = Player;
