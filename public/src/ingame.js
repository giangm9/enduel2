import $ from "jquery";
import Cookies from "js-cookie";
import io from "socket.io-client";
import Chatbox from "./ingame/chatbox.js";
import Put from "./ingame/put.js";

const LOG = console.log;
const Get = $.get;
const GetCookies = Cookies.get;
const SetCookies = Cookies.set;


var 
  Status = null,
  Player = null,
  Box    = null,
  Input  = null;

$(function() {
  Box = new Chatbox($("#chatbox"));
  Input = new Put($("#put"));

  Input.on("put", function(message){
//    console.log(message);
    Box.add(message);
  });
});
