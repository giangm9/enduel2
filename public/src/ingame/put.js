function Put(container){
  this.jcontainer = container;

  this.state = "ans"; // chat
  this.callbacks = {};
  this.jinp = container.find("#inp-put");
  this.jbtn = container.find("#btn-put");

  this.jbtn.click(function() {
    if (this.callbacks["put"]){
      this.callbacks["put"](this.jinp.val());
    }
  }.bind(this));
}

Put.prototype.on = function(event, callback){
  this.callbacks[event] = callback;
}

export default Put;
