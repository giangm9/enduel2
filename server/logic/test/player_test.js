Player = require('../player');

a = new Player();
console.log(a);

b = new Player();

console.log(b);

for (var i = 0 ; i < 10; i++){
  var x = new Player();
  console.log(x);
}

console.log(Player);
