const express      = require('express');
const socket       = require('socket.io');
const app          = express();
const pub          = __dirname + '/public';
const io           = socket(require('http').Server(app));
const cookieParser = require('cookie-parser')

const LoginHandler = require("./server/handler/login");


LoginHandler.init ( app, io );

app.use(express.static('public'));
app.use(cookieParser());

app.get('/', 
  function(req, res) {
    if (!tryHandler(LoginHandler, req, res)){
    }
  }
);

app.listen(3000, function(){
  console.log('PORT : 3000')
});

function tryHandler(handler, req, res){
  if (handler.onIndex(req, res)){
    handler.handleIndex(req, res);
    return true;
  }
  return false;
};
