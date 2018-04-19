Dice = {
  fps: 30.0,
  nFrame: 80,
  timeStop: 1.5,
  state: "idle",
  spinTime: 0,
  last: null,
  nextStop: 0,
  highlight: false

};

Dice.init = function(img) {

  Dice.img = img;

  img.hover(
    function() {
      Dice.highlight = true;
    },
    function() {
      Dice.highlight = false;
    }
  ).click(function() {
    if (Dice.state != "spin") {
      Dice.state = "spin";
    }
  });
  requestAnimationFrame(Dice.step);
}

Dice.step = function(timestamp) {
  requestAnimationFrame(Dice.step);

  if (!Dice.last) Dice.last = timestamp;

  if (Dice.state == "spin") {
    Dice.spinTime += (timestamp - Dice.last) * 0.001;
    if (Dice.spinTime > Dice.nextStop) {
      Dice.state = "idle";
      Dice.nextStop += Dice.timeStop;
    }
  }

  var index = Math.floor(Dice.spinTime * Dice.fps) % Dice.nFrame;
  var filename = index.pad(4);
  if (Dice.highlight) {
    Dice.img.attr("src", "img/dice/highlight/" + filename + ".jpg");
  } else {
    Dice.img.attr("src", "img/dice/normal/" + filename + ".jpg");
  }

  Dice.last = timestamp;
}

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
}
