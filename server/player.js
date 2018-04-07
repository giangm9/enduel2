/*
 * @class Player
 * Represent a player
 */


function Player(id, name){
  this.id    = id;
  this.name  = name;
  this.state = 'room'; // room | ingame 
}

Player.prototype.leaveRoom = function(){
  for (var i = 0; i < Player.playing.length; i++){
    if ( Player.playing[i].id == this.id ){
      Player.playing.splice(i, 1);
      return;
    }
  }
}


Player.currentFree = 0;
Player.playing     = [];

Player.createRandomPlayer = function( name ){
  var player = new Player ( Player.currentFree, name );
  Player.playing.push( Player.currentFree ); 

  while ( Player.playing.includes( Player.currentFree ) &&
    Player.currentFree < 0xffffff){
    Player.currentFree++;
  }

  return player;
}

module.exports = Player;
