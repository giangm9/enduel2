import EventBase from "../eventbase.js";
import $ from "jquery";

var Put = {},
  jcontainer,
  jinp,
  jbtn;

Put.Init = function(){

  jcontainer = $("#put");
  jinp       = jcontainer.find("#inp-put");
  jbtn       = jcontainer.find("#btn-put");

  jbtn.click(submit);

  jinp.keyup(function(event){ 
    if (event.keyCode  === 13) { 
      jbtn.click();
    } else {
      keepLetter();
    }
  });

  jinp.keydown(keepLetter)


  EventBase(Put);
}


Put.Disable = function() {
  jinp.prop("disabled", true);
  jbtn.prop("disabled", true);
}

Put.Enable = function() {
  jinp.prop("disabled", false);
  jbtn.prop("disabled", false);
}


function keepLetter() {
  var word = jinp.val();
  if (word.length > 0){
    jinp.val(Put.letter + word.slice(1));
  } else {
    jinp.val(Put.letter);
  }
}

Put.Letter = function(letter) {
  Put.letter = letter;
  keepLetter();
}

function submit() {
  Put.trigger("put", jinp.val());
  jinp.val('');
}

export default Put;
