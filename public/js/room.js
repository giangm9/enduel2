const get = $.get;
var RoomStatus = null;
var imgLock, pRoomID, playerList, btnEsc;
var socket;

$(function() {
  playerList    = $("#player-list");
  imgLock       = $("#img-lock");
  pRoomID       = $("#p-room-id");
  btnQuit       = $("#quit");

  updateRoomStatus();
//  initBan();
  initLock();
  initQuit();
  initSocket();
})

function initSocket(){
  socket = io();
}

function initQuit(){
  btnQuit.click (function(){
    btnQuit.attr("disabled", "disabled");
    get("/room/leave", function(data){
      console.log(data);
      location.reload();
    });
  });
}

function updateRoomStatus() {
  $.get("/room/status", function(data){
    RoomStatus = data;
    console.log(data);
    render();
  });
}

//  function initBan(){
//    $(".btn-ban").hover(
//        function() {
//          console.log('hover in');
//          $(this).css("opacity", "1.0");
//        }, 
//        function(){
//          console.log('hover out');
//          $(this).css("opacity", "0.5");
//        }
//      );
//  }

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
    if (!player.isHost){
      template.push("<button class='btn-ban' style=" 
        + (index % 2 == 1 ? "'background: white;" : "'background : #DDD;")
        + "font-size: 2.5vmin'"
        + "value='" + player.id + "'> kick </button>")
    }
    template.push("</div>", "</div>");
    playerList.append(template.join("\n"));
  });
}
