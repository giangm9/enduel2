import $ from "jquery";

var 
  HP = {},
  jhp;


HP.Init = function() {
  jhp = $("#hp");
}

HP.SetHP = function(value) {
  jhp.html("HP : " + value);
}

export default HP;
