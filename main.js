const express = require('express');
const app = express();

const pub = __dirname + '/public';

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile( pub + 'login.html' );
});

app.listen(3000, function(){
  console.log('PORT : 3000')
});



