import $ from "jquery";
import Cookies from "js-cookie";
import io from "socket.io-client"

const LOG        = console.log;
const Get        = $.get;
const GetCookies = Cookies.get;
const SetCookies = Cookies.set;

var Status = null,
    Player = null,
    $Lock, 
    $RoomID, 
    $PlayerList,
    $Quit,
    $Start,
    socket;

$(function() {
  $PlayerList = $("#player-list");
  $Lock       = $("#img-lock");
  $RoomID     = $("#p-room-id");
  $Quit       = $("#quit");

  InitLock();
  InitQuit();
  InitStart();
  InitIO();
  UpdateFromServer();
})

function InitIO(){
  socket = io("/room");
  socket.on("connect_error", function(){
    console.log("Connection Failed");
    SetCookies("state", "main");
    location.reload();
  });

  socket
  .on("update", UpdateFromServer)
  .on("kicked", Leave)
  .on("start" , Start);

}



function InitQuit(){
  $Quit.click (function(){
    $Quit.attr("disabled", "disabled");
    Get("/room/leave", () => Leave() );
  });
}


function InitLock(){
  $Lock.click(function() {
    if (!Player.isHost) return;
    $Lock.css("opacity", 0.2);
    Get("/room/toggle-lock", function(lock){
        $Lock.css("opacity", 1);
        Status.lock = lock;
        render();
      });
  });
}

function InitStart(){
  $Start = $("#btn-start");
  $Start.click(function(){
    if (Player.isHost){ 
      Get("/room/start");
    }
  });
}

function Start(data){
  console.log(data);
  SetCookies("state", "ingame"); 
  location.reload();
}

function Leave(){
  SetCookies("state", "main");
  location.reload();
}

function UpdateFromServer() {
  Get("/room/status", function(data){
    if (data == "reload") {
      location.reload();
    } else {
      Status = data;
      updatePlayer();
      render();
    }
  });
}

function BindKick() {
  $(".btn-kick").click(function(event){
    Get("./room/kick",
      { id : event.target.value },
      () => UpdateFromServer())
  });
}

function render(){
  $Lock.attr("src", Status.lock ? "img/lock.png" : "img/unlock.png");
  $RoomID.text("ROOM ID : " + Status.id);  
  $PlayerList.html("");
  if (!Status) return;
  Status.players.forEach(function(player){
    var index = Status.players.indexOf(player);
    var template = ["<div class='player'>",
        "<div class='player-wrapper limit-width'>"]

    var crownHTML = "<img class='img-crown' src='img/crown.png'"
    if (!player.isHost){
      crownHTML += "style='opacity:0'";
    } 
    crownHTML += "/>"
    template.push(crownHTML);

    template.push("<p class='p-name'>" + player.name + "</p>");
    var CurrentID = GetCookies('id');
    var HostID    = Status.host.id; 
    if (CurrentID == HostID) {
      if (!player.isHost){
        template.push("<button class='btn-kick' style=" 
          + "font-size: 2.5vmin'"
          + "value='" + player.id + "'> kick </button>")
      }
    }
    template.push("</div>", "</div>");
    $PlayerList.append(template.join("\n"));
  });


  if (!Player.isHost){
    $Start.hide();
  } else {
    $Start.show();
  }
  BindKick();
}

function updatePlayer() { 
  Status.players.forEach(function(player){
    if (player.id == GetCookies("id")){
      Player = player;
    }
  });
}
