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
  Put.On("put", function(message){
    Net.Put(message);
  });

  Net
    .On("update", function(data) {
      if (!data) {
        toMain();
      }
      var letter = data.letter;
      var current = data.current.name + "[" + data.current.hp + "]";
      var next = data.next.name + "[" + data.next.hp + "]";
      var player = ownPlayer(data);
      Queue.Set(current , next);
      Put.Letter(letter);
      HP.SetHP(player.hp);
      if (player.id == data.current.id){
        Put.Enable();
      } else {
        Put.Disable();
      }
  
    })
    .On("put", function(message) {
      Chatbox.Add(message.name, message.word);
    })
    .On("end", toMain);

  Net.Update();
});

function toMain() {
  SetCookies("state", "main"); 
  location.reload();
}

function ownPlayer(data){
  var res = null;
  data.players.forEach(function(player) {
    if (player.id == GetCookies("id")){
      res = player;
    }
  });
  return res;
}

