import $ from "jquery";

var 
  Queue = {},
  jcurrent,
  jnext;



Queue.Init = function() {
  jcurrent = $("#current");
  jnext = $("#next");
}

Queue.Set = function(current, next){
  if (current) {
    jcurrent.html(current);
  }

  if (next) {
    jnext.html(next);
  }
}

export default Queue;
