import $ from "jquery";
import Cookies from "js-cookie";
import io from "socket.io-client";
import Chatbox from "./ingame/chatbox.js";
import Put from "./ingame/put.js";
import Net from "./ingame/net.js";

const LOG = console.log;
const Get = $.get;
const GetCookies = Cookies.get;
const SetCookies = Cookies.set;


var 
  Status = null,
  Player = null,
  Box    = null,
  Input  = null,
  Socket = null;

$(function() {
  Box = new Chatbox($("#chatbox"));
  Input = new Put($("#put"));
  Input.on("put", function(message){
    Net.Put(message);
  });

  InitNet();

});

function putHandler( message ) {
  var name = message.name;
  var word = message.word;
  
  Box.add(name, word);
}


function InitNet() {
  Net.Init();
  global.net = Net;

  function logData(data){
    console.log(data);
  }

  Net.On("put", logData);
  Net.On("skip", logData);
  Net.On("put", logData);
  Net.On("update", logData);
  Net.On("leave", logData);

}

