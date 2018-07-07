/**
 * Networking with server wrapper
 * */
import io          from "socket.io-client";
import EventEmiter from "events"

var Net = {};

var 
  socket,
  handlers,
  eEmiter;


Net.Init = function() {
  socket = io("/ingame");
  handlers = {};
  socket
    .on("connection_error" , Net.onFail)
    .on("put"              , Net.onPut)
    .on("update"           , ( data ) => Net.trigger("update"    , data) )
    .on("leave"            , ( data ) => Net.trigger("leave"     , data) )
    .on("skip"             , ( data ) => Net.trigger("skip"      , data) )
    .on("used"             , ( data ) => Net.trigger("used"      , data) )
    .on("incorrect"        , ( data ) => Net.trigger("incorrect" , data) )
    .on("correct"          , ( data ) => Net.trigger("correct"   , data) )
    .on("die"              , ( data ) => Net.trigger("die"       , data) )
    .on("end"              , ( data ) => Net.trigger("end") );
  eEmiter = new EventEmiter();
}

Net.On = function(event, handler) {
  eEmiter.on(event, handler);
  return this;
}

Net.trigger = function(event, data) {
  eEmiter.emit(event, data);
  return this;
}

Net.Join = function() {
  socket.emit("join");
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

Net.onPut = function(message) {
  Net.trigger("put", message);
  Net.Update();
}

Net.onFail = function(){
  console.log("Connection Failed");
  SetCookies("state", "main");
  location.reload();
}

export default Net;
