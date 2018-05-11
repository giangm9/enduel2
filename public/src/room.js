import $ from 'jquery';
import Cookies from 'js-cookie';
import io from "socket.io-client"

const Get = $.get;
const LOG = console.log;

var status = null,
    $Lock, 
    $RoomID, 
    $PlayerList,
    $Quit,
    socket;

$(function() {
  $PlayerList = $("#player-list");
  $Lock       = $("#img-lock");
  $RoomID     = $("#p-room-id");
  $Quit       = $("#quit");

  updateRoomStatus();
  InitLock();
  InitQuit();
})


function InitQuit(){
  $Quit.click (function(){
    $Quit.attr("disabled", "disabled");
    Get("/room/leave", function(data){
      console.log(data);
      location.reload();
    });
  });
}

function InitLock(){
  $Lock.click(function() {
    $Lock.css("opacity", 0.2);
    Get("/room/toggle-lock", function(lock){
        $Lock.css("opacity", 1);
        status.lock = lock;
        render();
      });
  });
}


function updateRoomStatus() {
  Get("/room/status", function(data){
    if (data == "reload") {
      location.reload();
    }
    status = data;
    render();
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

    var crownHTML = "<img class='img-crown' src='img/crown.png'"
    if (player.isHost){
      crownHTML += "style='opacity:0'";
    } 
    crownHTML += "/>"
    template.push(crownHTML);

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
