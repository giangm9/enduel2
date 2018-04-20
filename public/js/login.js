$(function() {
  const inpRoomID = $("#inp-roomid");
  const btnJoin = $("#btn-join");

  Dice.init($("#cdice"), getRandName, setName);
  getRandName(setName);

  inpRoomID.on("input", function() {
    if (inpRoomID.val() == "") {
      btnJoin.text("JOIN RANDOM");
    } else {
      btnJoin.text("JOIN");
    }
  });

})

var name = null;

function getRandName(callback) {
  $.ajax({
    url: "https://randomuser.me/api/?nat=us&inc=name&noinfo",
    dataType: 'json',
    success: function(data) {
      var first = data.results[0].name.first;
      var last = data.results[0].name.last;
      name = first + " " + last;
      if (callback) {
        callback();
      }
    }
  })
}

function setName() {
  const inpName = $("#inp-name");
  inpName.val(name);

}
