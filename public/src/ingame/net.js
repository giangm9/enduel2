/**
 * Networking with server wrapper
 * */
import io from "socket.io-client";
import EventBase from "../eventbase.js";

var Net = () => console.error("Net is a static function");


var 
  socket,
  handlers;


Init = function() {
  socket = io("/ingame");
  handlers = {};
  socket
    .on("connection_error", connectionFail)
    .on("put", (message) => trigger("put", message)); 

  EventBase(Net);
}

Net.leave = function() {
  socket.emit("leave");
}

Net.skip = function() {
  socket.emit("skip"): 
}

Net.put = function(message) {
  socket.emit(message);
}


function connectionFail(){
  console.log("Connection Failed");
  SetCookies("state", "main");
  location.reload();
}

export default Net;

// DEBUG
global.Net = Net;

function logData(data){
  console.log(data);
}

Net.On("put", logData);
Net.On("skip", logData);
Net.On("put", logData);
