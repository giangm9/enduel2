function Room(){
  this.id     = '';
  this.locked = true;
  this.player = '';
}

Room.all = [];

/*
  Create a room with random ID
  the id must be not duplicated
  @returns Room
*/
