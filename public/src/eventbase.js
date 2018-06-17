function EventBase( object ) {
  object.handlers = {};
  object.On = function(event, handler){
    var h = object.handlers;
    if (!h[event]){
      h[event] = [];
    }
    h[event].append(handler);
    return this;
  }

  object.trigger = function(event, data){
    if (!object.handlers[event]) return;
    object.hanlders[event].forEach(function(handler){
      handler(data);
    });
  }
}

export default EventBase;
