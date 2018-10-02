/*
 * @class Room
 * Represent a room, contains Players
 */

const common = require("./common");

var _all = [];

function Room() {
  this.id      = common.GenUID(_all);
  this.strID   = this.id.toString();
  this.lock    = false;
  this.players = [];
  this.host    = null;
  this.state   = "wait"; //ingame
  _all.push(this);
}

/**
 * Add a player 
 * @param {Player} player
 */
Room.prototype.Add = function(player) {
  this.players.push(player);
  if (this.players.length == 1){
    this.SetHost(player);
  }
  player.room = this;
}

Room.prototype.Dismiss = function() {
  _all.removeByID(this.id);
}

Room.prototype.Status = function(){
  var players = [];
  var host = null;
  this.players.forEach( function(player) {
    players.push(player.Status());
    if (player.isHost) {
      host = player.Status();
    }
  });
  return {
    id      : this.id,
    lock    : this.lock,
    players : players,
    host    : host
  }
}

Room.prototype.Toggle = function(){
  this.lock = !this.lock;
}

Room.prototype.GetPlayer = function(id){
  return this.players.getByID(id); 
}

Room.prototype.GetNextHost = function(){
  for (var i = 0 ; i < this.players.length; i++){
    if (!this.players[i].isHost){
      return this.players[i];
    }
  }
}

Room.prototype.SetHost = function(player){
  this.players.forEach(function(player){
    player.isHost = false;
  });
  this.host = player;
  player.isHost = true;
}

Room.prototype.Ingame = function() {
  this.state = 'ingame';
}

Room.prototype.count = function() {
  return this.players.length;
}

Room.GetRandomOpen = function() {
  return _open().getRandom();
}

Room.count = function(){
  return _all.length;
}

Room.GetByID = function(id) {
  return _all.getByID(id)
}

Room.CountOpen = function() {
  return _open().length;
}

_open = function() {
  return _all.filter((room) => { return !room.lock && room.state != "ingame" } );
}

module.exports = Room;
