const Get = $.get;
var status = null,
    $Lock, 
    $RoomID, 
    $PlayerList,
    $Quit,
    socket;

$(function() {
  $PlayerList    = $("#player-list");
  $Lock       = $("#img-lock");
  $RoomID       = $("#p-room-id");
  $Quit       = $("#quit");

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
  $Quit.click (function(){
    $Quit.attr("disabled", "disabled");
    Get("/room/leave", function(data){
      console.log(data);
      location.reload();
    });
  });
}

function updateRoomStatus() {
  Get("/room/status", function(data){
    status = data;
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
  $Lock.click(function() {
    $Lock.css("opacity", 0.2);
    Get("/room/toggle-lock", function(lock){
        $Lock.css("opacity", 1);
        status.lock = lock;
        render();
      });
  });
}


function render(){

  $Lock.attr("src", status.lock ? "img/lock.png" : "img/unlock.png");
  $RoomID.text("ROOM ID : " + status.id);  
  $PlayerList.html('');
  if (!status) return;
  status.players.forEach(function(player){
    var index = status.players.indexOf(player);
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
    $PlayerList.append(template.join("\n"));
  });
}
