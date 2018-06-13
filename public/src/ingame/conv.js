/**
 * Chatbox view 
 * */

function Chatbox(jcontainer) {
  this.container = jcontainer;
}

/**
 * @type {string} message
 * */
Chatbox.prototype.add = function(message){
  var c = this.container;
  c.append("<p> " + message + "</p>");
}

export default Chatbox;
