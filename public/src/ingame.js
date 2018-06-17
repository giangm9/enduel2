import $       from "jquery";
import Cookies from "js-cookie";
import io      from "socket.io-client";
import Chatbox from "./ingame/chatbox.js";
import Put     from "./ingame/put.js";
import Net     from "./ingame/net.js";
import Queue   from "./ingame/queue.js";
import HP      from "./ingame/hp.js";

const LOG = console.log;
const Get = $.get;
const GetCookies = Cookies.get;
const SetCookies = Cookies.set;

$(function() {
  Net.Init();
  Queue.Init();
  Put.Init();
  HP.Init();
  Chatbox.Init();
  DEBUG_NET();
  Put.On("put", function(message){
    Net.Put(message);
  });

  Net
    .On("update", function(data) {
      var letter = data.letter;
      var current = data.current.name + "[" + data.current.hp + "]";
      var next = data.next.name + "[" + data.next.hp + "]";
      Queue.Set(current , next);
      Put.Letter(letter);
      HP.SetHP(currentPlayer(data).hp);
    })
    .On("put", function(message) {
      Chatbox.Add(message.name, message.word);
    });
  
  Net.Update();
});

function currentPlayer(data){
  var res = null;
  data.players.forEach(function(player) {
    if (player.id == GetCookies("id")){
      res = player;
    }
  });
  return res;
}

function DEBUG_NET() {

  global.net = Net;

  function logData(data){
    console.log(data);
  }

  Net.On("put"    , logData);
  Net.On("skip"   , logData);
  Net.On("put"    , logData);
  Net.On("update" , logData);
  Net.On("leave"  , logData);
}

