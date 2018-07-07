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

var 
  data,
  player; 

$(function() {
  Net.Init();
  Queue.Init();
  Put.Init();
  HP.Init();
  Chatbox.Init();

  Put.On("put", function(message){
    Net.Put(message);
  });

  Net.Join();

  Net
    .On("update"    , updateData)
    .On("end"       , toMain)
    .On("used"      , (data) => Chatbox.Add(data.name , " -10 ( used word '" + data.word + "')"))
    .On("incorrect" , (data) => Chatbox.Add(data.name , " -20 ( incorrect word '" + data.word + "' )"))
    .On("correct"   , (data) => Chatbox.Add(data.name , " puts correct : " +  data.word))
    .On("die"       , (name) => Chatbox.Add(name      , " die"));

  Net.Update();
});

function updateData(dat) {
  if (!dat) toMain();
  data = dat;
  player = getCurrentPlayer(data);
  Put.Letter(data.letter);
  HP.SetHP(player.hp);
  onTurn() ? Put.Enable() : Put.Disable();
  Queue.UpdateFromData(data);
}

function toMain() {
  SetCookies("state", "main"); 
  location.reload();
}

function onTurn() {
  return player.id == data.current.id;
}

function getCurrentPlayer(data){
  var res = null;
  data.players.forEach(function(player) {
    if (player.id == GetCookies("id")){
      res = player;
    }
  });
  return res;
}
