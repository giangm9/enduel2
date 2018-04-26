const get = $.get;
var inpRoomID, btnJoin,
  btnStart, inpName, warning;
var name;
$(function() {
  inpRoomID = $("#inp-roomid");
  btnJoin   = $("#btn-join");
  btnStart  = $("#btn-start");
  inpName   = $("#inp-name");
  warning   = $("#warning");

  Dice.init($("#cdice"), genName, setName );

  retrieveID();
  initStartButton();
  initInput();
  initJoinButton();
})

function initJoinButton(){
  btnJoin.click(function() {
    if (inpName.val() == '') {
      warning.text("Name must be filled");
    } else if (inpRoomID.val() == '') {
      warning.text("Room ID must be filled");
    } else {
      get("/login/join", {
        room: inpRoomID.val()
      }, function(data){
        if (data ==  "not-found"){
          warning.text("Can't find room ID");
        } else {
          console.log("found room");
          location.reload();
        }
      });
    }
  });
}

function initInput(){
  name = Cookies.get("name");
  inpName.val(name === undefined ? name : '');
  inpRoomID.on("input", function() {
    if (inpRoomID.val() == "") {
      btnJoin.text("JOIN RANDOM");
    } else {
      btnJoin.text("JOIN");
    }
  });
  
  inpName.on("input", function(){
    warning.html("&nbsp");
  });

}

function initStartButton(){
  btnStart.click(function(){
    if (inpName.val() == ''){
      warning.text("Name must be filled");
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

function genName() {
  warning.html("&nbsp");
  $.get("login/gen-name", function( data ){
      name = data;
      Cookies.set("name", name);
  });
}

function setName() {
  inpName.val(name);
}

function retrieveID() {
  $.get("login/retrieve-id");
}
