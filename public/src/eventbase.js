function EventBase( object ) {
  object.handlers = {};
  object.On       = On.bind(object);
  object.trigger  = trigger.bind(object);
}

function On(event, handler)  {
  var h = this.handlers;
  if (!h[event]){
    h[event] = [];
  }
  h[event].push(handler);
  return this;
}

function trigger(event, data){
  if (!this.handlers[event]) return;
  this.handlers[event].forEach(function(handler){
    handler(data);
  });
}



export default EventBase;
