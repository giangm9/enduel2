import $ from "jquery";

var 
  Chatbox = {},
  jcontainer;


Chatbox.Init = function() {
  jcontainer = $("#chatbox");
  jcontainer.append("<div id='chatbox-wrapper'> </div>");
}

/**
 * @type {string} message
 * */
Chatbox.Add = function(name, word){
  var c = jcontainer;
  global.c = c;
  var wrapper = c.find("#chatbox-wrapper");
  wrapper.append("<div class='message-wrapper'> </div>");
  var message = wrapper.find("div.message-wrapper:last");
  message.append("<p class='message-user'>" + name + "</p>");
  message.append("<p class='message-content'>" + word + "</p>");
  c.scrollTop(wrapper.height());
}

export default Chatbox;
