/**
 * Networking with server wrapper
 * */
import io          from "socket.io-client";
import EventEmiter from "events"

var Net = {};

var 
  socket,
  eEmiter;


Net.Init = function() {
  socket = io("/ingame");
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

Net.Join = () =>  { socket.emit("join") }

Net.Leave = () => { socket.emit("leave") }

Net.Skip = () => { socket.emit("skip") }

Net.Put = (message) => { socket.emit("put", message) }

Net.Update = () => { socket.emit("update"); }

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
