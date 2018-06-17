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

function keepLetter(event) {
  var word = jinp.val();

  jinp.val(Put.letter + word.slice(1));
}

Put.Letter = function(letter) {
  Put.letter = letter;
  jinp.val(letter);
}

function submit() {
  Put.trigger("put", jinp.val());
  jinp.val('');
}

export default Put;
