const express       = require('express');
const socket        = require('socket.io');
const app           = express();
const http          = require('http').Server(app);
const io            = require('socket.io')(http);
const LoginHandler  = require("./server/handler/login");
const RoomHandler   = require("./server/handler/room");

app.use(express.static('public'));
app.use(require('cookie-parser')());
app.use(require('cookie-session')({
  name: "session",
  keys: ["['[]']"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.get('/', function(req, res) {
    if (!tryHandler(LoginHandler, req, res)){
      tryHandler(RoomHandler, req, res);
    }
  }
);

http.listen(8080, "localhost", null, function(){
  console.log('PORT : 8080')
});

LoginHandler.Init(app, io);
RoomHandler.init(app, io);

function tryHandler(handler, req, res){
  if (handler.IsOnIndex(req, res)){
    handler.HandleIndex(req, res);
    return true;
  }
  return false;
};
