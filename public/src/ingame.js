import $ from "jquery";
import Cookies from "js-cookie";
import io from "socket.io-client";
import Chatbox from "./ingame/chatbox.js";
import Put from "./ingame/put.js";
import Net from "./ingame/net.js";
import Queue from "./ingame/queue.js";

const LOG = console.log;
const Get = $.get;
const GetCookies = Cookies.get;
const SetCookies = Cookies.set;

$(function() {
  InitNet();
  Queue.Init();
  Put.Init();
  Chatbox.Init();

  Put.On("put", function(message){
    Net.Put(message);
  });

  Net
    .On("update", function(data) {
      var letter = data.letter;
      var currentName = data.current.name;
      var nextName = data.next.name;
      Queue.Set(currentName, nextName);
      Put.Letter(letter);
    })
    .On("put", function(message) {
      Chatbox.Add(message.name, message.word);
    });
  
  Net.Update();
});

function InitNet() {
  Net.Init();
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

