Player = require('./player');

console.log(Player);

var a = Player.createRandomPlayer('admin');

console.log(a);

var b = Player.createRandomPlayer('admin');
console.log(b);

a.leaveRoom();

console.log(Player);
