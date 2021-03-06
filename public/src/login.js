import $ from "jquery";
import Cookies from "js-cookie";
import io from "socket.io-client";

const Get = $.get;

var $RoomID, 
    $Join,
    $Start, 
    $Name, 
    $Warning,
    socket;

$(function() {
  $RoomID  = $("#inp-roomid");
  $Join    = $("#btn-join");
  $Start   = $("#btn-start");
  $Name    = $("#inp-name");
  $Warning = $("#warning");
  
  InitCreate();
  InitInputName();
  InitJoin();

})
function InitIO(){
  socket = io("/login");
  socket.on("reload", () => location.reload() );
}

function InitJoin(){
  $Join.click(function() {
    if (!ValidateName()) return;
    SaveName();
    Get("/login/join", 
      {
        room: $RoomID.val(),
        name: $Name.val()
      }, 
      function(data){
        if (data ==  "not-found"){
        $Warning.text("Can't find room ID");
      } else {
        location.reload();
      }
    });
  });
}

function InitInputName(){
  $Name.val(GetSavedName());
  $RoomID.on("input", function() {
    if ($RoomID.val() == "") {
      $Join.text("JOIN RANDOM");
    } else {
      $Join.text("JOIN");
    }
  });
  
  $Name.on("input", function(){
    $Warning.html("&nbsp");
  });

}

function InitCreate(){
  $Start.click(function(){
    if (!ValidateName()) return;
    SaveName();
    Get("/login/create-room", 
        { name: GetSavedName()},
        function(data){
          location.reload();
        }
    );
  });
}

function ValidateName(){
  if ($Name.val() == '') {
    $Warning.text("Name must be filled");
    return false;
  } 
  return true;
}

function SaveName(){
  Cookies.set("name", $Name.val());
}

function GetSavedName() {
  return Cookies.get("name", '');
}
