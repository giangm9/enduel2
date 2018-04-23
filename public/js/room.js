const get = $.get;
var RoomStatus = null;
var imgLock, pRoomID, playerList, btnEsc;


$(function() {
  playerList    = $("#player-list");
  imgLock       = $("#img-lock");
  pRoomID       = $("#p-room-id");
  btnEsc        = $("#esc");

  updateRoomStatus();
  initBan();
  initLock();
  initEsc();
})

function initEsc(){
  btnEsc.click (function(){
    get("/room/esc", function(data){
      console.log(data);
    });
  });
}

function updateRoomStatus() {
  $.get("/room/status", function(data){
    RoomStatus = data;
    render();
  });
}

function initBan(){

  $(".btn-ban").hover(
      function() {
        console.log('hover in');
        $(this).css("opacity", "1.0");
      }, 
      function(){
        console.log('hover out');
        $(this).css("opacity", "0.5");
      }
    );

}

function initLock(){
  imgLock.click(function() {
    imgLock.css("opacity", 0.2);
    $.get("/room/toggle-lock", function(lock){
        imgLock.css("opacity", 1);
        RoomStatus.lock = lock;
        render();
      });
  });
}


function render(){

  imgLock.attr("src", RoomStatus.lock ? "img/lock.png" : "img/unlock.png");
  pRoomID.text("ROOM ID : " + RoomStatus.id);  
  playerList.html('');
  RoomStatus.players.forEach(function(player){
    var index = RoomStatus.players.indexOf(player);
    var template = ["<div class='player'>",
        "<div class='player-wrapper limit-width'>"]
    if (player.isHost){
      template.push("<img class='img-crown' src='img/crown.png'/>");
    } else {
      template.push("<img class='img-crown' style='opacity: 0' src='img/crown.png'/>");
    }
    template.push("<p class='p-name'>" + player.name + "</p>");
    template.push("<button class='btn-ban' style=" 
      + (index % 2 == 1 ? "'background: white'" : "'background : #DDD'")
      + "value='" + player.id + "'> kick </button>",
      "</div>",
    "</div>"
    )

    playerList.append(template.join("\n"));
  });
}
