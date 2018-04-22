$(function() {
  const inpRoomID = $("#inp-roomid");
  const btnJoin = $("#btn-join");

  Dice.init($("#cdice"),
    RandomName.genName,
    RandomName.setName
  );

  inpRoomID.on("input", function() {
    if (inpRoomID.val() == "") {
      btnJoin.text("JOIN RANDOM");
    } else {
      btnJoin.text("JOIN");
    }
  });

  retrieveID();

})

RandomName = {
  name: "",
  genName: function() {
    $.get("login/gen-name", function( name ){
      RandomName.name = name;
    });
  },
  setName: function() {
    $("#inp-name").val(RandomName.name);
  }
};

function retrieveID() {
  $.get(
    "login/retrieve-id",
    function() {
    console.log(document.cookie);
  });
}

