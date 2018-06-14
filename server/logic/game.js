const Dict = require("./dict.js");

/**
 * @type {Room} room
 */

const MAX_HP           = 100;
const DAMAGE_SKIP      = 30; 
const DAMAGE_INCORRECT = 20;

function Game(room) {
  this.time     = 0;
  this.handlers = {};
  this.current  = room.host;
  this.players  = host.players;

  this.players.forEach(function(player){
    player.hp = MAX_HP;
  });
}


Game.prototype.tick = function(dt){
  var c = this.current;   
  c.hp -= dt;

  this.check0HP();
}

Game.prototype.put = function( word ){
  var c = this.current;
  if (word[0]  == "!"){
    this.trigger("skip");
    c.hp -= SKIP_DAMAGE;
    this.check0HP();
  }

  if (Dict.Exist(word)){
    this.letter = word[word.length  - 1];
    this.next();
    this.trigger("correct");
  } else {
    this.trigger("incorrect");
    c.hp -= DAMAGE_INCORRECT;
    this.check0HP();
  }

}

Game.prototype.check0HP(){
  if (this.current.hp  <= 0){
    this.current.hp = 0;
    this.trigger("die");
  }
}

Game.prototype.next(){
  var last = this.current;
  var index = this.players.indexOf(this.current);
  this.current = this.players[(index == this.players.length) ? 0 : index + 1]
  trigger("next", last, this.current);
}

Game.prototype.stats(){
  return {
    current : this.current,
    letter  : this.letter
    players : this.players
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
