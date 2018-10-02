const Dict        = require("./dict.js");
const utils       = require("../utils");
const Player      = require("./player");
const EventEmiter = require("events");

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
  this.current  = room.host;
  this.players  = room.players;
  this.room     = room;
  this.used     = [];
  this.id       = room.id;
  this.events   = new EventEmiter();
  this.letter   = 'qwertyuiopasdfghjklzcvbnm'.getRandom();

  this.players.forEach(function(player){
    player.hp         = MAX_HP;
    player.timeDamage = 0;
    player.score      = 0;
    player.game       = this;
  }.bind(this));

  this._livingCount = this.players.length;
  this.LOG(" CREATED");
}

Game.prototype.LOG = function(message){
  LOG("GAME " + this.id + " "  + message);
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
    players.push(player.Status());
  });
  return {
    room    : this.room.id,
    current : this.current.Status(),
    next    : this.getNext().Status(),
    letter  : this.letter,
    players : players
  }
}

Game.prototype.On = function(event, handler){
  this.events.on(event, handler);
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
      this.LOG(this.current.namehp() + "PUTS USED");
      this.LOG("CURRENT PLAYER  " + this.current.namehp());
      this.trigger("used", word);
      this.check0HP("used");
      return;
    }
    this.LOG(this.current.namehp() + " PUTS CORRECT");
    this.letter = word[word.length  - 1];
    this.LOG("current letter : '" +  this.letter + "'");
    this.used.push(word);
    this.trigger("correct", word);
    this.next();
    this.current.score++;
  } else {
    this.trigger("incorrect", word);
    c.hp -= DAMAGE_INCORRECT;
    this.LOG("INCORRECT , " + current.namehp() + " ( -" + DAMAGE_INCORRECT + "hp )");
    this.check0HP("incorrect");
  }
}

Game.prototype.tick1sec = function(){
  var c = this.current;   
  c.hp -= 1;
  c.timeDamage += 1;
  if (c.timeDamage >= TICK_DAMAGE_INTERVAL){
    this.LOG(c.namehp() + " TAKES " + TICK_DAMAGE_INTERVAL + " DAMAGE(time-out)");
    c.timeDamage -= TICK_DAMAGE_INTERVAL;
  }
  this.check0HP("time-out");
}

Game.prototype.check0HP = function( source ){
  if (this.current.hp  <= 0){
    this.current.hp = 0;
    this.LOG(this.current.name + " DIE, source : " + source);
    this.LOG("PLAYERS: ");
    this.players.forEach(function(player){

      if (this.players.indexOf(player) == this.players.length - 1 ) {
          this.LOG(" └── " + player.namehp());
      } else {
          this.LOG(" ├── " + player.namehp());
      }

    }.bind(this));

    this.trigger("die", this.current.name);
    this._livingCount--; 
    this.tryEnd();
    this.next();
  }
}

Game.prototype.getNext = function() {
  var last = this.current;
  var index = this.players.indexOf(this.current);
  var nextIndex = index;
  while (true && this._livingCount > 0) {
    nextIndex = (nextIndex + 1 == this.players.length) ? 0 : nextIndex + 1;
    if (this.players[nextIndex].hp > 0) break;
  }
  return this.players[nextIndex];
}

Game.prototype.next = function(){
  var last = this.current;
  this.current = this.getNext();
  this.current.timeDamage = 0;
  this.trigger("next", last, this.current);
  this.LOG("CURRENT PLAYER " + this.current.namehp());
}

Game.prototype.trigger = function(event, data){
  this.events.emit(event, data); 
}

Game.prototype.tryEnd = function(){
  if (this._livingCount != 0) return;
  this.trigger("end");

  this.current = undefined;

  Object.getOwnPropertyNames(this.__proto__).forEach(function(prop){
    if (typeof this[prop] == 'function'){
      this[prop] = () => LOG("Game " + this.id + " END");
    }
  }.bind(this));
}


var old_status = Player.prototype.Status;

Player.prototype.Status = function( ) {
  var status = old_status.call(this);
  status.hp = this.hp;
  status.score = this.score;
  return status;
}

Player.prototype.LeaveGame = function() {
  var game = this.game;
  
  if (!game.current || (game.current.id == this.id)){
    game.next();
  }

  game.LOG(this.namehp() + " LEFT");
  game.players.removeByID(this.id);

  this.game = undefined;
  this.room = undefined;

  game._livingCount--;
  game.tryEnd();
  if (game.current){
    game.LOG("CURRENT PLAYER" + game.current.namehp()); 
  }

}

Player.prototype.namehp = function() {
  return this.name + ".hp=" + this.hp;
}

module.exports = Game;
