Dice = {
  fps: 30.0,
  nFrame: 80.0,
  stop: 0.9,
  time: 0.0,
  next: 0.9,
  high: false,
  state: "idle",
  urlNorm: "img/norm.jpg",
  urlHigh: "img/high.jpg",
  last: null
};

Dice.init = function(jqcanvas, click, finish) {

  this.canvas = jqcanvas[0];
  this.context = this.canvas.getContext('2d');
  this.imgNorm = new Image();
  this.imgHigh = new Image();
  this.imgNorm.src = this.urlNorm;
  this.imgHigh.src = this.urlHigh;
  this.click = click;
  this.finish = finish;


  jqcanvas.hover(
    function() {
      Dice.high = true;
    },
    function() {
      Dice.high = false;
    }
  ).click(
    function() {
      Dice.state = "spin";
      Dice.click();
    }
  );
  Dice.step();
}

Dice.step = function(timestamp) {
  requestAnimationFrame(Dice.step);

  if (!Dice.last) Dice.last = timestamp;

  if (Dice.state == "spin") {
    Dice.time += (timestamp - Dice.last) * 0.001;

    if (Dice.time > Dice.next) {
      if (Dice.finish) {
        Dice.finish();
      }
      Dice.state = "idle";
      Dice.next += Dice.stop;
    }
  }

  var index = Math.floor(Dice.time * Dice.fps) % Dice.nFrame;
  Dice.render(index);
  Dice.last = timestamp;

}

Dice.render = function(index) {

  var width = 100;
  var height = 100;
  var nRow = 8;
  var nCol = 10;
  var row = Math.floor(index / nCol);
  var col = index % nCol;
  var startX = col * width;
  var startY = row * height;

  Dice.context.drawImage(
    Dice.high ? Dice.imgHigh : Dice.imgNorm,
    startX, startY,
    width, height,
    0, 0,
    Dice.canvas.width,
    Dice.canvas.height
  )

}
