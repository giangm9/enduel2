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
    .On("end", toMain)
    .On("used", (data) => Chatbox.Add(data.name, "-10 used word ( " + data.word + " )"))
    .On("incorrect", (data) => Chatbox.Add(data.name , " -20 incorrect ( " + data.word + " )"))
    .On("correct", (data) => Chatbox.Add(data.name," puts correct : " +  data.word));


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

