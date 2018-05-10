var fps     = 30.0,
    nFrame  = 80.0,
    stop    = 0.9,
    time    = 0.0,
    next    = 0.9,
    high    = false,
    state   = "idle",
    urlNorm = "img/norm.jpg",
    urlHigh = "img/high.jpg",
    last    = null,
    canvas  = null,
    context = null,
    imgNorm = null,
    imgHigh = null,
    click   = null, 
    finish  = null;

function InitDice($canvas, click, finishcb) {
  canvas      = $canvas[0];
  context     = canvas.getContext('2d');
  imgNorm     = new Image();
  imgHigh     = new Image();
  imgNorm.src = urlNorm;
  imgHigh.src = urlHigh;
  click       = click;
  finish      = finishcb;

  $canvas.hover(
    function() {
      high = true;
    },
    function() {
      high = false;
    }
  ).click(
    function() {
      state = "spin";
      click();
    }
  );
  step();
}

function step(timestamp) {
  requestAnimationFrame(step);

  if (!last) last = timestamp;

  if (state == "spin") {
    time += (timestamp - last) * 0.001;

    if (time > next) {
        finish();
      state = "idle";
      next += stop;
    }
  }

  var index = Math.floor(time * fps) % nFrame;
  render(index);
  last = timestamp;

}

function render(index) {
  var width  = 100;
  var height = 100;
  var nRow   = 8;
  var nCol   = 10;
  var row    = Math.floor(index / nCol);
  var col    = index % nCol;
  var startX = col * width;
  var startY = row * height;

  context.drawImage(
    high ? imgHigh : imgNorm,
    startX, startY,
    width, height,
    0, 0,
    canvas.width,
    canvas.height
  )

} 

export { InitDice };
