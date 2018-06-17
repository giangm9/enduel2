import EventBase from "../eventbase.js";
import $ from "jquery";

var Put = {},
  jcontainer,
  jinp,
  jbtn,
  jletter;

Put.Init = function(){

  jcontainer = $("#put");
  jinp       = jcontainer.find("#inp-put");
  jbtn       = jcontainer.find("#btn-put");
  jletter    = jcontainer.find("#letter");

  jbtn.click(submit);

  jinp.keyup(function(event){ 
    if (event.keyCode  === 13) { 
      jbtn.click();
    }
  });

  EventBase(Put);
}

Put.Letter = function(letter) {
 return jletter.html(letter);
}

function submit() {
  Put.trigger("put", jinp.val());
  jinp.val('');
}

export default Put;
