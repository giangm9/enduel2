const Dict = require("./dict.js");
const utils = require("../utils");
const Player = require("./player");
const LOG = utils.LOG;


/**
 * @type {Room} room
 */

const MAX_HP               = 100;
const DAMAGE_SKIP          = 30;
const DAMAGE_INCORRECT     = 20;
const DEBUG                = false;
const TICK_DAMAGE_INTERVAL = 20;

Player.prototype.namehp = function() {
  return this.name + " { hp:" + this.hp + " }";
}

var old_status = Player.prototype.status;

Player.prototype.status = function( ) {
  var status = old_status.call(this);
  status.hp = this.hp;
  return status;
}

function Game(room) {
  this.time     = 0;
  this.handlers = {};
  this.current  = room.host;
  this.players  = room.players;
  this.room = room;

  this.players.forEach(function(player){
    player.hp = MAX_HP;
    player.timeDamage = 0;
  });

  this.letter = 'qwertyuiopasdfghjklzxcvbnm'.getRandom();
  this.log = 'none';
}

Game.prototype.LOG = function(message){
  LOG("Room " + this.room.id + " : " + message);
}


Game.prototype.tick = function(dt){
  while (dt > 0){
    this.tick1sec();
    dt -= 1;
  }
}

Game.prototype.tick1sec = function(){
  var c = this.current;   
  c.hp -= 1;
  c.timeDamage += 1;
  if (c.timeDamage >= TICK_DAMAGE_INTERVAL){
    this.LOG(c.namehp() + " takes " + TICK_DAMAGE_INTERVAL + " damages, source : time-out");
    c.timeDamage -= TICK_DAMAGE_INTERVAL;
  }
  this.check0HP("time-out");
}

Game.prototype.put = function( word ){
  var current = this.current;
  var room = this.room;


  this.LOG(current.namehp() + " puts '" + word + "'");
  var c = this.current;
  if (word[0]  == "!"){
    this.LOG(current.namehp() + "  | skip");
    this.trigger("skip");
    c.hp -= SKIP_DAMAGE;
    this.check0HP("skip");
  }

  if (word[0] != this.letter){
    if (DEBUG){
      throw "ERROR : first letter must match";
    }
    this.LOG("ERROR : first letter must match");
    return;
  }


  if (Dict.Exist(word)){
    this.LOG("  | correct");
    this.letter = word[word.length  - 1];
    this.LOG("current letter : '" +  this.letter + "'");
    this.trigger("correct");
    this.next();
  } else {
    this.trigger("  | incorrect");
    c.hp -= DAMAGE_INCORRECT;
    this.check0HP("incorrect");
    this.LOG("  | incorrect, " + current.namehp() + " ( -" + DAMAGE_INCORRECT + "hp )");
  }
}

Game.prototype.check0HP = function( source ){
  if (this.current.hp  <= 0){
    this.current.hp = 0;
    this.LOG(this.current.name + " DIE, source : " + source);
    this.LOG("living players ");
    this.players.forEach(function(player){
      if (player.hp > 0)
        this.LOG("  | " + player.namehp());
    }.bind(this));

    this.next();
    this.trigger("die");
  }
}


Game.prototype.next = function(){
  var last = this.current;
  var index = this.players.indexOf(this.current);
  var nextIndex = index;
  while (true) {
    nextIndex = (nextIndex + 1 == this.players.length) ? 0 : nextIndex + 1;
    if (this.players[nextIndex].hp > 0) break;
  }
  this.current = this.players[nextIndex];
  this.current.timeDamage = 0;
  this.trigger("next", last, this.current);
  this.LOG("current player " + this.current.namehp());
}

Game.prototype.status = function(){
  var players = [];
  this.players.forEach(function(player){
    players.push(player.status());
  });
  return {
    room    : this.room.id,
    current : this.current.status(),
    letter  : this.letter,
    players : players
  }
}

Game.prototype.trigger = function(event, data){
  if (!this.handlers[event]) return;
  this.hanlders[event].forEach(function(handler){
    handler(data);
  });
}

Game.prototype.on = function(event, handler){
  var h = this.handlers;
  if (!h[event]){
    h[event] = [];
  }
  h[event].append(handler);
}

module.exports = Game;
