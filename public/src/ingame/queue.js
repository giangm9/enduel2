import $ from "jquery";

var 
  Queue = {},
  jcurrent,
  jnext;



Queue.Init = function() {
  jcurrent = $("#current");
  jnext = $("#next");
}

Queue.UpdateFromData = function(data){
  var 
    current = data.current,
    next = data.next;

  if (current) {
    jcurrent.html(current.name + "[" + current.hp + "]");
  }

  if (next) {
    jnext.html(next.name + "[" + next.hp + "]");
  }
}

export default Queue;
