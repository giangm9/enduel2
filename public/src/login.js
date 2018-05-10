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

  InitStartButton();
  InitInput();
  InitJoinButton();
})

function InitJoinButton(){
  $Join.click(function() {
    if (inpName.val() == '') {
      $Warning.text("Name must be filled");
      return
    } 
    if (inpRoomID.val() == '') {
      $Warning.text("Room ID must be filled");
      return;
    } 

    get("/login/join", 
      {
        room: inpRoomID.val()
      }, 
      function(data){
        if (data ==  "not-found"){
        $Warning.text("Can't find room ID");
      } else {
        console.log("found room");
        location.reload();
      }
    });
  });
}

function InitInput(){
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

function InitStartButton(){
  $Start.click(function(){
    if ($Name.val() == ''){
      $Warning.text("Name must be filled");
    } else {
      $.get(
        "/login/create-room", 
        { name: name },
        function(data){
          location.reload();
        }
      );
    }
   });
}

function GenName() {
  $Warning.html("&nbsp");
  Get("login/gen-name", function( data ){
      name = data;
      Cookies.set("name", name);
      LOG(data);
  });
}

function SetName() {
  $Name.val(Cookies.get("name"));
}
