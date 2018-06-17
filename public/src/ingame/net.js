/**
 * Networking with server wrapper
 * */
import io from "socket.io-client";
import EventBase from "../eventbase.js";

var Net = {};

var 
  socket,
  handlers;


Net.Init = function() {
  socket = io("/ingame");
  handlers = {};
  socket
    .on("connection_error" , connectionFail )
    .on("put"              , ( message ) => Net.trigger("put" , message) )
    .on("update"           , ( data ) => Net.trigger("update" , data) )
    .on("leave"            , ( data ) => Net.trigger("leave"  , data) )
    .on("skip"             , ( data ) => Net.trigger("skip"  , data) );

  EventBase(Net);
}

Net.Leave = function() {
  socket.emit("leave");
}

Net.Skip = function() {
  socket.emit("skip"); 
}

Net.Put = function(message) {
  socket.emit("put", message);
}

Net.Update = function() {
  socket.emit("update");
}


function connectionFail(){
  console.log("Connection Failed");
  SetCookies("state", "main");
  location.reload();
}

export default Net;


