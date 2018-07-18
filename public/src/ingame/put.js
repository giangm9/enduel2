import $           from "jquery";
import EventEmiter from "events";

var 
  Put = {},
  container,
  inp,
  btn, 
  eventEmiter;


Put.Init = function(){

  container = $("#put");
  inp       = container.find("#inp-put");
  btn       = container.find("#btn-put");

  btn.click(submit);

  inp.keyup(function(event){ 
    if (event.keyCode  === 13) { 
      btn.click();
    } else {
      keepLetter();
    }
  });

  inp.keydown(keepLetter)
  eventEmiter = new EventEmiter();

  keepCaret();
}




Put.Disable = function() {
  inp.prop("disabled", true);
  btn.prop("disabled", true);
}

Put.Enable = function() {
  inp.prop("disabled", false);
  btn.prop("disabled", false);
}



Put.Letter = function(letter) {
  Put.letter = letter;
  keepLetter();
}

Put.On = function(event, handler) {
  eventEmiter.on(event, handler);
  return this;
}

Put.Focus = function() {
  inp[0].focus();
}

Put.trigger = function(event, data) {
  eventEmiter.emit(event, data);
}

function submit() {
  Put.trigger("put", inp.val().trim());
  inp.val('');
}

function keepLetter() {
  var word = inp.val();
  if (word.length > 0){
    inp.val(Put.letter + word.slice(1).toLowerCase());
  } else {
    inp.val(Put.letter);
  }

}

function keepCaret() {
  requestAnimationFrame(keepCaret);
  if(!inp.is(":focus")) return;
  if (inp[0].selectionStart == 0) {
    inp[0].setSelectionRange(1, 1);
  }
}


export default Put;
