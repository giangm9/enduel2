
function Chatbox(jcontainer) {
  this.container = jcontainer;
  jcontainer.append("<div id='chatbox-wrapper'> </div>");
}

/**
 * @type {string} message
 * */
Chatbox.prototype.add = function(message){
  var c = this.container;
  global.c = c;
  var wrapper = c.find("#chatbox-wrapper");
  wrapper.append("<p>" + message + "</p>");
  c.scrollTop(wrapper.height());
}

export default Chatbox;
