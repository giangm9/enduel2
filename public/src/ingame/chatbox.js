
function Chatbox(jcontainer) {
  this.container = jcontainer;
  jcontainer.append("<div id='chatbox-wrapper'> </div>");
}

/**
 * @type {string} message
 * */
Chatbox.prototype.add = function(name, word){
  var c = this.container;
  global.c = c;
  var wrapper = c.find("#chatbox-wrapper");
  wrapper.append("<div class='message-wrapper'> </div>");
  var message = wrapper.find("div.message-wrapper:last");
  message.append("<p class='message-user'>" + name + "</p>");
  message.append("<p class='message-content'>" + word + "</p>");
  c.scrollTop(wrapper.height());
}

export default Chatbox;
