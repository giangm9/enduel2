$(function() {
  const fps = 30.0;
  const nFrame = 80;
  const imgDice = $("#img-dice");
  const spinTime = 1.5;

  var time = 0.0;
  var start = null;
  var last = null;
  var nextStop = spinTime;

  imgDice.hover(
    function() {
      imgDice.hightlight = true;
    },
    function() {
      imgDice.hightlight = false;
    }
  ).click(function() {
    if (imgDice.state != "spin") {
      imgDice.state = "spin";
    }
  });

  function step(timestamp) {
    requestAnimationFrame(step);
    if (!start) start = timestamp;
    if (!last) last = timestamp;

    if (imgDice.state == "spin") {
      time += (timestamp - last) * 0.001;
      if (time > nextStop) {
        imgDice.state = "idle";
        nextStop += spinTime;
      }
    }

    var index = Math.floor(time * fps) % nFrame;
    var filename = index.pad(4);
    if (imgDice.hightlight) {
      imgDice.attr("src", "img/dice/highlight/" + filename + ".jpg");
    } else {
      imgDice.attr("src", "img/dice/normal/" + filename + ".jpg");
    }



    last = timestamp;
  }

  requestAnimationFrame(step);

})

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
}
