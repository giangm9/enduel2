import $ from "jquery";

var 
  Chatbox = {},
  container;


Chatbox.Init = function() {
  container = $("#chatbox");
  container.append("<div id='chatbox-wrapper'> </div>");
}

/**
 * @type {string} message
 * */
Chatbox.Add = function(name, word){
  var c = container;
  var wrapper = c.find("#chatbox-wrapper");
  var message = $("<div class='message-wrapper'> </div>");
  wrapper.append(message);
  message.append("<p class='message-user'>" + name + "</p>");
  message.append("<p class='message-content'>" + word + "</p>");
  c.scrollTop(wrapper.height());
}

export default Chatbox;
