import { InitDice } from "./dice"

const Get = $.get;
const LOG = console.log;
var $RoomID, 
    $Join,
    $Start, 
    $Name, 
    $Warning;
    name;

$(function() {
  $RoomID  = $("#inp-roomid");
  $Join    = $("#btn-join");
  $Start   = $("#btn-start");
  $Name    = $("#inp-name");
  $Warning = $("#warning");

  InitDice($("#cdice"), GenName, SetName );
  InitCreate();
  InitInputName();
  InitJoin();
})

function InitJoin(){
  $Join.click(function() {
    if (!ValidateName()) return;
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
  name = Cookies.get("name");
  $Name.val(name === undefined ? name : '');
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
    Get("/login/create-room", 
        { name: name },
        function(data){
          location.reload();
        }
    );
  });
}

function GenName() {
  $Warning.html("&nbsp");
  Get("login/gen-name", function( data ){
      name = data;
      Cookies.set("name", name);
  });
}

function SetName() {
  $Name.val(Cookies.get("name"));
}

function ValidateName(){
  if ($Name.val() == '') {
    $Warning.text("Name must be filled");
    return false;
  } 
  return true;
}
