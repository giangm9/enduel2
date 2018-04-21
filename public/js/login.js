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

  console.log(document.cookie);
})

RandomName = {
  name: "",
  genName: function() {
    $.ajax({
      url: "https://randomuser.me/api/?nat=us&inc=name&noinfo",
      dataType: 'json',
      success: function(data) {
        var first = data.results[0].name.first;
        var last = data.results[0].name.last;
        RandomName.name = first + " " + last;
      }
    })
  },
  setName: function() {
    $("#inp-name").val(RandomName.name);
  }
};
