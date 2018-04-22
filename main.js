const express       =  require('express');
const socket        =  require('socket.io');
const app           =  express();
const pub           =  __dirname + '/public';
const io            =  socket(require('http').Server(app));
const cookieParser  =  require('cookie-parser')
const cookieSession =  require('cookie-session')

const LoginHandler  = require("./server/handler/login");
const RoomHandler   = require("./server/handler/room");

app.use(express.static('public'));
app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: [":)"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.get('/', 
  function(req, res) {
    if (!tryIndexHandler(LoginHandler, req, res)){
      tryIndexHandler(RoomHandler, req, res);
    }
  }
);

app.listen(3000, function(){
  console.log('PORT : 3000')
});

LoginHandler.init(app, io);
RoomHandler.init(app, io);


function tryIndexHandler(handler, req, res){
  if (handler.onIndex(req, res)){
    handler.handleIndex(req, res);
    return true;
  }
  return false;
};
