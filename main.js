const express       = require('express');
const app           = express();
const http          = require('http').Server(app);
const io            = require('socket.io')(http);
const LoginHandler  = require("./server/handler/login");
const RoomHandler   = require("./server/handler/room");
const IngameHandler = require("./server/handler/ingame");
const Dict          = require("./server/logic/dict");
const utils         = require("./server/utils");
const config        = require("./configs");

console.log("Loaded config : ");
console.log(JSON.stringify(config, null, 2));

utils.Logger.Init();

app.use(express.static('public'));
app.use(require('cookie-parser')());
app.use(require('cookie-session')({
  name: "session",
  keys: ["['[]']"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.get('/', function(req, res) {
  if (tryHandler(LoginHandler, req, res)) return;
  if (tryHandler(RoomHandler , req, res)) return; 
  tryHandler(IngameHandler, req, res);
});


LoginHandler.Init(app, io);
RoomHandler.Init(app, io);
IngameHandler.Init(app, io);

Dict.Init("./data/full_word.txt", () => {
  http.listen(config.port, "0.0.0.0", null, function(){
    console.log('PORT : ' + config.port)
  });
});


function tryHandler(handler, req, res){
  if (handler.IsOnIndex(req, res)){
    handler.HandleIndex(req, res);
    return true;
  }
  return false;
}

