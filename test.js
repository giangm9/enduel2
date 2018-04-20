function test_logic() {
  require('./server/logic/test/player_test.js');
}

function test_client() {
  const express = require('express')
  const app = express()

  app.use(express.static('public'))
  //app.get('/', (req, res) => res.sendFile(  __dirname + '/public/login.html' ))
  app.get('/', (req, res) => res.sendFile(  __dirname + '/public/room.html' ))


  app.listen(3000, () => console.log('port: 3000'))
}

test_client();
//test_logic();
