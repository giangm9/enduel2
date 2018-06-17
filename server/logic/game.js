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
const DAMAGE_USED          = 10;

const DEBUG                = false;
const TICK_DAMAGE_INTERVAL = 20;

/**
 * Available events 
 *
 * -- Events trigger on current player -- 
 * @event correct   : put a correct word
 * @event incorrect : put an incorrect word
 * @event die       : hp <= 0
 * @event skip      : 
 * @event used      : put an used word
 * -- Event trigger on game
 * @event end       : all players left/die, game ends
 * */

function Game(room) {
  this.time     = 0;
  this.handlers = {};
  this.current  = room.host;
  this.players  = room.players;
  this.room     = room;
  this.used     = [];
  this.id       = room.id;
  this.letter   = 'qwertyuiopasdfghjklzxcvbnm'.getRandom();

  this.players.forEach(function(player){
    player.hp         = MAX_HP;
    player.timeDamage = 0;
    player.game       = this;
  }.bind(this));

  this._livingCount = this.players.length;
}

Game.prototype.LOG = function(message){
  LOG("Room " + this.room.id + " : " + message);
}

Game.prototype.Tick = function(dt){
  while (dt > 0){
    this.tick1sec();
    dt -= 1;
  }
}

Game.prototype.Status = function(){
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

Game.prototype.On = function(event, handler){
  var h = this.handlers;
  if (!h[event]){
    h[event] = [];
  }
  h[event].append(handler);
  return this;
}

Game.prototype.Skip = function(){
  this.LOG(this.current.namehp() + "  | skip");
  this.current.hp -= DAMAGE_SKIP;
  this.trigger("skip");
  this.check0HP("skip");
}

Game.prototype.Put = function( word ){
  var current = this.current;
  var room = this.room;


  this.LOG(current.namehp() + " puts '" + word + "'");
  var c = this.current;
  
  if (word[0] != this.letter){
    if (DEBUG){
      throw "ERROR : first letter must match";
    }
    this.LOG("ERROR : first letter must match");
    return;
  }


  if (Dict.Exist(word)){
    if (this.used.includes(word)){
      c.hp -= DAMAGE_USED;
      this.LOG("  | used");
      this.trigger("used");
      this.check0HP("used");
    }
    this.LOG("  | correct");
    this.letter = word[word.length  - 1];
    this.LOG("current letter : '" +  this.letter + "'");
    this.trigger("correct");
    this.next();
  } else {
    this.trigger("  | incorrect");
    c.hp -= DAMAGE_INCORRECT;
    this.LOG("  | incorrect, " + current.namehp() + " ( -" + DAMAGE_INCORRECT + "hp )");
    this.check0HP("incorrect");
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

Game.prototype.check0HP = function( source ){
  if (this.current.hp  <= 0){
    this.current.hp = 0;
    this.LOG(this.current.name + " DIE, source : " + source);
    this.LOG("living players ");
    var count = 0 ;
    this.players.forEach(function(player){
      if (player.hp > 0) {
        count++;
        this.LOG("  | " + player.namehp());
      }
    }.bind(this));
    this.LOG("  | count = " + count);
    this.trigger("die");
    this._livingCount--; 
    this.tryEnd();
    this.next();
  }
}

Game.prototype.next = function(){
  var last = this.current;
  var index = this.players.indexOf(this.current);
  var nextIndex = index;
  while (true && this._livingCount > 0) {
    nextIndex = (nextIndex + 1 == this.players.length) ? 0 : nextIndex + 1;
    if (this.players[nextIndex].hp > 0) break;
  }
  this.current = this.players[nextIndex];
  this.current.timeDamage = 0;
  this.trigger("next", last, this.current);
  this.LOG("current player " + this.current.namehp());
}



Game.prototype.trigger = function(event, data){
  if (!this.handlers[event]) return;
  this.hanlders[event].forEach(function(handler){
    handler(data);
  });
}



Game.prototype.tryEnd = function(){
  if (this._livingCount != 0) return;
  this.current = undefined;
  this.trigger("end");


  Object.getOwnPropertyNames(this.__proto__).forEach(function(prop){
    if (typeof this[prop] == 'function'){
      this[prop] = () => LOG("Game (id=" + this.id + ")  already end");
    }
  }.bind(this));
}


Player.prototype.status = function( ) {
  var status = old_status.call(this);
  status.hp = this.hp;
  return status;
}

Player.prototype.LeaveGame = function() {
  var game = this.game;

  if (game.current.id == this.id){
    game.next();
  }

  game.LOG(this.namehp() + " has left");
  game.players.remove(function(player){
    return player.id == this.id;
  }.bind(this));

  this.game = undefined;
  this.room = undefined;
  this.hp   = 0;

  game._livingCount--;
  game.tryEnd();
  if (game.current){
    game.LOG("  | current player " + game.current.namehp()); 
  }

}

Player.prototype.namehp = function() {
  return this.name + " { hp:" + this.hp + " }";
}

var old_status = Player.prototype.status;


module.exports = Game;
